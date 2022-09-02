import {UserIcon} from '@heroicons/react/solid'
import {NavLink} from '@remix-run/react'

type Props = {
  title: string
  sticky: boolean
}

export const Nav = ({title = 'Secrets', sticky}: Props) => {
  return (
    <nav
      className={`flex items-center justify-between h-16 px-3 mb-2 bg-opacity-40 text-blue bg-gray ${
        sticky ? 'sticky-nav' : ''
      }`}
    >
      <NavLink prefetch='intent' to='/'>
        <h1 className='text-3xl font-light cursor-pointer'>
          <span className='font-semibold'>
            {title.split('')[0].toUpperCase()}
          </span>
          {title.split('').slice(1).join('')}
        </h1>
      </NavLink>
      <NavLink prefetch='intent' to='/profile'>
        <div className='p-2 rounded-full cursor-pointer bg-blue bg-opacity-10 active:border-2 border-opacity-80'>
          <UserIcon className='w-5 h-5 text-blue' />
        </div>
      </NavLink>
    </nav>
  )
}
