import {PlusIcon} from '@heroicons/react/outline'
import {User} from '@supabase/supabase-js'
import {Link, LoaderFunction, redirect, useLoaderData} from 'remix'
import {EmptyMessage} from '~/components/EmptyMessage'
import Layout from '~/components/Layout'
import {Secrets} from '~/components/Secrets'
import {getLoggedInUser} from '~/sessions.server'
import {supabase} from '~/supabase'
import {SecretType} from '~/types'

type LoaderData = {
  user: User | null
  secrets: SecretType[] | null
}

export const loader: LoaderFunction = async ({request}) => {
  const user = await getLoggedInUser(request)
  if (!user) return redirect('/login')

  const {data: secrets, error} = await supabase
    .from<SecretType>('secrets')
    .select(`id,secret_name,messages`)
    .eq('created_by', user.id)
    .order('updated_at', {ascending: false})

  if (error) throw error

  const data: LoaderData = {secrets, user}
  return data
}

export default function Index() {
  const {secrets} = useLoaderData<LoaderData>()

  return (
    <Layout>
      <main className='mt-5'>
        {!secrets?.length ? (
          <EmptyMessage
            message='No secrets'
            description='Create one with the button below'
          />
        ) : (
          <Secrets secrets={secrets} />
        )}
        <Link
          to='secrets/new'
          className='fixed p-3 rounded-full cursor-pointer text-blue bottom-5 right-5 bg-blue bg-opacity-10 active:border-2 border-opacity-80'
        >
          <PlusIcon className='w-6 h-6' />
        </Link>
      </main>
    </Layout>
  )
}
