import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { priceAfterDiscount } from '@/db/schema-helpers'
import { eq, and, or, ilike, sql } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'
export async function getActiveProducts({
  limit = 10,
  offset = 0,
}: {
  limit?: number
  offset?: number
}) {
  return await db.query.products.findMany({
    where: eq(products.active, true),
    with: { variants: true, category: true, images: true },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
    limit,
    offset,
  })
}

export async function getActiveProductsCount() {
  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(eq(products.active, true))

  return Number(result[0]?.count || 0)
}
export async function getActiveProductsByCategorySlug(slug: string) {
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
export async function getProductBySlug(slug: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      variants: true,
      category: true,
      subcategory: true,
      images: true,
    },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
  })

  if (product == null) throw notFound()
  return product
}

export async function searchActiveProducts(
  query: string,
  limit?: number,
  offset?: number,
) {
  const searchTerm = `%${query}%`
  return await db.query.products.findMany({
    where: and(
      eq(products.active, true),
      or(
        ilike(products.name, searchTerm),
        ilike(products.description, searchTerm),
        ilike(products.material, searchTerm),
      ),
    ),
    with: { variants: true, category: true, images: true },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
    limit,
    offset,
  })
}

export async function searchActiveProductsCount(query: string) {
  const searchTerm = `%${query}%`
  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(
      and(
        eq(products.active, true),
        or(
          ilike(products.name, searchTerm),
          ilike(products.description, searchTerm),
          ilike(products.material, searchTerm),
        ),
      ),
    )

  return Number(result[0]?.count || 0)
}
