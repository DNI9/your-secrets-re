import {PlusIcon} from '@heroicons/react/outline'
import type {LoaderArgs} from '@remix-run/node'
import {json, redirect} from '@remix-run/node'
import {Link, useLoaderData} from '@remix-run/react'
import {EmptyMessage} from '~/components/EmptyMessage'
import Layout from '~/components/Layout'
import {Secrets} from '~/components/Secrets'
import {getLoggedInUser} from '~/sessions.server'
import {supabase} from '~/supabase'
import type {SecretType} from '~/types'

export async function loader({request}: LoaderArgs) {
  const user = await getLoggedInUser(request)
  if (!user) return redirect('/login')

  const {data: secrets, error} = await supabase
    .from<SecretType>('secrets')
    .select(`id,secret_name,messages`)
    .eq('created_by', user.id)
    .eq('deleted', false)
    .order('updated_at', {ascending: false})

  if (error) throw error

  return json({secrets, user})
}

export default function Index() {
  const {secrets} = useLoaderData<typeof loader>()

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
