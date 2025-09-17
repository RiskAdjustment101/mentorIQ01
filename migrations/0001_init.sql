-- 0001_init.sql — MentorIQ core schema with RLS, RBAC, consent & tamper-evident audit
-- Apply on Neon (Postgres 15+). Requires extension: pgcrypto for SHA-256.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Tenancy context helpers -----------------------------------------------
-- App middleware must run (per request):
--   SET app.user_id = '<uuid>';
--   SET app.org_id  = '<uuid>';
CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid
LANGUAGE sql STABLE AS $$ SELECT current_setting('app.user_id', true)::uuid $$;

CREATE OR REPLACE FUNCTION current_org_id() RETURNS uuid
LANGUAGE sql STABLE AS $$ SELECT current_setting('app.org_id', true)::uuid $$;

-- 2) Orgs -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orgs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Users (identity mirror) -------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text UNIQUE NOT NULL,
  email text,
  display_name text,
  first_seen_at timestamptz,
  last_seen_at timestamptz,
  login_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4) Roles & Permissions (RBAC) ---------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL -- e.g., admin, mentor, parent_viewer
);

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL -- e.g., team.read, team.write, session.write
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 5) Teams & Memberships (tenant-scoped) ------------------------------------
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id),
  name text NOT NULL,
  season text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id),
  invited_by_user_id uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- 6) Guardians/Children/Consent (pseudonymous) ------------------------------
CREATE TABLE IF NOT EXISTS children (
  child_ref text PRIMARY KEY,            -- pseudonymous stable ID
  display_label text,                    -- optional neutral label
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guardians (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guardian_children (
  guardian_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_ref text NOT NULL REFERENCES children(child_ref) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (guardian_user_id, child_ref)
);

CREATE TABLE IF NOT EXISTS consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id),
  child_ref text NOT NULL REFERENCES children(child_ref) ON DELETE CASCADE,
  guardian_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope jsonb NOT NULL,               -- team, season, data types
  method text,                        -- email/attestation/etc.
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Helper: consent check (used by views/policies)
CREATE OR REPLACE FUNCTION has_active_consent(p_guardian uuid, p_child text)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM consents c
    WHERE c.guardian_user_id = p_guardian
      AND c.child_ref = p_child
      AND c.verified_at IS NOT NULL
  );
$$;

-- 7) Login & Audit (append-only with hash chain) ----------------------------
CREATE TABLE IF NOT EXISTS login_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id),
  user_id uuid NOT NULL REFERENCES users(id),
  clerk_session_id text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  ip inet,
  user_agent text
);
CREATE INDEX IF NOT EXISTS login_events_org_time_idx ON login_events (org_id, occurred_at);

CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id),
  actor_user_id uuid REFERENCES users(id),
  action text NOT NULL,             -- e.g., team.create
  resource text NOT NULL,           -- e.g., team
  resource_id text NOT NULL,
  diff jsonb,                       -- redacted pre/post
  correlation_id text,
  ip inet,
  user_agent text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  prev_hash bytea,
  self_hash bytea
);
CREATE INDEX IF NOT EXISTS audit_events_org_time_idx ON audit_events (org_id, occurred_at);

-- Append-only: block UPDATE/DELETE
CREATE OR REPLACE FUNCTION audit_events_block_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only';
END; $$;

DROP TRIGGER IF EXISTS audit_events_no_update ON audit_events;
CREATE TRIGGER audit_events_no_update
  BEFORE UPDATE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_block_change();

DROP TRIGGER IF EXISTS audit_events_no_delete ON audit_events;
CREATE TRIGGER audit_events_no_delete
  BEFORE DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_block_change();

-- Hash chain & self-hash on INSERT
CREATE OR REPLACE FUNCTION audit_events_hash_chain()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  last_hash bytea;
BEGIN
  SELECT self_hash INTO last_hash
  FROM audit_events
  WHERE org_id = NEW.org_id
  ORDER BY occurred_at DESC, id DESC
  LIMIT 1;

  NEW.prev_hash := last_hash;
  NEW.self_hash := digest(
    coalesce(NEW.org_id::text,'')    || '|' ||
    coalesce(NEW.actor_user_id::text,'') || '|' ||
    coalesce(NEW.action,'')          || '|' ||
    coalesce(NEW.resource,'')        || '|' ||
    coalesce(NEW.resource_id,'')     || '|' ||
    coalesce(NEW.correlation_id,'')  || '|' ||
    coalesce(NEW.occurred_at::text,'')
  , 'sha256');
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS audit_events_on_insert ON audit_events;
CREATE TRIGGER audit_events_on_insert
  BEFORE INSERT ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_hash_chain();

-- Single privileged write path for audit
CREATE OR REPLACE FUNCTION log_audit(
  p_org_id uuid,
  p_actor uuid,
  p_action text,
  p_resource text,
  p_resource_id text,
  p_diff jsonb,
  p_corr text,
  p_ip inet,
  p_ua text
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO audit_events(org_id, actor_user_id, action, resource, resource_id, diff, correlation_id, ip, user_agent)
  VALUES (p_org_id, p_actor, p_action, p_resource, p_resource_id, p_diff, p_corr, p_ip, p_ua)
  RETURNING id INTO v_id;
  RETURN v_id;
END; $$;

-- 8) RLS: enable and add policies ------------------------------------------
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Tenant isolation by org_id
DROP POLICY IF EXISTS teams_tenant_isolation ON teams;
CREATE POLICY teams_tenant_isolation
  ON teams FOR ALL
  USING (org_id = current_org_id())
  WITH CHECK (org_id = current_org_id());

DROP POLICY IF EXISTS team_members_tenant_isolation ON team_members;
CREATE POLICY team_members_tenant_isolation
  ON team_members FOR ALL
  USING (team_id IN (SELECT id FROM teams WHERE org_id = current_org_id()))
  WITH CHECK (team_id IN (SELECT id FROM teams WHERE org_id = current_org_id()));

DROP POLICY IF EXISTS consents_tenant_isolation ON consents;
CREATE POLICY consents_tenant_isolation
  ON consents FOR ALL
  USING (org_id = current_org_id())
  WITH CHECK (org_id = current_org_id());

DROP POLICY IF EXISTS login_events_tenant_isolation ON login_events;
CREATE POLICY login_events_tenant_isolation
  ON login_events FOR ALL
  USING (org_id = current_org_id())
  WITH CHECK (org_id = current_org_id());

DROP POLICY IF EXISTS audit_events_tenant_isolation ON audit_events;
CREATE POLICY audit_events_tenant_isolation
  ON audit_events FOR SELECT
  USING (org_id = current_org_id());

-- Membership-based read on team_members (deny-by-default beyond tenant)
DROP POLICY IF EXISTS team_members_read_own ON team_members;
CREATE POLICY team_members_read_own
  ON team_members FOR SELECT
  USING (user_id = current_user_id());

-- Example: writes allowed only to users with an admin role on that team.
CREATE OR REPLACE FUNCTION is_team_admin(p_team uuid, p_user uuid) RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1
    FROM team_members tm
    JOIN roles r ON r.id = tm.role_id
    WHERE tm.team_id = p_team AND tm.user_id = p_user AND r.name = 'admin'
  );
$$;

DROP POLICY IF EXISTS team_members_write_admin_only ON team_members;
CREATE POLICY team_members_write_admin_only
  ON team_members FOR INSERT WITH CHECK (is_team_admin(team_id, current_user_id()));

DROP POLICY IF EXISTS team_members_update_admin_only ON team_members;
CREATE POLICY team_members_update_admin_only
  ON team_members FOR UPDATE USING (is_team_admin(team_id, current_user_id()))
  WITH CHECK (is_team_admin(team_id, current_user_id()));

-- 9) Seed minimal roles & permissions ---------------------------------------
INSERT INTO roles(name) VALUES ('admin') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES ('mentor') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES ('parent_viewer') ON CONFLICT DO NOTHING;

INSERT INTO permissions(name) VALUES ('team.read') ON CONFLICT DO NOTHING;
INSERT INTO permissions(name) VALUES ('team.write') ON CONFLICT DO NOTHING;
INSERT INTO permissions(name) VALUES ('session.write') ON CONFLICT DO NOTHING;

-- Map admin → all
INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- mentor → read + session.write
INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN ('team.read','session.write')
WHERE r.name = 'mentor'
ON CONFLICT DO NOTHING;

-- parent_viewer → read only
INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN ('team.read')
WHERE r.name = 'parent_viewer'
ON CONFLICT DO NOTHING;
