import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import appCss from '../styles.css?url'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { ImageKitProvider } from '@imagekit/react'
import { getThemeServerFn, type T as Theme } from '@/lib/theme'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createRootRoute({
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
        title: 'Caramella Corner',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
    scripts: [
      {
        children: `
          (function() {
            function getCookie(name) {
              const value = "; " + document.cookie;
              const parts = value.split("; " + name + "=");
              if (parts.length === 2) return parts.pop().split(";").shift();
              return null;
            }
            function getTheme() {
              const stored = getCookie('_preferred-theme') || 'system';
              if (stored === 'system') {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              return stored;
            }
            const theme = getTheme();
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
          })();
        `,
      },
    ],
  }),
  loader: () => getThemeServerFn(),

  shellComponent: RootDocument,
})
const queryClient = new QueryClient()

function RootQueryClient({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData()
  // Initialize from document element (set by blocking script) or default to 'light'
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined') {
      const htmlClass = document.documentElement.className
      if (htmlClass.includes('dark')) return 'dark'
      if (htmlClass.includes('light')) return 'light'
    }
    return 'light'
  })

  // Resolve system theme preference
  useEffect(() => {
    const resolveTheme = (preference: Theme): 'light' | 'dark' => {
      if (preference === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      return preference
    }

    // Set initial resolved theme
    setResolvedTheme(resolveTheme(theme))

    // If theme is 'system', listen for system preference changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? 'dark' : 'light')
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // Apply theme class to HTML element
  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.classList.remove('light', 'dark')
    htmlElement.classList.add(resolvedTheme)
  }, [resolvedTheme])

  return (
    <html className={resolvedTheme} suppressHydrationWarning lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <RootQueryClient>
          <ImageKitProvider urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
            <Toaster richColors />
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
          </ImageKitProvider>
        </RootQueryClient>
      </body>
    </html>
  )
}
