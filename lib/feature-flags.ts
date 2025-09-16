export const featureFlags = {
  'ui.landing.v1': true,
  'onboarding.v1': true,
  'sessions.first.v1': true,
}

export const isFeatureEnabled = (flag: keyof typeof featureFlags): boolean => {
  return featureFlags[flag] ?? false
}