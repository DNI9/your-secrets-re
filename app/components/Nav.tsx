import {UserIcon} from '@heroicons/react/solid'
import {NavLink} from '@remix-run/react'

type Props = {
  title: string
  sticky: boolean
}

export const Nav = ({title = 'Secrets', sticky}: Props) => {
  return (
    <nav
      className={`mb-2 flex h-16 items-center justify-between bg-gray bg-opacity-40 px-3 text-blue ${
        sticky ? 'sticky-nav' : ''
      }`}
    >
      <NavLink prefetch='intent' to='/'>
        <h1 className='cursor-pointer text-3xl font-light'>
          <span className='font-semibold'>
            {title.split('')[0].toUpperCase()}
          </span>
          {title.split('').slice(1).join('')}
        </h1>
      </NavLink>
      <NavLink prefetch='intent' to='/profile'>
        <div className='cursor-pointer rounded-full border-opacity-80 bg-blue bg-opacity-10 p-2 active:border-2'>
          <UserIcon className='h-5 w-5 text-blue' />
        </div>
      </NavLink>
    </nav>
  )
}
