import React, {useCallback} from 'react'
import {useLocation} from 'remix'
import {Nav} from './Nav'

const navExcludedPaths = ['/login']

export default function Layout({children}: {children: React.ReactNode}) {
  const location = useLocation()

  const checkLocation = useCallback(
    () => !navExcludedPaths.includes(location.pathname),
    [location.pathname]
  )

  const showNav = checkLocation()

  return (
    <>
      {showNav ? <Nav title='Secrets' /> : null}
      <div className='container min-h-full px-4 md:mx-auto'>{children}</div>
    </>
  )
}
