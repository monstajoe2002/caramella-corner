import { createServerFn } from '@tanstack/react-start'
import { getCustomerByEmail } from './db'
import * as Sentry from '@sentry/tanstackstart-react'
import { auth } from '@/lib/auth'
import { getRequestHeaders } from '@tanstack/react-start/server'
export const getSessionCustomer = createServerFn().handler(async () => {
  return await Sentry.startSpan({ name: 'getSessionCustomer' }, async () => {
    const headers = getRequestHeaders()
    const { getSession } = auth.api
    const session = await getSession({ headers })

    if (!session) return

    const customer = await getCustomerByEmail(session.user.email)
    return customer
  })
})
export const getCurrentSession = createServerFn().handler(async () => {
  return await Sentry.startSpan({ name: 'getCurrentSession' }, async () => {
    const headers = getRequestHeaders()
    const { getSession } = auth.api
    const session = await getSession({ headers })

    if (!session) return

    return session
  })
})
