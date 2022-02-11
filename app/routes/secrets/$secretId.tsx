import {LoaderFunction, useLoaderData} from 'remix'
import {format} from 'timeago.js'
import {EmptyMessage} from '~/components/EmptyMessage'
import Layout from '~/components/Layout'
import {supabase} from '~/supabase'
import {MessageType} from '~/types'

type LoaderData = {
  messages: Omit<MessageType, 'secret_id'>[] | null
}

export const loader: LoaderFunction = async ({params, request}) => {
  const secretId = params.secretId
  if (!secretId || typeof secretId !== 'string')
    throw new Response('no secrets id is found', {status: 404})

  // TODO: handle error with error boundary
  const {data: messages, error} = await supabase
    .from<MessageType>('messages')
    .select(`id,content,inserted_at`)
    .eq('secret_id', secretId)
    .order('inserted_at', {ascending: false})

  const data: LoaderData = {messages}
  return data
}

export default function Secret() {
  const {messages} = useLoaderData<LoaderData>()

  if (!messages?.length) {
    return (
      <EmptyMessage
        message='no messages yet'
        description='refresh or come back later'
      />
    )
  }

  return (
    <Layout navTitle='Messages'>
      <div className='flex flex-col mt-5 space-y-2'>
        {messages.map(({id, content, inserted_at}) => (
          <div
            key={id}
            className='w-full px-3 py-2 text-white border-opacity-25 rounded-md hover:border active:border bg-black2 border-blue'
          >
            <h2>{content}</h2>
            <p className='mt-1 text-xs text-white opacity-50 select-none'>
              {format(inserted_at)}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  )
}
