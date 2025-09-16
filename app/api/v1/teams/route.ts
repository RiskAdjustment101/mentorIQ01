import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Stub API - POST /v1/teams
export async function POST(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, season } = body

    if (!name || !season) {
      return NextResponse.json(
        { error: 'Name and season are required' },
        { status: 400 }
      )
    }

    // Stub: Create team in database
    const teamId = `team_${Date.now()}`
    
    // TODO: Create audit event for team creation
    console.log(`[Audit] User ${userId} created team ${teamId}`)

    return NextResponse.json({ 
      id: teamId,
      name,
      season,
      createdBy: userId,
      role: 'Mentor'
    })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}