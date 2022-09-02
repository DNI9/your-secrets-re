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
      className='disabled-button my-5 flex space-x-2 rounded-md bg-red px-3 py-2 font-medium text-black active:scale-95'
      style={styles}
    >
      <TrashIcon className='h-5 w-5' />
      <span>Delete secret</span>
    </button>
  )
}
