import React from 'react'
import {Nav} from './Nav'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Nav title='Secrets' />
      <div className='container min-h-full px-4 md:mx-auto'>{children}</div>
    </>
  )
}
