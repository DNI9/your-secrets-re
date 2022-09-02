import {LogoutIcon} from '@heroicons/react/outline'
import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import type {User} from '@supabase/supabase-js'
import {useState} from 'react'
import Layout from '~/components/Layout'
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
  const [loading, setLoading] = useState(false)
  const user = data?.user?.user_metadata

  const handleLogout = () => {
    setLoading(true)
    supabase.auth.signOut()
  }

  if (!user) return <p>No user data available</p>

  return (
    <Layout navTitle='Profile'>
      <main className='mt-10 flex flex-col items-center'>
        <div className='mb-3 h-24 w-24 rounded-lg bg-black2'>
          <img
            className='w-full rounded-lg'
            src={user.picture}
            alt={`${user.full_name}`}
          />
        </div>
        <h1 className='text-4xl text-white'>
          {user?.full_name || 'Hello Anon'}
        </h1>
        <button
          onClick={handleLogout}
          disabled={loading}
          className='mt-8 flex space-x-2 rounded-md bg-red px-3 py-2 font-medium text-black active:scale-95 disabled:bg-gray'
        >
          <LogoutIcon className='h-6 w-6' />
          <p>Logout</p>
        </button>
        <p className='fixed bottom-3 text-white opacity-80'>
          Made with 💙 by{' '}
          <a href='https://github.com/dni9' target={'_blank'} rel='noreferrer'>
            <span className='cursor-pointer font-medium tracking-wide text-blue'>
              DNI9
            </span>
          </a>
        </p>
      </main>
    </Layout>
  )
}
