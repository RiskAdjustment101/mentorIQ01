import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Stub API - POST /v1/teams/{teamId}/sessions
export async function POST(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { date, goals, agenda } = body

    if (!date || !goals || !agenda) {
      return NextResponse.json(
        { error: 'Date, goals, and agenda are required' },
        { status: 400 }
      )
    }

    // Stub: Create session in database
    const sessionId = `session_${Date.now()}`
    
    // TODO: Create audit event for session creation
    console.log(`[Audit] User ${userId} created session ${sessionId} for team ${params.teamId}`)

    return NextResponse.json({ 
      id: sessionId,
      teamId: params.teamId,
      date,
      goals,
      agenda,
      createdBy: userId,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}