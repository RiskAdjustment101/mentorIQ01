import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import OnboardingFlow from '@/components/onboarding-flow'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // TODO: Check if user has teams
  const userHasTeams = false // This will come from API

  if (!userHasTeams) {
    return <OnboardingFlow />
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to MentorIQ!</p>
    </div>
  )
}