import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export const getCategories = createServerFn().handler(async () => {
  return await db.query.categories.findMany({
    with: { subcategories: true },
  })
})
