import { Button } from '../ui/button'
import { signInAction } from '@/app/action/actions'

export function SignInBtn() {
  return (
    <form action={signInAction}>
      <Button type='submit'>Sign in</Button>
    </form>
  )
}
