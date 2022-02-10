import {LockClosedIcon, ShareIcon} from '@heroicons/react/solid'
import toast from 'react-hot-toast'
import {Link} from 'remix'
import useClipboard from '~/lib/useClipboard'
import {SecretType} from '~/types'

// TODO: change this
const SITE_URL = 'http://localhost:3000'

export const Secrets = ({secrets}: {secrets: SecretType[]}) => {
  const [, copy] = useClipboard()

  const handleCopy = async (id: string) => {
    if (await copy(`${SITE_URL}/messages/${id}`)) {
      toast.success('Sharing URL copied to clipboard')
    } else {
      toast.error("Couldn't copy to clipboard")
    }
  }

  return (
    <div className='flex flex-col space-y-2'>
      {secrets.map(secret => (
        <div
          key={secret.id}
          className='flex items-center justify-start w-full px-3 py-2 border-opacity-25 rounded-md hover:border active:border bg-black2 border-blue'
        >
          <div className='p-3 rounded-full text-blue bg-blue bg-opacity-10'>
            <LockClosedIcon className='w-5 h-5' />
          </div>
          <Link prefetch='intent' to={`/secrets/${secret.id}`}>
            <div className='w-full ml-3 text-white cursor-pointer'>
              <h2 className='font-medium'>{secret.secret_name}</h2>
              <p className='text-sm text-white opacity-50'>
                {secret.messages} messages
              </p>
            </div>
          </Link>
          <ShareIcon
            className='w-5 h-5 ml-auto mr-2 cursor-pointer text-blue'
            onClick={() => handleCopy(secret.id)}
          />
        </div>
      ))}
    </div>
  )
}