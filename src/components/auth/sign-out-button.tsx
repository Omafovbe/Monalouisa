'use client'

import { signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  return (
    <Button
      variant='ghost'
      onClick={() => signOut({ redirectTo: '/api/auth/signin' })}
    >
      Sign Out
    </Button>
  )
}
