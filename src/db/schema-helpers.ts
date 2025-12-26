import { sql } from 'drizzle-orm'
import { timestamp, uuid } from 'drizzle-orm/pg-core'
import { products } from './schema'
export const id = uuid().primaryKey().defaultRandom()
export const createdAt = timestamp({ withTimezone: true })
  .notNull()
  .defaultNow()
export const updatedAt = timestamp({ withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())
export const priceAfterDiscount = (prodsTable: typeof products) =>
  sql<number>`ROUND((${prodsTable.price} * (1 - ${prodsTable.discount}))::numeric, 2)`.as(
    'price_after_discount',
  )
