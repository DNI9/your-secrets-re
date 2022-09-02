import type {ReactNode} from 'react'
import toast from 'react-hot-toast'
import type {LoaderFunction} from '@remix-run/node'
import {useLoaderData, useNavigate, useTransition} from '@remix-run/react'
import Layout from '~/components/Layout'
import useClipboard from '~/lib/useClipboard'

const ShareIcon = ({
  children,
  title,
  action,
}: {
  children: ReactNode
  title: string
  action?: () => void
}) => {
  return (
    <div
      onClick={action}
      className='flex flex-col items-center justify-center p-3 space-y-3 rounded-md cursor-pointer active:scale-95 hover:bg-gray2 hover:bg-opacity-20'
    >
      {children}
      <p className='text-xs'>{title}</p>
    </div>
  )
}

type LoaderData = {
  secretId: string
  siteUrl: string
}
export const loader: LoaderFunction = ({params}) => {
  const siteUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.PROD_SITE_URL
  return {secretId: params.secretId, siteUrl}
}

export default function ShareSecret() {
  const {secretId, siteUrl = 'http://localhost:3000'} =
    useLoaderData<LoaderData>()
  const navigate = useNavigate()
  const transition = useTransition()
  const [, copy] = useClipboard()
  const copyUrl = `${siteUrl}/messages/${secretId}`

  const disabled =
    transition.state === 'loading' || transition.state === 'submitting'

  const handleCopy = async () => {
    if (siteUrl && (await copy(copyUrl))) {
      toast.success('Sharing URL copied to clipboard', {id: secretId})
    } else {
      toast.error("Couldn't copy to clipboard", {id: secretId})
    }
  }

  return (
    <Layout>
      <div className='fixed w-full max-w-md text-center transform -translate-x-1/2 left-1/2 bottom-5'>
        <div className='relative p-3 mx-5 rounded-md bg-black2'>
          <h1 className='text-3xl font-medium'>Share Your Secret</h1>
          <p className='px-3 text-sm text-white opacity-80'>
            Share this secret with friends, so that they can write something
            about you, but you won&apos;t know who wrote the message, It&apos;s
            FUN!
          </p>
          <div className='flex justify-around py-2 my-5'>
            <a
              href={`https://api.whatsapp.com/send?text=Hi, send your secrets here ${copyUrl}`}
              data-action='share/whatsapp/share'
              target='_blank'
              rel='noreferrer'
            >
              <ShareIcon title='whatsapp'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M17.4988 14.382C17.1994 14.233 15.7313 13.515 15.458 13.415C15.1847 13.316 14.9858 13.267 14.7858 13.565C14.5869 13.861 14.0151 14.531 13.8413 14.729C13.6665 14.928 13.4926 14.952 13.1942 14.804C12.8958 14.654 11.9332 14.341 10.7927 13.329C9.90544 12.541 9.30557 11.568 9.13174 11.27C8.9579 10.973 9.11264 10.812 9.26236 10.664C9.39701 10.531 9.56079 10.317 9.71051 10.144C9.86022 9.97004 9.90946 9.84604 10.0089 9.64704C10.1094 9.44904 10.0592 9.27604 9.98382 9.12704C9.90946 8.97804 9.3126 7.51504 9.06341 6.92004C8.82125 6.34104 8.57507 6.42004 8.39219 6.41004C8.21736 6.40204 8.0184 6.40004 7.81945 6.40004C7.6205 6.40004 7.29695 6.47404 7.02364 6.77204C6.74932 7.06904 5.97863 7.78804 5.97863 9.25104C5.97863 10.713 7.04775 12.126 7.19747 12.325C7.34719 12.523 9.30255 15.525 12.2979 16.812C13.0113 17.118 13.567 17.301 14.0001 17.437C14.7155 17.664 15.3666 17.632 15.8811 17.555C16.4538 17.47 17.6475 16.836 17.8967 16.142C18.1449 15.448 18.1449 14.853 18.0705 14.729C17.9962 14.605 17.7972 14.531 17.4978 14.382H17.4988ZM12.0507 21.785H12.0467C10.2676 21.7854 8.52118 21.3094 6.99048 20.407L6.62875 20.193L2.86874 21.175L3.87255 17.527L3.63642 17.153C2.64179 15.5774 2.11543 13.7538 2.11814 11.893C2.12015 6.44304 6.57549 2.00904 12.0547 2.00904C14.7074 2.00904 17.2014 3.03904 19.0764 4.90704C20.0012 5.82362 20.7342 6.91361 21.233 8.11394C21.7318 9.31427 21.9864 10.6011 21.9823 11.9C21.9803 17.35 17.5249 21.785 12.0507 21.785V21.785ZM20.5032 3.48804C19.3961 2.37896 18.0788 1.49958 16.6277 0.900841C15.1766 0.302105 13.6206 -0.00407625 12.0497 4.09775e-05C5.46417 4.09775e-05 0.102491 5.33504 0.100481 11.892C0.0974296 13.9788 0.647475 16.0294 1.69512 17.837L0 24L6.33434 22.346C8.0866 23.2962 10.0502 23.794 12.0457 23.794H12.0507C18.6363 23.794 23.9979 18.459 23.9999 11.901C24.0048 10.3383 23.6983 8.79014 23.0981 7.34607C22.4978 5.90201 21.6159 4.59071 20.5032 3.48804'
                    fill='#4AC975'
                  />
                </svg>
              </ShareIcon>
            </a>
            <a
              href={`https://t.me/share/url?url=${copyUrl}&text=Hi, send your secrets here`}
              data-action='share/telegram/share'
              target='_blank'
              rel='noreferrer'
            >
              <ShareIcon title='telegram'>
                <svg
                  width='29'
                  height='24'
                  viewBox='0 0 29 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M26.6853 0.157806L1.33623 9.93284C-0.393737 10.6277 -0.383729 11.5928 1.01883 12.0231L7.52694 14.0533L22.5848 4.55278C23.2968 4.11958 23.9473 4.35262 23.4126 4.82729L11.2128 15.8376H11.2099L11.2128 15.839L10.7638 22.5473C11.4215 22.5473 11.7117 22.2456 12.0806 21.8896L15.2417 18.8157L21.8171 23.6725C23.0295 24.3402 23.9002 23.9971 24.2018 22.5502L28.5182 2.20803C28.96 0.436602 27.8419 -0.365474 26.6853 0.157806V0.157806Z'
                    fill='#309AE7'
                  />
                </svg>
              </ShareIcon>
            </a>
            <ShareIcon title='Copy URL' action={() => handleCopy()}>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M20 8H16V3.56C15.9965 2.61691 15.6203 1.71345 14.9534 1.04658C14.2865 0.379711 13.3831 0.00351247 12.44 0H3.56C2.61691 0.00351247 1.71345 0.379711 1.04658 1.04658C0.379711 1.71345 0.00351247 2.61691 0 3.56V12.44C0.00351247 13.3831 0.379711 14.2865 1.04658 14.9534C1.71345 15.6203 2.61691 15.9965 3.56 16H8V20C8 21.0609 8.42143 22.0783 9.17157 22.8284C9.92172 23.5786 10.9391 24 12 24H20C21.0609 24 22.0783 23.5786 22.8284 22.8284C23.5786 22.0783 24 21.0609 24 20V12C24 10.9391 23.5786 9.92172 22.8284 9.17157C22.0783 8.42143 21.0609 8 20 8ZM8 12V13.3333H3.56C3.32307 13.3333 3.09585 13.2392 2.92832 13.0717C2.76079 12.9041 2.66667 12.6769 2.66667 12.44V3.56C2.66667 3.32307 2.76079 3.09585 2.92832 2.92832C3.09585 2.76079 3.32307 2.66667 3.56 2.66667H12.44C12.6769 2.66667 12.9041 2.76079 13.0717 2.92832C13.2392 3.09585 13.3333 3.32307 13.3333 3.56V8H12C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12Z'
                  fill='#DDB6F2'
                />
              </svg>
            </ShareIcon>
          </div>
          <button
            onClick={() => navigate('/')}
            disabled={disabled}
            className='px-5 py-2 text-sm font-medium tracking-widest rounded-md bg-gray active:scale-95 disabled-button'
          >
            CLOSE
          </button>
        </div>
      </div>
    </Layout>
  )
}
