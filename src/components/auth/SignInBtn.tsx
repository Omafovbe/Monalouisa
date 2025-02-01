'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SignInButton() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      const result = await signIn('credentials', {
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else if (result?.ok) {
        // Wait a bit for the session to be created in the database
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push('/admin')
        router.refresh()
      }
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignIn}
      className='bg-goldyellow-600 hover:bg-goldyellow-700 text-white'
      disabled={isLoading}
    >
      {isLoading ? 'Signing in...' : 'Sign In'}
    </Button>
  )
}
