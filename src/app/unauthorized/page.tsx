'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Spinner } from '@/components/ui/spinner'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If user is admin, redirect them back to admin dashboard
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <Card className='w-[400px]'>
          <CardContent className='pt-6 text-center space-y-4'>
            <Spinner size={32} className='mx-auto' />
            <p className='text-muted-foreground'>Checking authorization...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <Card className='w-[400px]'>
          <CardHeader className='text-center'>
            <ShieldAlert className='w-12 h-12 mx-auto text-destructive' />
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className='text-center space-y-4'>
            <p className='text-muted-foreground'>{error}</p>
            <Button onClick={() => setError(null)}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <Card className='w-[400px]'>
        <CardHeader className='text-center'>
          <ShieldAlert className='w-12 h-12 mx-auto text-destructive' />
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent className='text-center space-y-4'>
          <p className='text-muted-foreground'>
            You don&#39;t have permission to access this page.
          </p>
          <div className='flex flex-col gap-2'>
            <Button asChild variant='default'>
              <Link href='/'>Return to Home</Link>
            </Button>
            {!session && (
              <Button asChild variant='outline'>
                <Link href='/login'>Sign In</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
