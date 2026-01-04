import { db } from '@/db'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
import * as schema from '@/db/schema'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
export const auth = betterAuth({
  emailAndPassword: { enabled: false },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true,
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, ctx) => {
        // send email to user
      },
    }),
    tanstackStartCookies(),
  ],
})
