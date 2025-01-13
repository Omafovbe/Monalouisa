import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-white to-[#6366F1]/5'>
      <div className='w-full max-w-sm space-y-6 rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-sm md:max-w-md md:p-8'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-bold tracking-tight text-[#6366F1]'>
            Welcome back
          </h1>
          <p className='text-gray-500'>
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
