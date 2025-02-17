'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Pencil } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { addSubject, getSubjects, updateSubject } from '@/actions/actions'
import React from 'react'

const subjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

type SubjectFormValues = z.infer<typeof subjectSchema>

interface Subject {
  id: number
  name: string
  description: string | null
  createdAt: Date
}

interface SubjectsResponse {
  subjects: Subject[]
  error: string | null
}

export default function CoursesPage() {
  const [open, setOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const { toast } = useToast()

  const { data, isLoading, error, refetch } = useQuery<SubjectsResponse>({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  })

  // Show error toast if there's an error fetching subjects
  useEffect(() => {
    if (data?.error) {
      toast({
        title: 'Error',
        description: data.error,
        variant: 'destructive',
      })
    }
  }, [data?.error, toast])

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const editForm = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // Reset edit form when editing subject changes
  useEffect(() => {
    if (editingSubject) {
      editForm.reset({
        name: editingSubject.name,
        description: editingSubject.description || '',
      })
    }
  }, [editingSubject, editForm])

  async function onSubmit(values: SubjectFormValues) {
    try {
      const result = await addSubject(values)
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Subject added successfully',
        })
        setOpen(false)
        form.reset()
        refetch()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add subject',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error adding subject:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  async function onEditSubmit(values: SubjectFormValues) {
    if (!editingSubject) return

    try {
      const result = await updateSubject(editingSubject.id, values)
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Subject updated successfully',
        })
        setEditingSubject(null)
        editForm.reset()
        refetch()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update subject',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `An unexpected error occurred: ${error}`,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Subjects</h1>
          <p className='text-muted-foreground'>Manage course subjects</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., Mathematics' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe the subject...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-end'>
                  <Button type='submit'>Add Subject</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingSubject}
        onOpenChange={(open) => !open && setEditingSubject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className='space-y-4'
            >
              <FormField
                control={editForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Mathematics' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the subject...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setEditingSubject(null)}
                >
                  Cancel
                </Button>
                <Button type='submit'>Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-8'>
                  Loading subjects...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-8 text-red-600'
                >
                  Error loading subjects
                </TableCell>
              </TableRow>
            ) : data?.subjects?.length ? (
              data.subjects.map((subject: Subject) => (
                <TableRow key={subject.id}>
                  <TableCell className='font-medium'>{subject.name}</TableCell>
                  <TableCell>
                    {subject.description || 'No description'}
                  </TableCell>
                  <TableCell>
                    {new Date(subject.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setEditingSubject(subject)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-8'>
                  No subjects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
