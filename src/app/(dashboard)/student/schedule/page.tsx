'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useStudentSchedule } from './use-schedule'
import { FeedbackDialog } from '@/components/schedule/feedback-dialog'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { useState } from 'react'

export default function StudentSchedulePage() {
  const { schedules, isLoading, error } = useStudentSchedule()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const { toast } = useToast()

  if (isLoading) {
    return (
      <div className='flex h-[600px] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-[600px] items-center justify-center'>
        <p className='text-destructive'>{error}</p>
      </div>
    )
  }

  const handleFeedbackSubmit = async (feedback: {
    scheduleId: number
    status: 'completed' | 'missed'
    notes: string
  }) => {
    try {
      // Here you would typically make an API call to save the feedback
      // await saveFeedback(feedback)

      // Show notification
      toast({
        title:
          feedback.status === 'completed' ? 'Class Completed' : 'Class Missed',
        description: feedback.notes || 'No additional notes provided',
        variant: feedback.status === 'completed' ? 'default' : 'destructive',
      })
    } catch (e) {
      console.error(e)
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Transform schedules to FullCalendar event format
  const events = schedules.map((schedule) => ({
    id: schedule.id.toString(),
    title: schedule.title,
    start: new Date(schedule.start),
    end: new Date(schedule.end),
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    textColor: 'white',
    extendedProps: {
      studentName: schedule.studentName,
      subjectName: schedule.subjectName,
      scheduleId: schedule.id,
      teacherId: schedule.teacherId,
    },
  }))

  return (
    <div className='flex h-screen container mx-auto p-6 flex-col space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>My Schedule</h2>
      </div>
      <Card>
        <CardContent className='p-6'>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView='timeGridWeek'
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            events={events}
            height='auto'
            slotMinTime='06:00:00'
            slotMaxTime='20:00:00'
            slotDuration='00:30:00'
            allDaySlot={false}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false,
            }}
            eventClick={(info) => {
              setSelectedEvent(info.event)
              setShowEventDetails(true)
            }}
          />
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Class Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <h4 className='font-medium'>{selectedEvent.title}</h4>
                <p className='text-sm text-muted-foreground'>
                  {format(selectedEvent.start!, 'MMM d, yyyy h:mm a')} -{' '}
                  {format(selectedEvent.end!, 'h:mm a')}
                </p>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>
                    {selectedEvent.extendedProps.subjectName}
                  </Badge>
                </div>
              </div>
              <FeedbackDialog
                scheduleId={selectedEvent.extendedProps.scheduleId}
                teacherId={selectedEvent.extendedProps.teacherId}
                title={selectedEvent.title}
                startTime={selectedEvent.start!}
                endTime={selectedEvent.end!}
                onFeedbackSubmit={handleFeedbackSubmit}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
