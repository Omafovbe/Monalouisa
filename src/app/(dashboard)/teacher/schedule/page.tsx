'use client'

import { useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useSchedule, type ScheduleFormValues } from '@/hooks/use-schedule'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/hooks/use-toast'

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

// Add student color mapping
const studentColors = [
  '#4ECDC4', // Turquoise
  '#FF6B6B', // Coral Red
  '#45B7D1', // Sky Blue
  '#96CEB4', // Sage Green
  '#FFEEAD', // Cream Yellow
  '#D4A5A5', // Dusty Rose
  '#9FA8DA', // Periwinkle
  '#FFE082', // Pale Yellow
]

// Form schema for schedule creation/editing
const scheduleFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  studentId: z.string().min(1, 'Student is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
})

// Add this interface after the scheduleFormSchema
interface Schedule {
  id: number
  title: string
  start: Date
  end: Date
  studentId: string
  subjectId: number
  studentName: string
  subjectName: string
}

export default function SchedulePage() {
  const [selectedSlot, setSelectedSlot] = useState<object | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())

  const {
    schedules,
    students,
    subjects,
    isLoading,
    createSchedule,
    deleteSchedule,
  } = useSchedule()

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      title: '',
      studentId: '',
      subjectId: '',
      startTime: '',
      endTime: '',
    },
  })

  // Add student color mapping
  const studentColorMap = useMemo(() => {
    const uniqueStudentIds = Array.from(
      new Set(schedules.map((schedule) => schedule.studentId))
    )
    return Object.fromEntries(
      uniqueStudentIds.map((id, index) => [
        id,
        studentColors[index % studentColors.length],
      ])
    )
  }, [schedules])

  // Handle slot selection (creating new schedule)
  const handleSelectSlot = (slotInfo: {
    start: Date
    end: Date
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */

    resource?: any // Optional, include if your slots have resources
  }) => {
    setSelectedSlot(slotInfo)
    form.reset({
      title: '',
      studentId: '',
      subjectId: '',
      startTime: format(slotInfo.start, "yyyy-MM-dd'T'HH:mm"),
      endTime: format(slotInfo.end, "yyyy-MM-dd'T'HH:mm"),
    })
  }

  // Handle event selection (editing existing schedule)
  const handleSelectEvent = (event: Schedule) => {
    setSelectedEvent(event)
    form.reset({
      title: event.title.split(' - ')[0],
      studentId: event.studentId,
      subjectId: event.subjectId.toString(),
      startTime: format(new Date(event.start), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(event.end), "yyyy-MM-dd'T'HH:mm"),
    })
  }

  // Handle form submission
  const onSubmit = (values: ScheduleFormValues) => {
    try {
      // Validate required fields
      if (
        !values.studentId ||
        !values.subjectId ||
        !values.startTime ||
        !values.endTime
      ) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        })
        return
      }

      // Create the schedule
      createSchedule(values)

      // Reset form and close dialog
      form.reset()
      setSelectedSlot(null)
      setSelectedEvent(null)
    } catch (error) {
      console.error('Error creating schedule:', error)
      toast({
        title: 'Error',
        description: 'Failed to create schedule',
        variant: 'destructive',
      })
    }
  }

  // Handle schedule deletion
  const handleDelete = () => {
    if (!selectedEvent?.id) return
    deleteSchedule(selectedEvent.id)
    setSelectedEvent(null)
    setIsDeleteDialogOpen(false)
  }

  // Replace the eventStyleGetter function
  const eventStyleGetter = (event: Schedule) => ({
    style: {
      backgroundColor: studentColorMap[event.studentId] || '#6366F1',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block',
    },
  })

  // Calendar event handlers
  const { views } = useMemo(
    () => ({
      views: {
        month: true,
        week: true,
        day: true,
        agenda: true,
      },
    }),
    []
  )

  // Handle view change
  const handleViewChange = (newView: View) => {
    console.log('View changed to:', newView)
    setView(newView)
  }

  // Handle navigation
  const handleNavigate = (newDate: Date) => {
    console.log('Navigating to:', newDate)
    setDate(newDate)
  }

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <Card>
        <CardContent className='p-6'>
          <Calendar
            localizer={localizer}
            events={schedules.map((schedule) => ({
              ...schedule,
              start: new Date(schedule.start),
              end: new Date(schedule.end),
            }))}
            startAccessor='start'
            endAccessor='end'
            style={{ height: 700 }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            view={view}
            onView={handleViewChange}
            date={date}
            onNavigate={handleNavigate}
            views={views}
            formats={formats}
            popup
            step={30}
            timeslots={4}
            toolbar={true}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Schedule Dialog */}
      <Dialog
        open={!!selectedSlot || !!selectedEvent}
        onOpenChange={() => {
          setSelectedSlot(null)
          setSelectedEvent(null)
        }}
      >
        <DialogContent
          className='sm:max-w-[425px]'
          aria-describedby='schedule-dialog-description'
        >
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Schedule' : 'Create Schedule'}
            </DialogTitle>
          </DialogHeader>
          <div id='schedule-dialog-description'>
            {selectedEvent
              ? 'Edit an existing schedule'
              : 'Create a new schedule for your class'}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='studentId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a student' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students?.map(
                          (student: {
                            id: string
                            name: string | null
                            email: string
                            assignedAt: Date
                          }) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name || student.email}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='subjectId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a subject' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects?.map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={subject.id.toString()}
                          >
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='startTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type='datetime-local' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='endTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type='datetime-local' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className='gap-2'>
                {selectedEvent && (
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                )}
                <Button type='submit'>
                  {selectedEvent ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          className='sm:max-w-[425px]'
          aria-describedby='delete-dialog-description'
        >
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
          </DialogHeader>
          <div id='delete-dialog-description'>
            Are you sure you want to delete this schedule? This action cannot be
            undone.
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
