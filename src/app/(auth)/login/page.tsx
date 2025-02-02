'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { GoogleSignIn } from '@/components/auth/GoogleSignIn'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'
import { executeAction } from '@/action/executeAction'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  if (session) {
    redirect('/')
  }

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      if (!email || !password) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive',
        })
        return
      }

      const { success, message } = await executeAction({
        actionFn: async () => {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          })

          if (result?.error) {
            throw new Error(result.error)
          }

          return result
        },
        successMessage: 'Successfully signed in',
      })

      if (!success) {
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        })
        return
      }

      // Wait a bit for the session to be created
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push('/')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to sign in',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <main className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center'>
          <Spinner size={32} className='mx-auto' />
          <p className='mt-4 text-muted-foreground'>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <div className='w-full max-w-sm mx-auto space-y-6'>
          <h1 className='text-2xl font-bold text-center mb-6'>Sign In</h1>

          <GoogleSignIn />
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with email
              </span>
            </div>
          </div>

          <form className='space-y-4' action={handleSubmit}>
            <Input
              name='email'
              placeholder='Email'
              type='email'
              required
              autoComplete='email'
              disabled={isLoading}
            />
            <Input
              name='password'
              placeholder='Password'
              type='password'
              required
              autoComplete='current-password'
              disabled={isLoading}
            />
            <Button className='w-full' type='submit' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size={16} className='mr-2' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className='text-center'>
            <Button asChild variant='link' disabled={isLoading}>
              <Link href='/register'>Don&#39;t have an account? Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
