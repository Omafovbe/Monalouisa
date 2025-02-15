'use client'

import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useStudentSchedule, type Schedule } from './use-schedule'
import { useState, useMemo } from 'react'

// Setup the localizer
const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Add custom toolbar formats
const formats = {
  monthHeaderFormat: 'MMMM yyyy',
  dayHeaderFormat: 'EEEE, MMMM d, yyyy',
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, 'MMMM d')} – ${format(end, 'MMMM d, yyyy')}`,
}

export default function StudentSchedulePage() {
  const { schedules, isLoading, error } = useStudentSchedule()
  const [view, setView] = useState<View>('week')
  const [date, setDate] = useState(new Date())

  // Calendar event handlers
  const { views } = useMemo(
    () => ({
      views: {
        month: true,
        week: true,
        day: true,
      },
    }),
    []
  )

  // Handle view change
  const handleViewChange = (newView: View) => {
    setView(newView)
  }

  // Handle navigation
  const handleNavigate = (newDate: Date) => {
    setDate(newDate)
  }

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

  // Calendar event style
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#6366F1',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block',
    },
  })

  return (
    <div className='flex h-screen container mx-auto p-6 flex-col space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>My Schedule</h2>
      </div>
      <Card>
        <CardContent className='p-6'>
          <Calendar<Schedule>
            localizer={localizer}
            events={schedules.map((schedule) => ({
              ...schedule,
              start: new Date(schedule.start),
              end: new Date(schedule.end),
            }))}
            startAccessor='start'
            endAccessor='end'
            style={{ height: 500 }}
            view={view}
            onView={handleViewChange}
            date={date}
            onNavigate={handleNavigate}
            views={views}
            formats={formats}
            eventPropGetter={eventStyleGetter}
            popup
            step={30}
            timeslots={4}
          />
        </CardContent>
      </Card>
    </div>
  )
}
