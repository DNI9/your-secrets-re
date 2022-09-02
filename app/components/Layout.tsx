import React from 'react'
import {Nav} from './Nav'

type Props = {
  children: React.ReactNode
  showNav?: boolean
  navTitle?: string
  stickyNav?: boolean
}

export default function Layout({
  children,
  showNav = true,
  navTitle = 'Secrets',
  stickyNav = false,
}: Props) {
  return (
    <>
      {showNav ? <Nav title={navTitle} sticky={stickyNav} /> : null}
      <div className='container mx-auto min-h-full px-4 md:max-w-lg lg:max-w-2xl'>
        {children}
      </div>
    </>
  )
}
