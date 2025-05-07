'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { format } from 'date-fns'
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
import { Badge } from '@/components/ui/badge'
import { EventClickArg } from '@fullcalendar/core'

// Form schema for schedule creation/editing
const scheduleFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  studentId: z.string().min(1, 'Student is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
})

// Add student color mapping
const studentColors = [
  '#FF6633',
  '#FF33FF',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
]

// Improved hash function (djb2)
const hashString = (str: string) => {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
  }
  return Math.abs(hash)
}

const getStudentColor = (studentId: string) => {
  const hash = hashString(studentId)
  return studentColors[hash % studentColors.length]
}

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
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date
    end: Date
  } | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const {
    schedules,
    students,
    subjects,
    isLoading,
    createSchedule,
    updateSchedule,
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

  // Transform schedules to FullCalendar event format
  const events = schedules.map((schedule) => ({
    id: schedule.id.toString(),
    title: schedule.title,
    start: new Date(schedule.start),
    end: new Date(schedule.end),
    extendedProps: {
      studentId: schedule.studentId,
      subjectId: schedule.subjectId,
      studentName: schedule.studentName,
      subjectName: schedule.subjectName,
    },
    color: getStudentColor(schedule.studentId),
  }))
  // console.table(events)

  // Handle slot selection (creating new schedule)
  const handleSelectSlot = (selectInfo: { start: Date; end: Date }) => {
    setSelectedSlot(selectInfo)
    form.reset({
      title: '',
      studentId: '',
      subjectId: '',
      startTime: format(selectInfo.start, "yyyy-MM-dd'T'HH:mm"),
      endTime: format(selectInfo.end, "yyyy-MM-dd'T'HH:mm"),
    })
  }

  // Handle event selection (editing existing schedule)
  const handleSelectEvent = (info: EventClickArg) => {
    const event = schedules.find((s) => s.id.toString() === info.event.id)
    if (event) {
      setSelectedEvent(event)
      form.reset({
        title: event.title,
        studentId: event.studentId,
        subjectId: event.subjectId.toString(),
        startTime: format(new Date(event.start), "yyyy-MM-dd'T'HH:mm"),
        endTime: format(new Date(event.end), "yyyy-MM-dd'T'HH:mm"),
      })
    }
  }

  // Handle form submission
  const onSubmit = async (values: ScheduleFormValues) => {
    try {
      // Convert local times to UTC+1
      const startTime = new Date(values.startTime)
      const endTime = new Date(values.endTime)

      if (selectedEvent) {
        // Update existing schedule
        updateSchedule(selectedEvent.id, {
          ...values,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })
      } else {
        // Create new schedules for each selected student
        for (const studentId of selectedStudents) {
          createSchedule({
            ...values,
            studentId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          })
        }
      }

      // Reset form and close dialog
      form.reset()
      setSelectedSlot(null)
      setSelectedEvent(null)
      setSelectedStudents([])
    } catch (error) {
      console.error('Error saving schedule:', error)
      toast({
        title: 'Error',
        description: selectedEvent
          ? 'Failed to update schedule'
          : 'Failed to create schedule',
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

  if (isLoading) {
    return (
      <div className='container mx-auto h-full flex items-center justify-center'>
        <Spinner size={60} />
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <Card>
        <CardContent className='p-6'>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            timeZone='UTC+1'
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
            selectable={true}
            selectMirror={true}
            dayMaxEvents={4}
            weekends={true}
            select={handleSelectSlot}
            eventClick={handleSelectEvent}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false,
            }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Schedule Dialog */}
      <Dialog
        open={!!selectedSlot || !!selectedEvent}
        onOpenChange={() => {
          setSelectedSlot(null)
          setSelectedEvent(null)
          setSelectedStudents([])
        }}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Schedule' : 'Create Schedule'}
            </DialogTitle>
          </DialogHeader>
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
                    <FormLabel>Students</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (!selectedStudents.includes(value)) {
                          const newStudents = [...selectedStudents, value]
                          setSelectedStudents(newStudents)
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select students' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students?.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name || student.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {selectedStudents.map((studentId) => {
                        const student = students?.find(
                          (s) => s.id === studentId
                        )
                        return (
                          <Badge
                            key={studentId}
                            variant='secondary'
                            className='cursor-pointer'
                            onClick={() => {
                              const newStudents = selectedStudents.filter(
                                (id) => id !== studentId
                              )
                              setSelectedStudents(newStudents)
                              if (newStudents.length > 0) {
                                field.onChange(newStudents[0])
                              } else {
                                field.onChange('')
                              }
                            }}
                          >
                            {student?.name || student?.email} ×
                          </Badge>
                        )
                      })}
                    </div>
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
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
          </DialogHeader>
          <div>
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
