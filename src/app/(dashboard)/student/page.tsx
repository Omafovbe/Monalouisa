// import { SignOutButton } from '@/components/auth/SignOutBtn'
import { OverviewCards } from '@/components/dashboard/overview-cards'
import { ScheduleTable } from '@/components/dashboard/schedule-table'
import { StudentProgress } from '@/components/dashboard/student-progress'

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'
import { auth } from '@/lib/auth'

const StudentDashboard = async () => {
  const session = await auth()
  const user = session?.user

  return (
    <>
      {/* Main Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='h-full p-4 lg:p-8'>
          {/* Header */}
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
              <p className='text-muted-foreground'>
                Welcome back, {user?.name}!
              </p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className='space-y-4'>
            {/* Overview Cards */}
            <OverviewCards />

            {/* Main Grid */}
            <div className='grid gap-4 grid-cols-1 lg:grid-cols-7'>
              {/* Schedule Card */}
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Upcoming Schedule</CardTitle>
                  <CardDescription>
                    Your classes for today and tomorrow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleTable />
                </CardContent>
              </Card>

              {/* Student Progress */}
              <div className='col-span-1 lg:col-span-3'>
                <StudentProgress />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentDashboard
