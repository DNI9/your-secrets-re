import {LockClosedIcon, ShareIcon} from '@heroicons/react/solid'
import {Link} from '@remix-run/react'
import type {SecretType} from '~/types'

export const Secrets = ({secrets}: {secrets: SecretType[]}) => {
  return (
    <div className='flex flex-col space-y-2'>
      {secrets.map(secret => (
        <div
          key={secret.id}
          className='flex items-center justify-start w-full px-3 py-2 transition-colors duration-200 border rounded-md border-opacity-10 hover:border-opacity-50 active:border bg-black2 border-blue'
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
          <Link to={`/secrets/share/${secret.id}`} prefetch='intent'>
            <ShareIcon className='w-6 h-6 ml-3 mr-2 cursor-pointer text-blue' />
          </Link>
        </div>
      ))}
    </div>
  )
}
