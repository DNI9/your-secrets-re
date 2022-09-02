type Props = {
  message?: string
  description?: string
}

export const EmptyMessage = ({
  message = 'Nothing here',
  description,
}: Props) => {
  return (
    <div className='fixed top-1/2 left-1/2 w-full -translate-x-1/2 transform select-none text-center text-gray2'>
      <p>¯\_(ツ)_/¯</p>
      <h1 className='text-2xl'>{message}</h1>
      {description && <p className='text-sm'>{description}</p>}
    </div>
  )
}
