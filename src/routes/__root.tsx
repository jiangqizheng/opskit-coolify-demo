import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { Toaster } from '../components/ui/sonner'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'alternate icon',
        href: '/favicon.ico',
        type: 'image/x-icon',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: RootError,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <Header />
        {children}
        <Footer />
        <Toaster />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function RootError({ error }: { error: Error }) {
  const router = useRouter()

  return (
    <main className="page-wrap flex min-h-[calc(100vh-14rem)] items-center px-4 py-12">
      <section className="island-shell w-full rounded-2xl p-6">
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {error.message || 'The route failed to render.'}
          </AlertDescription>
        </Alert>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button className="demo-button" type="button" onClick={() => router.invalidate()}>
            Retry
          </Button>
          <Button asChild className="demo-button demo-button-secondary no-underline" variant="secondary">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

function NotFound() {
  return (
    <main className="page-wrap flex min-h-[calc(100vh-14rem)] items-center px-4 py-12">
      <section className="island-shell w-full rounded-2xl p-6">
        <Alert>
          <AlertTitle>Page not found</AlertTitle>
          <AlertDescription>The requested route does not exist.</AlertDescription>
        </Alert>
        <div className="mt-5">
          <Button asChild className="demo-button no-underline">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
