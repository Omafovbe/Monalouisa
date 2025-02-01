import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
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
          <Button asChild>
            <Link href='/'>Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
