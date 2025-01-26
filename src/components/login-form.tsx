'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { signIn } from '@/lib/auth'
import Link from 'next/link'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type ActionState = {
  status: 'idle' | 'executing' | 'success' | 'error'
  error?: string | null
}

export function LoginForm() {
  const router = useRouter()
  const [state, action, isPending] = useActionState<ActionState>(
    async (state: ActionState): Promise<ActionState> => {
      try {
        const formData = new FormData(document.querySelector('form')!)
        const result = await signIn('credentials', {
          email: formData.get('email'),
          password: formData.get('password'),
          redirect: false,
        })

        if (!result) {
          console.log(state)
          return {
            status: 'executing',
            error: 'Please wait...',
          }
        }

        if (result.error) {
          return {
            status: 'error',
            error: 'Invalid email or password',
          }
        }

        return {
          status: 'success',
          error: null,
        }
      } catch (error) {
        console.log(error)
        return {
          status: 'error',
          error: 'An unexpected error occurred',
        }
      }
    },
    { status: 'idle', error: null }
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Redirect after successful login
  useEffect(() => {
    if (state.status === 'success') {
      router.push('/admin')
    }
  }, [state.status, router])

  return (
    <Form {...form}>
      <form action={action} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='name@example.com'
                  type='email'
                  autoCapitalize='none'
                  autoComplete='email'
                  autoCorrect='off'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter your password'
                  type='password'
                  autoComplete='current-password'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {state.error && <p className='text-sm text-red-600'>{state.error}</p>}
        <Button
          type='submit'
          className='w-full bg-[#6366F1] hover:bg-[#5849E5] text-white'
          disabled={isPending}
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <div className='mt-4 text-center text-sm'>
        <Link
          href='/forgot-password'
          className='text-[#6366F1] hover:underline'
        >
          Forgot password?
        </Link>
      </div>
      <div className='mt-4 text-center text-sm text-gray-500'>
        Don&apos;t have an account?{' '}
        <Link href='/register' className='text-[#6366F1] hover:underline'>
          Sign up
        </Link>
      </div>
    </Form>
  )
}
