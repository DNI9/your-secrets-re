import {
  Link,
  LoaderFunction,
  MetaFunction,
  redirect,
  useCatch,
  useLoaderData,
} from 'remix'
import {format} from 'timeago.js'
import {EmptyMessage} from '~/components/EmptyMessage'
import Layout from '~/components/Layout'
import {getLoggedInUser} from '~/sessions.server'
import {supabase} from '~/supabase'
import {MessageType, SecretType} from '~/types'

type LoaderData = {
  messages: Omit<MessageType, 'secret_id'>[] | null
}

export const meta: MetaFunction = ({data}: {data: LoaderData | null}) => {
  if (!data || !data.messages) return {title: 'Secret not found'}
  return {title: 'Messages | Your Secrets'}
}

export const loader: LoaderFunction = async ({params, request}) => {
  const user = await getLoggedInUser(request)
  if (!user) throw redirect('/login')

  const secretId = params.secretId
  if (!secretId || typeof secretId !== 'string')
    throw new Response('no secrets id is found', {status: 404})

  const {data: secret} = await supabase
    .from<SecretType>('secrets')
    .select('created_by')
    .eq('id', secretId)
    .eq('created_by', user?.id)
    .limit(1)
    .single()

  // if secret is null that means this user does not own this
  if (!secret) throw new Response('Not Found', {status: 404})

  const {data: messages, error} = await supabase
    .from<MessageType>('messages')
    .select(`id,content,inserted_at`)
    .eq('secret_id', secretId)
    .order('inserted_at', {ascending: false})

  if (error) throw error

  const data: LoaderData = {messages}
  return data
}

export default function Secret() {
  const {messages} = useLoaderData<LoaderData>()

  return (
    <Layout navTitle='Messages' stickyNav>
      <main className='flex flex-col mt-5 space-y-2'>
        {!messages?.length ? (
          <EmptyMessage
            message='no messages yet'
            description='refresh or come back later'
          />
        ) : (
          messages.map(({id, content, inserted_at}) => (
            <div
              key={id}
              className='w-full px-3 py-2 text-white border-opacity-25 rounded-md hover:border active:border bg-black2 border-blue'
            >
              <h2>{content}</h2>
              <p className='mt-1 text-xs text-white opacity-50 select-none'>
                {format(inserted_at)}
              </p>
            </div>
          ))
        )}
      </main>
    </Layout>
  )
}

const NotFound = () => {
  return (
    <Layout>
      <div className='fixed w-full px-4 text-center text-white transform -translate-x-1/2 select-none top-1/2 left-1/2'>
        <p>¯\_(ツ)_/¯</p>
        <h1 className='text-2xl'>Not Found</h1>
        <p className='text-sm opacity-75'>
          The secret you are looking for is not there or not yours :(
        </p>
        <Link to={'/'} prefetch='render'>
          <p className='mt-5 text-sm text-blue'>&larr; go home</p>
        </Link>
      </div>
    </Layout>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  switch (caught.status) {
    case 404: {
      return <NotFound />
    }
    default: {
      // if we don't handle this then all bets are off. Just throw an error
      // and let the nearest ErrorBoundary handle this
      throw new Error(`${caught.status} not handled`)
    }
  }
}
