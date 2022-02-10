import React from 'react'
import {useLoaderData} from 'remix'

export default function Layout({children}: {children: React.ReactNode}) {
  const loader = useLoaderData() || {}
  const userId = loader.user?.id

  return (
    <div className=''>
      <div className='container mx-auto'>{children}</div>
    </div>
  )
}
