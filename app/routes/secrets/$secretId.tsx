import type {ActionArgs, LoaderArgs, MetaFunction} from '@remix-run/node'
import {json, redirect, Response} from '@remix-run/node'
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import type {CSSProperties} from 'react'
import {DeleteSecretButton} from '~/components/DeleteSecretButton'
import Layout from '~/components/Layout'
import {MessageList} from '~/components/Messages'
import {getLoggedInUser} from '~/sessions.server'
import {supabase} from '~/supabase'
import type {MessageType, SecretType} from '~/types'

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data || !data.messages) return {title: 'Secret not found'}
  return {title: 'Messages | Your Secrets'}
}

export async function loader({params, request}: LoaderArgs) {
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

  return json({messages})
}

export async function action({params, request}: ActionArgs) {
  if (request.method === 'DELETE') {
    const secretId = params?.secretId
    const user = await getLoggedInUser(request)
    if (!user) throw redirect('/login')

    await supabase
      .from('secrets')
      .update({deleted: true}, {returning: 'minimal'})
      .match({id: secretId, created_by: user?.id})

    return redirect('/')
  }

  return null
}

export default function Secret() {
  const {messages} = useLoaderData<typeof loader>()
  const transition = useTransition()
  const isDeleteButtonDisabled =
    transition.state === 'loading' || transition.state === 'submitting'
  const buttonStyles: CSSProperties = messages.length
    ? {}
    : {
        position: 'fixed',
        top: '65%',
        left: '50%',
        transform: 'translateX(-50%)',
      }

  return (
    <Layout navTitle='Messages' stickyNav>
      <main className='mt-5 flex flex-col space-y-2'>
        <MessageList data={messages} />
        <Form method='delete'>
          <DeleteSecretButton
            disabled={isDeleteButtonDisabled}
            styles={buttonStyles}
          />
        </Form>
      </main>
    </Layout>
  )
}

const NotFound = () => {
  return (
    <Layout>
      <div className='fixed top-1/2 left-1/2 w-full -translate-x-1/2 transform select-none px-4 text-center text-white'>
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

  if (caught.status === 404) return <NotFound />
  else throw new Error(`${caught.status} not handled`)
}
