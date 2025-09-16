import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import FirstSessionPrompt from '@/components/first-session-prompt'

export default async function TeamPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // TODO: Check if team has sessions
  const teamHasSessions = false // This will come from API

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Team Dashboard</h1>
        <p className="text-muted-foreground mb-8">Team ID: {params.id}</p>
        
        {!teamHasSessions && <FirstSessionPrompt teamId={params.id} />}
        
        {teamHasSessions && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Sessions</h2>
            {/* Session list would go here */}
          </div>
        )}
      </div>
    </div>
  )
}