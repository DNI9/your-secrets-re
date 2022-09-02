import {LockClosedIcon, ShareIcon} from '@heroicons/react/solid'
import {Link} from '@remix-run/react'
import type {SecretType} from '~/types'

export const Secrets = ({secrets}: {secrets: SecretType[]}) => {
  return (
    <div className='flex flex-col space-y-2'>
      {secrets.map(secret => (
        <div
          key={secret.id}
          className='flex w-full items-center justify-start rounded-md border border-blue border-opacity-10 bg-black2 px-3 py-2 transition-colors duration-200 hover:border-opacity-50 active:border'
        >
          <div className='rounded-full bg-blue bg-opacity-10 p-3 text-blue'>
            <LockClosedIcon className='h-5 w-5' />
          </div>
          <Link
            prefetch='intent'
            to={`/secrets/${secret.id}`}
            className='w-full'
          >
            <div className='ml-3 w-full cursor-pointer text-white'>
              <h2 className='font-medium'>{secret.secret_name}</h2>
              <p className='text-sm text-white opacity-50'>
                {secret.messages} messages
              </p>
            </div>
          </Link>
          <Link to={`/secrets/share/${secret.id}`} prefetch='intent'>
            <ShareIcon className='ml-3 mr-2 h-6 w-6 cursor-pointer text-blue' />
          </Link>
        </div>
      ))}
    </div>
  )
}
