import {MetaFunction} from 'remix'
import {supabase} from '~/supabase'

export const meta: MetaFunction = () => {
  return {
    title: 'Login',
  }
}

export default function LogIn() {
  const handleGoogleSignIn = () => {
    supabase.auth.signIn({provider: 'google'})
  }

  return (
    <div className='flex flex-col items-center justify-center mt-36'>
      <h1 className='mb-2 text-5xl font-bold text-center'>
        Log in to continue
      </h1>
      <button onClick={handleGoogleSignIn} className='mt-5'>
        Continue with Google
      </button>
    </div>
  )
}
