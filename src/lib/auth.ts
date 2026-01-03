import { db } from '@/db'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '@/db/schema'
export const auth = betterAuth({
  emailAndPassword: { enabled: false },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      products: schema.products,
      users: schema.customers,
    },
    usePlural: true,
  }),
})
