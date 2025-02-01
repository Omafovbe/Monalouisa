// import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar, MoreVertical, TrendingUp, Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const Page = async () => {
  const session = await auth()

  if (session?.user.role !== 'ADMIN') {
    redirect('/unauthorized')
  }
  return (
    <div>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className='w-full max-w-[1260px] mx-auto flex flex-1 flex-col gap-4 p-6'>
        <div className='grid gap-4 md:grid-cols-3'>
          {/* Active Students Card */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-sm font-medium'>
                Active Students
              </CardTitle>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <div className='flex -space-x-2'>
                  <Avatar className='h-8 w-8 border-2 border-background'>
                    <AvatarImage src='/avatars/01.png' alt='Student' />
                    <AvatarFallback>S1</AvatarFallback>
                  </Avatar>
                  <Avatar className='h-8 w-8 border-2 border-background'>
                    <AvatarImage src='/avatars/02.png' alt='Student' />
                    <AvatarFallback>S2</AvatarFallback>
                  </Avatar>
                  <Avatar className='h-8 w-8 border-2 border-background'>
                    <AvatarImage src='/avatars/03.png' alt='Student' />
                    <AvatarFallback>S3</AvatarFallback>
                  </Avatar>
                </div>
                <span className='text-sm text-muted-foreground'>
                  25+ enrolled
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Class Schedule Card */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-sm font-medium'>
                Today&#39;s Classes
              </CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-1'>
                <div className='text-2xl font-bold'>8</div>
                <div className='flex items-center text-sm text-green-500'>
                  <span>+2 from yesterday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats Card */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-sm font-medium'>
                Student Progress
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-green-500' />
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <span className='text-sm text-muted-foreground'>+12%</span>
                  <div className='flex gap-4'>
                    <div className='h-2 w-2 rounded-full bg-blue-300' />
                    <div className='h-2 w-2 rounded-full bg-purple-300' />
                    <div className='h-2 w-2 rounded-full bg-orange-300' />
                  </div>
                </div>
                <div className='text-2xl font-bold'>85%</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Links Section */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>Manage Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href='/admin/manage-teachers'>
                <Button className='w-full'>Go to Manage Teachers</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Students</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href='/admin/manage-students'>
                <Button className='w-full'>Go to Manage Students</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href='/admin/manage-subjects'>
                <Button className='w-full'>Go to Manage Subjects</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Upcoming Appointments</CardTitle>
            <div className='flex items-center gap-2'>
              <div className='flex w-full max-w-sm items-center gap-2'>
                <Input
                  placeholder='Search appointments...'
                  className='h-9'
                  type='search'
                />
                <Select defaultValue='all'>
                  <SelectTrigger className='h-9 w-[130px]'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    <SelectItem value='scheduled'>Scheduled</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button size='sm' className='h-9'>
                  <Plus className='mr-2 h-4 w-4' />
                  New
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src='/avatars/01.png' alt='Student' />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span>John Smith</span>
                      <span className='text-sm text-muted-foreground'>
                        Grade 10
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>Mathematics</TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className='bg-green-50 text-green-700 border-green-200'
                    >
                      Scheduled
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span>Today, 2:00 PM</span>
                      <span className='text-sm text-muted-foreground'>
                        45 minutes left
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>60 min</TableCell>
                  <TableCell>
                    <Button variant='ghost' size='sm'>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
                {/* Add more appointment rows as needed */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page
