import {PostgrestError} from '@supabase/supabase-js'
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useTransition,
} from 'remix'
import Layout from '~/components/Layout'
import {getLoggedInUser, requireUserAccess} from '~/sessions.server'
import {supabase} from '~/supabase'
import {SecretType} from '~/types'

type ActionData = {
  formError?: string
  fieldErrors?: {
    secret: string | undefined
  }
  fields?: {
    secret: string
  }
  submitError?: PostgrestError
}

const badRequest = (data: ActionData) => json(data, {status: 400})

const validateSecretName = (secret: string) => {
  if (secret.length < 4) return 'Name must be longer than 3 characters'
  if (secret.length > 30) return 'Name must be smaller than 30 characters'
}

export const action: ActionFunction = async ({request}) => {
  const user = await getLoggedInUser(request)
  if (!user) throw redirect('/')
  const form = await request.formData()
  const secret = form.get('secret')

  if (typeof secret !== 'string') {
    return badRequest({formError: `Form not submitted correctly.`})
  }
  const fieldErrors = {
    secret: validateSecretName(secret),
  }

  const fields = {secret}
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({fieldErrors, fields})
  }

  const {error} = await supabase.from<SecretType>('secrets').insert(
    {
      secret_name: secret,
      created_by: user.id,
      username: user.user_metadata.full_name,
    },
    {returning: 'minimal'}
  )

  if (error) return badRequest({submitError: error})

  return redirect('/')
}

const ErrorMessage = ({data}: {data?: ActionData}) => {
  return (
    <>
      {data?.fieldErrors?.secret ? (
        <p className='error-text' role='alert'>
          {data.fieldErrors.secret}
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

export const loader: LoaderFunction = async ({request}) => {
  await requireUserAccess(request)
  return {}
}

export default function NewSecret() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()

  return (
    <Layout>
      <main className='mt-5'>
        <p className='text-lg text-blue opacity-80'>Add a new</p>
        <h1 className='text-6xl font-semibold text-white'>Secret</h1>
        <Form method='post'>
          <input
            type='text'
            name='secret'
            autoFocus
            placeholder='type a name, e.g my little secret'
            defaultValue={actionData?.fields?.secret}
            className='w-full h-12 p-3 mt-3 text-white rounded-md outline-none bg-black2 focus:outline-blue'
          />
          <ErrorMessage data={actionData} />
          <button
            disabled={
              transition.state === 'loading' ||
              transition.state === 'submitting'
            }
            type='submit'
            className='flex px-3 py-2 mt-5 font-medium text-black rounded-md bg-blue active:scale-95 disabled-button'
          >
            Submit
          </button>
        </Form>
      </main>
    </Layout>
  )
}
