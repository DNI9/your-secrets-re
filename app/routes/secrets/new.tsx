import type {ActionArgs, LoaderArgs, SerializeFrom} from '@remix-run/node'
import {json, redirect} from '@remix-run/node'
import {Form, useActionData, useTransition} from '@remix-run/react'
import Layout from '~/components/Layout'
import {getLoggedInUser, requireUserAccess} from '~/sessions.server'
import {supabase} from '~/supabase'
import type {SecretType} from '~/types'

const badRequest = (data: any) => json(data, {status: 400})

const validateSecretName = (secret: string) => {
  if (secret.length < 4) return 'Name must be longer than 3 characters'
  if (secret.length > 30) return 'Name must be smaller than 30 characters'
}

export async function action({request}: ActionArgs) {
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

export async function loader({request}: LoaderArgs) {
  await requireUserAccess(request)
  return {}
}

const ErrorMessage = ({data}: {data?: SerializeFrom<typeof action>}) => {
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

export default function NewSecret() {
  const actionData = useActionData<typeof action>()
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
            className='mt-3 h-12 w-full rounded-md bg-black2 p-3 text-white outline-none focus:outline-blue'
          />
          <ErrorMessage data={actionData} />
          <button
            disabled={
              transition.state === 'loading' ||
              transition.state === 'submitting'
            }
            type='submit'
            className='disabled-button mt-5 flex rounded-md bg-blue px-3 py-2 font-medium text-black active:scale-95'
          >
            Create secret
          </button>
        </Form>
      </main>
    </Layout>
  )
}
