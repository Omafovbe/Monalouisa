'use client'

import { Button } from '@/components/ui/button'
import { signOut as nextAuthSignOut, useSession } from 'next-auth/react'

export function SignOutButton() {
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    await nextAuthSignOut({
      callbackUrl: '/',
      redirect: true,
    })
  }

  if (status === 'loading') {
    return <Button disabled>Loading...</Button>
  }

  if (!session) {
    return null
  }

  return <Button onClick={handleSignOut}>Sign Out</Button>
}
