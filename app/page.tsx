'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { analytics } from '@/lib/analytics'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { useClerk } from '@clerk/nextjs'
import { CheckCircle } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { openSignIn, openSignUp } = useClerk()

  useEffect(() => {
    if (isFeatureEnabled('ui.landing.v1')) {
      analytics.track('landing.view')
    }
  }, [])

  const handleSignIn = () => {
    analytics.track('landing.cta.click', { cta: 'signin' })
    analytics.track('auth.start', { method: 'clerk' })
    openSignIn({
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard',
    })
  }

  const handleCreateAccount = () => {
    analytics.track('landing.cta.click', { cta: 'create' })
    analytics.track('auth.start', { method: 'clerk' })
    openSignUp({
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard',
    })
  }

  const bullets = [
    'Plan weekly sessions',
    'Assign & track tasks',
    'Share parent digests',
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl font-bold text-primary">MentorIQ</span>
        </div>

        {/* H1 - Main headline */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Mentoring, made simple.
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
          Plan sessions, track progress, and keep parents in the loop — all in minutes.
        </p>

        {/* Bullets */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center text-sm md:text-base">
          {bullets.map((bullet, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        <Separator className="w-32" />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            onClick={handleSignIn}
            className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90"
            aria-label="Sign in to MentorIQ"
          >
            Sign in
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleCreateAccount}
            className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-border hover:bg-secondary"
            aria-label="Create a new MentorIQ account"
          >
            Create account
          </Button>
        </div>

        {/* Footer with minimal legal links */}
        <div className="pt-8 text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <a href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <Separator orientation="vertical" className="h-3" />
            <a href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}