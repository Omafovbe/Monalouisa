'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useStudentSchedule } from './use-schedule'

export default function StudentSchedulePage() {
  const { schedules, isLoading, error } = useStudentSchedule()

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
              // Show event details in a tooltip or modal
              alert(`
                Subject: ${info.event.extendedProps.subjectName}
                Student: ${info.event.extendedProps.studentName}
                Time: ${info.event.start?.toLocaleTimeString()} - ${info.event.end?.toLocaleTimeString()}
              `)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
