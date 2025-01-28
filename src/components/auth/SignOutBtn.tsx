'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth'

export function SignOutButton() {
  return (
    <Button onClick={() => signOut({ redirect: true, redirectTo: '/' })}>
      Sign Out
    </Button>
  )
}
