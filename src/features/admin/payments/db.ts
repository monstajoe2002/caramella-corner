import { db } from '@/db'
import { payments } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function getPaymentsWithOrders() {
  return await db.query.payments.findMany({
    with: { order: true },
    orderBy: [desc(payments.createdAt)],
  })
}
