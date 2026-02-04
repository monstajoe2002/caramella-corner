import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'
import { priceAfterDiscount } from '@/db/schema-helpers'
export async function getProductsByCategorySlug(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  })

  if (category == null) throw notFound()

  return await db.query.products.findMany({
    where: eq(products.categoryId, category.id),
    with: { variants: true, category: true, images: true },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
  })
}
