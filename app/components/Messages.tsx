import type {SerializeFrom} from '@remix-run/node'
import {format} from 'timeago.js'
import type {MessageType} from '~/types'
import {EmptyMessage} from './EmptyMessage'

type Props = {
  data: SerializeFrom<MessageType>[]
}

export const MessageList = ({data}: Props) => {
  if (!data?.length) {
    return (
      <EmptyMessage
        message='no messages yet'
        description='refresh or come back later'
      />
    )
  }

  return (
    <>
      {data.map(({id, content, inserted_at}) => (
        <div
          key={id}
          className='w-full rounded-md border border-blue border-opacity-10 bg-black2 px-3 py-2 text-white transition-colors duration-200 hover:border-opacity-50 active:border'
        >
          <h2>{content}</h2>
          <p className='mt-1 select-none text-xs text-white opacity-50'>
            {format(inserted_at)}
          </p>
        </div>
      ))}
    </>
  )
}
