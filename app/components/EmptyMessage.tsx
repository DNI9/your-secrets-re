type Props = {
  message?: string
  description?: string
}

export const EmptyMessage = ({
  message = 'Nothing here',
  description,
}: Props) => {
  return (
    <div className='fixed w-full text-center transform -translate-x-1/2 select-none text-gray2 top-1/2 left-1/2'>
      <p>¯\_(ツ)_/¯</p>
      <h1 className='text-2xl'>{message}</h1>
      {description && <p className='text-sm'>{description}</p>}
    </div>
  )
}
