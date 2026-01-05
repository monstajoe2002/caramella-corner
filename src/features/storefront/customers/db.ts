import { db } from '@/db'
import { customers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getCustomerByEmail(email: string) {
  return await db.query.customers.findFirst({
    where: eq(customers.email, email),
  })
}
