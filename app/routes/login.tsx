import {LoginIcon} from '@heroicons/react/outline'
import {LoaderFunction, MetaFunction, redirect} from 'remix'
import {getLoggedInUser} from '~/sessions.server'
import {supabase} from '~/supabase'

export const meta: MetaFunction = () => {
  return {
    title: 'Login',
  }
}

export const loader: LoaderFunction = async ({request}) => {
  const user = await getLoggedInUser(request)
  if (user) throw redirect('/')
  return {user}
}

export default function LogIn() {
  const handleGoogleSignIn = () => {
    supabase.auth.signIn({provider: 'google'})
  }

  return (
    <main>
      <div className='fixed top-0 -right-5'>
        <svg
          width='323'
          height='411'
          viewBox='0 0 323 411'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M365.647 -94.0876C438.928 -73.0842 465.372 12.1468 500.201 79.9575C521.838 122.084 531.327 167.7 524.148 214.511C518.085 254.047 489.569 282.181 464.419 313.284C434.218 350.634 413.506 406.463 365.647 410.534C316.886 414.681 291.453 355.117 248.512 331.647C166.895 287.038 37.6428 302.332 7.00232 214.511C-23.7002 126.513 52.3283 32.629 122.975 -28.16C189.028 -84.9954 281.88 -118.096 365.647 -94.0876Z'
            fill='#302D41'
            fillOpacity='0.8'
          />
        </svg>
      </div>
      <div className='fixed bottom-20 left-5'>
        <p className='text-lg text-blue opacity-80'>Create your own</p>
        <h1 className='text-6xl font-semibold text-white'>Secret message</h1>
        <button
          onClick={handleGoogleSignIn}
          className='flex px-3 py-2 mt-5 space-x-2 font-medium text-black rounded-md bg-blue active:scale-95'
        >
          <LoginIcon className='w-6 h-6' />
          <p>Login with Google</p>
        </button>
      </div>
    </main>
  )
}
