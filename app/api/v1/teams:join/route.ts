import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Stub API - POST /v1/teams:join
export async function POST(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      )
    }

    // Stub: Validate invite code
    // For demo purposes, accept codes starting with "VALID"
    if (!code.startsWith('VALID')) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      )
    }

    const teamId = `team_${Date.now()}`
    
    // TODO: Create audit event for team join
    console.log(`[Audit] User ${userId} joined team ${teamId} with code ${code}`)

    return NextResponse.json({ 
      id: teamId,
      joinedWith: code,
      role: 'Member' // Role would come from invite
    })
  } catch (error) {
    console.error('Error joining team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}