import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { ScheduleTable } from '@/components/dashboard/schedule-table'
// import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar, MoreVertical, TrendingUp } from 'lucide-react'

import { Input } from '@/components/ui/input'
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
        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Teachers Dashboard</CardTitle>
              <CardDescription>
                See the teacher and their classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href='/teacher' target='_blank'>
                <Button className='w-full'>Go to Teachers Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Students Dashboard</CardTitle>
              <CardDescription>
                See the student and their classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href='/student' target='_blank'>
                <Button className='w-full'>Go to Students Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Appointments</CardTitle>
            <div className='flex items-center gap-2'>
              <div className='flex w-full max-w-sm items-center gap-2'>
                <Input
                  placeholder='Search appointments...'
                  className='h-9'
                  type='search'
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Spinner />}>
              <ScheduleTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page
