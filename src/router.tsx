import { createRouter } from '@tanstack/react-router'

import * as Sentry from '@sentry/tanstackstart-react'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  if (!router.isServer) {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.replayIntegration(),
        Sentry.feedbackIntegration({ colorScheme: true }),
      ],
      tracesSampleRate: 1.0,
      sendDefaultPii: true,
      enableLogs: true,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  }

  return router
}
