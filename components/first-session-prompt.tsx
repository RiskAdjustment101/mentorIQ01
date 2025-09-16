'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { analytics } from '@/lib/analytics'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { CalendarDays, Target, ListChecks, Plus, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FirstSessionPromptProps {
  teamId: string
}

export default function FirstSessionPrompt({ teamId }: FirstSessionPromptProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionDate, setSessionDate] = useState('')
  const [goals, setGoals] = useState<string[]>(['Build teamwork', 'Learn basics', 'Have fun'])
  const [newGoal, setNewGoal] = useState('')
  const [agendaItems, setAgendaItems] = useState([
    'Kickoff & roles',
    'Mission overview',
    'Hands-on build time'
  ])
  const [newAgendaItem, setNewAgendaItem] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    // Set default date to next Saturday
    const today = new Date()
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7
    const nextSaturday = new Date(today)
    nextSaturday.setDate(today.getDate() + daysUntilSaturday)
    setSessionDate(nextSaturday.toISOString().split('T')[0])

    if (isFeatureEnabled('sessions.first.v1')) {
      analytics.track('session.first.prompt.view')
    }
  }, [])

  const handleStartCreating = () => {
    setIsCreating(true)
    analytics.track('session.create.start')
  }

  const handleAddGoal = () => {
    if (newGoal.trim() && goals.length < 5) {
      setGoals([...goals, newGoal.trim()])
      setNewGoal('')
    }
  }

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index))
  }

  const handleAddAgendaItem = () => {
    if (newAgendaItem.trim() && agendaItems.length < 10) {
      setAgendaItems([...agendaItems, newAgendaItem.trim()])
      setNewAgendaItem('')
    }
  }

  const handleRemoveAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index))
  }

  const handleSaveSession = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/v1/teams/${teamId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: sessionDate,
          goals,
          agenda: agendaItems,
        }),
      })

      if (!response.ok) throw new Error('Failed to create session')

      const { id } = await response.json()
      analytics.track('session.create.success', { sessionId: id })
      
      toast({
        title: 'Session created!',
        description: 'Your first mentoring session has been set up.',
      })
      
      // Hide the prompt after success
      setIsCreating(false)
      // In a real app, this would trigger a re-fetch of sessions
    } catch (error) {
      console.error('Error creating session:', error)
      toast({
        title: 'Error',
        description: 'Failed to create session. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isCreating) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Create your first session
          </CardTitle>
          <CardDescription>
            Get started by planning your first mentoring session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStartCreating} className="bg-primary hover:bg-primary/90">
            Start
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Plan Your First Session</CardTitle>
        <CardDescription>
          Set up a simple agenda to guide your first mentoring meeting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Session Date
          </Label>
          <Input
            id="date"
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Goals */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Session Goals
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {goals.map((goal, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {goal}
                <button
                  onClick={() => handleRemoveGoal(index)}
                  className="ml-1 hover:text-destructive"
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          {goals.length < 5 && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a goal"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddGoal}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Agenda Items */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Agenda Items
          </Label>
          <div className="space-y-2">
            {agendaItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted-foreground">{index + 1}.</span>
                <Input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...agendaItems]
                    newItems[index] = e.target.value
                    setAgendaItems(newItems)
                  }}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAgendaItem(index)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {agendaItems.length < 10 && (
            <div className="flex gap-2">
              <Input
                placeholder="Add agenda item"
                value={newAgendaItem}
                onChange={(e) => setNewAgendaItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAgendaItem()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddAgendaItem}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={() => setIsCreating(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSession}
            disabled={isLoading || !sessionDate || goals.length === 0 || agendaItems.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Saving...' : 'Save Session'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}