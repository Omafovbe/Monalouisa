'use client'

import { Button } from '@/components/ui/button'
import { Google } from '@/components/auth/google'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'
import { signIn } from 'next-auth/react'

export function GoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleGoogleSignIn() {
    try {
      setIsLoading(true)
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to sign in with Google',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <Button
      className='w-full'
      variant='outline'
      disabled={isLoading}
      onClick={handleGoogleSignIn}
      type='button'
    >
      {isLoading ? (
        <>
          <Spinner size={16} className='mr-2' />
          Signing in...
        </>
      ) : (
        <>
          <Google />
          Continue with Google
        </>
      )}
    </Button>
  )
}
