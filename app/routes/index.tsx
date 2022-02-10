import {LoaderFunction, useLoaderData} from 'remix'
import {getLoggedInUser} from '~/sessions.server'

export const loader: LoaderFunction = async ({request}) => {
  const user = await getLoggedInUser(request)
  return user
}

export default function Index() {
  const {id: userId} = useLoaderData() || {}

  return (
    <div className=''>
      <h1>Your secrets</h1>
    </div>
  )
}
