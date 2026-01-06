import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const storefrontAuthMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const headers = getRequestHeaders()

    const url = new URL(request.url)
    const path = url.pathname

    const session = await auth.api.getSession({ headers })

    if (!session && path.startsWith('/checkout')) {
      throw redirect({ to: '/login' })
    }
    if (session && path.startsWith('/login')) {
      throw redirect({ to: '/' })
    }

    return await next()
  },
)
