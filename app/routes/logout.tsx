import type {LoaderFunction} from '@remix-run/node'
import {useNavigate} from '@remix-run/react'
import {useEffect} from 'react'
import {clearCookie} from '~/sessions.server'
import {supabase} from '~/supabase'
import {useUser} from '~/useUser'

export let loader: LoaderFunction = async ({request}) => {
  return clearCookie(request)
}

export default function Logout() {
  const navigate = useNavigate()
  useUser()

  useEffect(() => {
    const logoutUser = async () => {
      await supabase.auth.signOut()
      navigate('/')
    }

    logoutUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
