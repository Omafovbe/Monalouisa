'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, XCircle } from 'lucide-react'
import { createFeedback } from '@/actions/actions'
import { toast } from '@/hooks/use-toast'

interface FeedbackDialogProps {
  scheduleId: number
  teacherId: string
  title: string
  startTime: Date
  endTime: Date
  onFeedbackSubmit: (feedback: {
    scheduleId: number
    status: 'completed' | 'missed'
    notes: string
  }) => void
}

export function FeedbackDialog({
  scheduleId,
  teacherId,

  onFeedbackSubmit,
}: FeedbackDialogProps) {
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'completed' | 'missed' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!status) return

    try {
      setIsSubmitting(true)
      const result = await createFeedback({
        teacherId,
        rating: status === 'completed' ? 5 : 1,
        comment: notes,
        status,
      })

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Feedback submitted successfully',
        })
        onFeedbackSubmit({
          scheduleId,
          status,
          notes,
        })
        // Reset form
        setNotes('')
        setStatus(null)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit feedback',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-2'>
        <Button
          variant={status === 'completed' ? 'default' : 'outline'}
          className='flex-1'
          onClick={() => setStatus('completed')}
          disabled={isSubmitting}
        >
          <CheckCircle2 className='mr-2 h-4 w-4' />
          Class Completed
        </Button>
        <Button
          variant={status === 'missed' ? 'destructive' : 'outline'}
          className='flex-1'
          onClick={() => setStatus('missed')}
          disabled={isSubmitting}
        >
          <XCircle className='mr-2 h-4 w-4' />
          Class Missed
        </Button>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Additional Notes</label>
        <Textarea
          placeholder='Add any additional notes about the class...'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className='min-h-[100px]'
          disabled={isSubmitting}
        />
      </div>

      <Button
        className='w-full'
        disabled={!status || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </div>
  )
}
