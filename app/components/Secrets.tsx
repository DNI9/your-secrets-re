import {LockClosedIcon, ShareIcon} from '@heroicons/react/solid'
import {useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import {Link} from 'remix'
import useClipboard from '~/lib/useClipboard'
import {SecretType} from '~/types'

export const Secrets = ({secrets}: {secrets: SecretType[]}) => {
  const [, copy] = useClipboard()
  const [siteUrl, setSiteUrl] = useState('')

  const handleCopy = async (id: string) => {
    if (siteUrl && (await copy(`${siteUrl}messages/${id}`))) {
      toast.success('Sharing URL copied to clipboard', {id})
    } else {
      toast.error("Couldn't copy to clipboard", {id})
    }
  }

  useEffect(() => {
    if (window) setSiteUrl(window.location.href)
  }, [])

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
          <Link
            prefetch='intent'
            to={`/secrets/${secret.id}`}
            className='w-full'
          >
            <div className='w-full ml-3 text-white cursor-pointer'>
              <h2 className='font-medium'>{secret.secret_name}</h2>
              <p className='text-sm text-white opacity-50'>
                {secret.messages} messages
              </p>
            </div>
          </Link>
          <ShareIcon
            className='w-6 h-6 ml-3 mr-2 cursor-pointer text-blue'
            onClick={() => handleCopy(secret.id)}
          />
        </div>
      ))}
    </div>
  )
}
