import type {ActionFunction, MetaFunction} from '@remix-run/node'
import {redirect} from '@remix-run/node'
import {useSubmit} from '@remix-run/react'
import type {Session} from '@supabase/supabase-js'
import {useEffect} from 'react'
import {createUserSession} from '~/sessions.server'
import {supabase} from '~/supabase'

export const meta: MetaFunction = () => ({title: 'Redirecting...'})

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData()
  const formSession = formData.get('session')

  if (typeof formSession === 'string') {
    const session = JSON.parse(formSession) as Session
    await createUserSession(session.access_token)
    return redirect('/')
  } else return redirect('/login')
}

export default function OAuth() {
  const submit = useSubmit()

  useEffect(() => {
    const {data: authListener} = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          const formData = new FormData()
          formData.append('session', JSON.stringify(session))

          submit(formData, {method: 'post'})
        }
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [submit])

  return null
}
