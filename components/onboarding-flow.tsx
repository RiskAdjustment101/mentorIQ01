'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { analytics } from '@/lib/analytics'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { Users, UserPlus } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  season: z.string().min(1, 'Season is required'),
})

const joinTeamSchema = z.object({
  code: z.string().min(1, 'Invite code is required').max(20),
})

type CreateTeamForm = z.infer<typeof createTeamSchema>
type JoinTeamForm = z.infer<typeof joinTeamSchema>

export default function OnboardingFlow() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState<'create' | 'join' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createForm = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      season: new Date().getFullYear().toString(),
    },
  })

  const joinForm = useForm<JoinTeamForm>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: {
      code: '',
    },
  })

  useEffect(() => {
    if (isFeatureEnabled('onboarding.v1')) {
      analytics.track('onboarding.view')
    }
  }, [])

  const handleCreateTeam = async (data: CreateTeamForm) => {
    setIsLoading(true)
    setError(null)
    analytics.track('onboarding.select', { option: 'create' })

    try {
      // Stub API call
      const response = await fetch('/api/v1/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create team')

      const { id } = await response.json()
      analytics.track('team.create.success', { teamId: id })
      router.push(`/teams/${id}`)
    } catch (err) {
      setError('Failed to create team. Please try again.')
      setIsLoading(false)
    }
  }

  const handleJoinTeam = async (data: JoinTeamForm) => {
    setIsLoading(true)
    setError(null)
    analytics.track('onboarding.select', { option: 'join' })

    try {
      // Stub API call
      const response = await fetch('/api/v1/teams:join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Invalid invite code')
        }
        throw new Error('Failed to join team')
      }

      const { id } = await response.json()
      analytics.track('team.join.success', { teamId: id })
      router.push(`/teams/${id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to join team. Please try again.')
      setIsLoading(false)
    }
  }

  const renderInitialChoice = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl text-center">Welcome to MentorIQ!</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => setSelectedOption('create')}
        >
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto mb-2 text-primary" />
            <CardTitle>Create a team</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Start a new mentoring team and invite members
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => setSelectedOption('join')}
        >
          <CardHeader className="text-center">
            <UserPlus className="h-12 w-12 mx-auto mb-2 text-primary" />
            <CardTitle>Join a team</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Enter an invite code to join an existing team
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </>
  )

  const renderCreateForm = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Create your team</DialogTitle>
      </DialogHeader>
      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(handleCreateTeam)} className="space-y-4 mt-4">
          <FormField
            control={createForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Robotics Team Alpha" 
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Season</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="2024" 
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedOption(null)
                setError(null)
              }}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )

  const renderJoinForm = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Join a team</DialogTitle>
      </DialogHeader>
      <Form {...joinForm}>
        <form onSubmit={joinForm.handleSubmit(handleJoinTeam)} className="space-y-4 mt-4">
          <FormField
            control={joinForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter invite code" 
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedOption(null)
                setError(null)
              }}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Joining...' : 'Join'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        {selectedOption === null && renderInitialChoice()}
        {selectedOption === 'create' && renderCreateForm()}
        {selectedOption === 'join' && renderJoinForm()}
      </DialogContent>
    </Dialog>
  )
}