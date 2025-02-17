'use client'

import { useState } from 'react'
// import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
  updateAdmin,
} from '@/actions/admin-actions'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { z } from 'zod'
import { createAdminSchema, updateAdminSchema } from '@/lib/validate'

type Admin = {
  id: string
  name: string | null
  email: string
  createdAt: Date
}

export default function AdminUsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  //   const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch admins
  const { data: adminsData, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admins'],
    queryFn: getAdmins,
  })

  // Create admin form
  const createForm = useForm({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  // Edit admin form
  const editForm = useForm({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  // Create admin mutation
  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof createAdminSchema>) =>
      createAdmin(values),
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Success',
        description: 'Admin created successfully',
      })

      setIsCreateDialogOpen(false)
      createForm.reset()
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    },
  })

  // Update admin mutation
  const updateMutation = useMutation({
    mutationFn: (values: {
      id: string
      data: z.infer<typeof updateAdminSchema>
    }) => updateAdmin(values.id, values.data),
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Success',
        description: 'Admin updated successfully',
      })

      setIsEditDialogOpen(false)
      setSelectedAdmin(null)
      editForm.reset()
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    },
  })

  // Delete admin mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Success',
        description: 'Admin deleted successfully',
      })

      setIsDeleteDialogOpen(false)
      setSelectedAdmin(null)
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    },
  })

  const onCreateSubmit = (values: z.infer<typeof createAdminSchema>) => {
    createMutation.mutate(values)
  }

  const onEditSubmit = (values: z.infer<typeof updateAdminSchema>) => {
    if (!selectedAdmin) return
    updateMutation.mutate({ id: selectedAdmin.id, data: values })
  }

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin)
    editForm.reset({
      name: admin.name || '',
      email: admin.email,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedAdmin) return
    deleteMutation.mutate(selectedAdmin.id)
  }

  if (isLoadingAdmins) {
    return (
      <div className='flex h-[600px] items-center justify-center'>
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div className='container mx-auto py-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Admin Users</CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create New Admin
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminsData?.admins?.length ? (
                adminsData.admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      {format(new Date(admin.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className='text-right space-x-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEdit(admin)}
                        className='h-8 w-8'
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDelete(admin)}
                        className='h-8 w-8 text-red-500 hover:text-red-600'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className='text-center'>
                    No admin users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Admin Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Admin</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onCreateSubmit)}
              className='space-y-4'
            >
              <FormField
                control={createForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <Spinner className='mr-2' />
                  ) : null}
                  Create Admin
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <Spinner className='mr-2' />
                  ) : null}
                  Update Admin
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedAdmin?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              variant='destructive'
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Spinner className='mr-2' /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
