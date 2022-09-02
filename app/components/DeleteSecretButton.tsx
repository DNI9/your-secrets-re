import {TrashIcon} from '@heroicons/react/outline'
import type {HTMLAttributes} from 'react'

type Props = {
  disabled?: boolean
  styles?: HTMLAttributes<HTMLButtonElement>['style']
}

export const DeleteSecretButton = ({disabled = false, styles}: Props) => {
  return (
    <button
      disabled={disabled}
      type='submit'
      className='flex space-x-2 px-3 py-2 my-5 font-medium text-black rounded-md bg-red active:scale-95 disabled-button'
      style={styles}
    >
      <TrashIcon className='w-5 h-5' />
      <span>Delete secret</span>
    </button>
  )
}
