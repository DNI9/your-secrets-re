import {ArrowSmRightIcon, PaperAirplaneIcon} from '@heroicons/react/solid'
import {PostgrestError} from '@supabase/supabase-js'
import {useEffect} from 'react'
import toast from 'react-hot-toast'
import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  MetaFunction,
  useFetcher,
  useLoaderData,
} from 'remix'
import Layout from '~/components/Layout'
import {supabase} from '~/supabase'
import {MessageType, SecretType} from '~/types'

export const meta: MetaFunction = ({data}: {data: LoaderData}) => {
  const user = data.secret?.username?.split(' ')[0]
  const description = `Share a secret message to ${user} anonymously!`

  return {
    title: `Share your secret with ${user} | Your Secrets`,
    description,
    'og:description': description,
  }
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    message: string | undefined
  }
  fields?: {
    message: string
  }
  submitError?: PostgrestError
  ok?: boolean
}

const badRequest = (data: ActionData) => json(data, {status: 400})

const validateMessage = (secret: string) => {
  if (secret.length < 3) return 'Message must be at least 3 characters long'
  if (secret.length && secret.split(' ').length > 111)
    return 'Message must be less than 100 words'
}

export const action: ActionFunction = async ({request, params}) => {
  const form = await request.formData()
  const message = form.get('message')

  if (typeof message !== 'string') {
    return badRequest({formError: `Form not submitted correctly.`})
  }
  const fieldErrors = {
    message: validateMessage(message),
  }

  const fields = {message}
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({fieldErrors, fields})
  }

  const {error} = await supabase
    .from<MessageType>('messages')
    .insert(
      {content: message, secret_id: params.secretId},
      {returning: 'minimal'}
    )

  if (error) return badRequest({submitError: error})

  return {ok: true}
}

type LoaderData = {
  secret: Pick<SecretType, 'username'>
}

export const loader: LoaderFunction = async ({params}) => {
  const secretId = params.secretId
  if (!secretId || typeof secretId !== 'string')
    throw new Response('no secrets id is found', {status: 404})

  const {data: secret, error} = await supabase
    .from<SecretType>('secrets')
    .select('username')
    .eq('id', secretId)
    .limit(1)
    .single()

  if (error)
    throw new Response('Uh-oh! Could not get user of this secret', {
      status: 404,
    })

  return {secret}
}

const ErrorMessage = ({data}: {data?: ActionData}) => {
  return (
    <>
      {data?.fieldErrors?.message ? (
        <p className='error-text' role='alert'>
          {data.fieldErrors?.message}
        </p>
      ) : null}
      {data?.formError ? (
        <p className='error-text' role='alert'>
          {data.formError}
        </p>
      ) : null}
      {data?.submitError ? (
        <p className='error-text' role='alert'>
          oh no! could not submit form, try again (ErrorCode:{' '}
          {data.submitError.code})
        </p>
      ) : null}
    </>
  )
}

export default function Message() {
  const fetcher = useFetcher<ActionData>()
  const data = useLoaderData<LoaderData>()
  const user = data.secret?.username.split(' ')[0]

  useEffect(() => {
    if (fetcher.type === 'done' && fetcher.data.ok) {
      toast.success(`Message sent to ${user}`, {duration: 8000})
    }
  }, [fetcher.type])

  return (
    <Layout showNav={false}>
      <main className='flex flex-col justify-center h-screen'>
        <div className='md:container md:max-w-lg md:mx-auto'>
          <p className='text-lg text-blue opacity-80'>Write something</p>
          <h1 className='text-5xl font-semibold text-white md:text-6xl'>
            to {user}
          </h1>
          <fetcher.Form method='post'>
            <textarea
              name='message'
              className='w-full p-3 mt-5 text-white border rounded-md outline-none resize-none bg-black2 border-blue placeholder-gray2'
              rows={6}
              placeholder='type your message here'
              autoFocus
            />
            <ErrorMessage data={fetcher.data} />
            <button
              disabled={
                fetcher.state === 'submitting' || fetcher.state === 'loading'
              }
              type='submit'
              className='flex px-3 py-2 mt-2 space-x-2 font-medium text-black rounded-md disabled:cursor-not-allowed bg-blue active:scale-95 disabled:bg-gray'
            >
              <PaperAirplaneIcon className='w-6 h-6 rotate-90' />
              <p>Send</p>
            </button>
          </fetcher.Form>
          <p className='mt-3 text-xs text-gray2'>
            * <strong className='tracking-wider'>{user}</strong> will never know
            who wrote this message
          </p>
        </div>
        <svg
          className='fixed left-0 -top-3 -z-10'
          width='130'
          height='130'
          viewBox='0 0 130 130'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M-82.2092 16.5299C-99.3148 -29.6979 -141.987 -78.304 -115.71 -119.977C-88.019 -163.894 -23.5287 -167.141 27.4216 -157.338C72.194 -148.725 111.819 -116.468 126.747 -73.3313C138.889 -38.2446 102.463 -9.01479 90.9647 26.2795C79.8087 60.5224 94.2194 108.49 62.1784 124.859C29.4365 141.586 -7.91074 113.904 -37.3368 91.8266C-61.9139 73.3872 -71.54 45.3635 -82.2092 16.5299Z'
            fill='#302D41'
            fillOpacity='0.5'
          />
        </svg>
        <svg
          className='fixed top-6 -right-8 -z-10'
          width='155'
          height='254'
          viewBox='0 0 155 254'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M169.642 2.92035C222.164 5.85111 288.305 -16.0176 317.211 28.7672C347.673 75.9627 322.308 142.563 290.242 189.771C262.063 231.255 213.168 257.195 164.616 253.416C125.124 250.341 112.808 200.741 83.5702 173.682C55.2031 147.43 2.1814 141.014 0.433227 101.471C-1.35319 61.0626 42.0855 35.4237 76.57 15.3392C105.372 -1.43573 136.882 1.09235 169.642 2.92035Z'
            fill='#302D41'
            fillOpacity='0.6'
          />
        </svg>
        <svg
          className='fixed -left-2 -bottom-16 -z-10'
          width='106'
          height='262'
          viewBox='0 0 106 262'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M-77.7845 1.15418C-41.1465 -4.5589 -22.9165 47.3473 8.61919 66.8718C39.1456 85.7714 89.8657 79.6351 102.984 113.072C116.193 146.741 77.6617 177.993 65.5886 212.082C55.5262 240.495 58.5531 273.703 38.2191 295.942C16.802 319.364 -14.6604 336.964 -46.2881 334.436C-76.634 332.01 -91.2773 295.23 -119.311 283.35C-154.881 268.275 -205.727 287.589 -229.228 256.908C-252.008 227.168 -240.712 180.648 -223.444 147.403C-207.89 117.457 -166.591 114.385 -142.784 90.4805C-116.149 63.738 -115.066 6.96765 -77.7845 1.15418Z'
            fill='#302D41'
            fillOpacity='0.2'
          />
        </svg>
        <Link to='/secrets/new' prefetch='intent'>
          <div className='fixed flex items-center px-3 py-2 space-x-2 text-sm rounded-md cursor-pointer bg-opacity-10 bg-blue text-blue bottom-3 right-5 opacity-70'>
            <p className='font-medium'>Create your own</p>
            <ArrowSmRightIcon className='w-5 h-5' />
          </div>
        </Link>
      </main>
    </Layout>
  )
}
