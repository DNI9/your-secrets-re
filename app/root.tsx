import NProgress from 'nprogress'
import nProgressStyles from 'nprogress/nprogress.css'
import {useEffect} from 'react'
import {Toaster} from 'react-hot-toast'
import {
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
} from 'remix'
import Layout from './components/Layout'
import RouteChangeAnnouncement from './components/RouteChangeAnnouncement'
import {getLoggedInUser} from './sessions.server'
import styles from './styles/app.css'
import {UserContextProvider} from './useUser'

export let links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap',
    },
    {rel: 'stylesheet', href: styles},
    {rel: 'stylesheet', href: nProgressStyles},
    {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {rel: 'manifest', href: '/site.webmanifest'},
  ]
}

export const meta: MetaFunction = ({data}) => {
  const siteUrl = data.ENV.PROD_SITE_URL
  const description = `Share anonymous messages with friends`
  const title = 'Your Secrets | Share your Secret'

  return {
    title,
    description,
    keywords: 'quiz,messages,friends,anonymous',
    'og:type': 'website',
    'og:url': `${siteUrl}`,
    'og:title': title,
    'og:description': description,
    'og:image': `${siteUrl}/your-secrets-banner.png`,
  }
}

interface RootLoader {
  ENV: {[key: string]: string}
}

export const loader: LoaderFunction = async ({request}) => {
  const ENV = {
    PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
    PROD_SITE_URL: process.env.PROD_SITE_URL,
  }

  const user = await getLoggedInUser(request)
  return {ENV, user}
}

/**
 This component loads environment variables into window.ENV
 */
function EnvironmentSetter({env}: {env: {[key: string]: string}}) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.ENV = ${JSON.stringify(env)}`,
      }}
    />
  )
}

function Document({
  children,
  title = 'Your Secrets | Share your Secret',
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className='text-white bg-black'>
        {children}
        <Toaster
          toastOptions={{
            position: 'bottom-center',
            style: {
              border: '1px solid #96CDFB',
              padding: '5px 15px 5px',
              background: '#131020',
              color: '#D9E0EE',
            },
          }}
        />
        <RouteChangeAnnouncement />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

/**
 * The root module's default export is a component that renders the current
 * route via the `<Outlet />` component. Think of this as the global layout
 * component for your app.
 */
export default function App() {
  const {ENV} = useLoaderData<RootLoader>()
  const transition = useTransition()
  NProgress.configure({
    showSpinner: false,
    speed: 700,
    template: `<div class="bar" style="background: #96CDFB;" role="bar"><div class="peg"></div></div>`,
  })

  useEffect(() => {
    if (transition.state === 'idle') NProgress.done()
    else NProgress.start()
  }, [transition.state])

  return (
    <Document>
      <UserContextProvider>
        <Outlet />
      </UserContextProvider>
      <EnvironmentSetter env={ENV} />
    </Document>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  return (
    <Document title='Uh-oh!'>
      <Layout>
        <div className='p-3 text-white rounded-md bg-black2'>
          <h1 className='mb-2 text-2xl'>App Error</h1>
          <pre className='p-3 rounded-md bg-red bg-opacity-10 text-red'>
            {error.message}
          </pre>
        </div>
      </Layout>
    </Document>
  )
}
