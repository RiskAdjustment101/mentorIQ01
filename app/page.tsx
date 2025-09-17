'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { analytics } from '@/lib/analytics'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { useClerk } from '@clerk/nextjs'
import { Sparkles, Zap, Shield, Globe } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { openSignIn, openSignUp } = useClerk()

  useEffect(() => {
    if (isFeatureEnabled('ui.landing.v1')) {
      analytics.track('landing.view')
    }
  }, [])

  const handleGetStarted = () => {
    analytics.track('landing.cta.click', { cta: 'get-started' })
    analytics.track('auth.start', { method: 'clerk' })
    openSignUp({
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard',
    })
  }

  const handleSignIn = () => {
    analytics.track('landing.cta.click', { cta: 'signin' })
    analytics.track('auth.start', { method: 'clerk' })
    openSignIn({
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard',
    })
  }

  const differentiators = [
    {
      icon: Sparkles,
      title: 'Plan Smarter',
      description: 'AI drafts session agendas and checklists instantly',
    },
    {
      icon: Zap,
      title: 'Save Time',
      description: 'One-click setup; focus on mentoring, not admin',
    },
    {
      icon: Shield,
      title: 'Built for Trust',
      description: 'Secure logins, parental consent, and compliance baked in',
    },
    {
      icon: Globe,
      title: 'Connected Knowledge',
      description: 'Access proven playbooks and insights from experts',
    },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Pane - Hero/Action */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-20">
        <div className="max-w-xl mx-auto lg:mx-0">
          {/* Logo/Brand - Bold and Confident */}
          <div className="mb-12">
            <span className="text-4xl lg:text-5xl font-black text-primary tracking-tight">
              MentorIQ
            </span>
          </div>

          {/* Hero Content - Nike-style Bold Hierarchy */}
          <div className="space-y-10">
            {/* Headline - Maximum Impact with Perfect Spacing */}
            <h1 className="text-5xl lg:text-7xl font-black leading-[0.85] tracking-[-0.02em]">
              <div className="mb-2">
                <span className="text-muted-foreground">AI-Powered</span>
              </div>
              <div className="mb-3">
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Mentorship
                </span>
              </div>
              <div className="text-foreground">
                for <span className="italic font-light">FLL</span> Teams
              </div>
            </h1>

            {/* Subtext - Confident and Clear */}
            <p className="text-xl lg:text-2xl text-muted-foreground font-medium leading-relaxed max-w-lg">
              Plan smarter, save time, and inspire students with your AI co-pilot.
            </p>

            {/* Primary CTA - Bold Action */}
            <div className="space-y-6 pt-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="px-12 py-8 text-xl font-bold bg-primary hover:bg-primary/90 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                aria-label="Get started with MentorIQ"
              >
                Get Started
              </Button>

              {/* Optional Sign In Link - Subtle but Present */}
              <div className="text-base">
                <button
                  onClick={handleSignIn}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Already have an account? <span className="underline">Sign in</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Marketing Differentiators */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-20 bg-secondary/20">
        <div className="max-w-xl mx-auto lg:mx-0">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose MentorIQ?
            </h2>
            <div className="w-16 h-1 bg-primary"></div>
          </div>

          {/* Differentiators - Nike-style Confidence */}
          <div className="space-y-12">
            {differentiators.map((item, index) => (
              <div key={index} className="flex items-start gap-6 group">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}