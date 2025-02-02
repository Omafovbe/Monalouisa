'use server'

import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  // Redirect to the Google sign-in page
  redirect('/api/auth/signin/google')
}
