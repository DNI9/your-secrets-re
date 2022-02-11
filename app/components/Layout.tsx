import React from 'react'
import {Nav} from './Nav'

type Props = {
  children: React.ReactNode
  showNav?: boolean
  navTitle?: string
}

export default function Layout({
  children,
  showNav = true,
  navTitle = 'Secrets',
}: Props) {
  return (
    <>
      {showNav ? <Nav title={navTitle} /> : null}
      <div className='container min-h-full px-4 md:mx-auto'>{children}</div>
    </>
  )
}
