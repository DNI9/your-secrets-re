import {LogoutIcon} from '@heroicons/react/outline'
import {User} from '@supabase/supabase-js'
import {LoaderFunction, MetaFunction, useLoaderData} from 'remix'
import {getLoggedInUser, requireUserAccess} from '~/sessions.server'
import {supabase} from '~/supabase'

type LoaderData = {
  user: User | null
}

export const meta: MetaFunction = ({data}: {data: LoaderData}) => {
  const user = data?.user?.user_metadata
  return {
    title: `${user?.full_name ?? 'Anon'} | Profile`,
  }
}

export const loader: LoaderFunction = async ({request}) => {
  await requireUserAccess(request)
  const user = await getLoggedInUser(request)
  const data: LoaderData = {user}
  return data
}

export default function Profile() {
  const data = useLoaderData<LoaderData>()
  const user = data?.user?.user_metadata

  if (!user) return <p>No user data available</p>

  return (
    <main className='flex flex-col items-center mt-10'>
      <div className='w-24 mb-3 rounded-lg bg-black2 h-w-24'>
        <img
          className='w-full rounded-lg'
          src={user.picture}
          alt={`Photo of ${user.full_name}`}
        />
      </div>
      <h1 className='text-4xl text-white'>{user?.full_name || 'Hello Anon'}</h1>
      <button
        onClick={() => supabase.auth.signOut()}
        className='flex px-3 py-2 mt-8 space-x-2 font-medium text-black rounded-md bg-red active:scale-95'
      >
        <LogoutIcon className='w-6 h-6' />
        <p>Logout</p>
      </button>
      <p className='fixed text-white opacity-80 bottom-2'>
        Made with 💙 by{' '}
        <a href='https://github.com/dni9' target={'_blank'} rel='noreferrer'>
          <span className='font-medium tracking-wide cursor-pointer text-blue'>
            DNI9
          </span>
        </a>
      </p>
    </main>
  )
}
