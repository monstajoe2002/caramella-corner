import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { priceAfterDiscount } from '@/db/schema-helpers'
import { eq, and, or, ilike, sql, desc } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'

export async function getActiveProducts({
  limit = 10,
  offset = 0,
  categoryId,
  subcategoryId,
}: {
  limit?: number
  offset?: number
  categoryId?: string
  subcategoryId?: string
} = {}) {
  const conditions = [eq(products.active, true)]
  if (categoryId) conditions.push(eq(products.categoryId, categoryId))
  if (subcategoryId) conditions.push(eq(products.subcategoryId, subcategoryId))

  return await db.query.products.findMany({
    where: and(...conditions),
    orderBy: [desc(products.createdAt), desc(products.updatedAt)],
    with: { variants: true, category: true, subcategory: true, images: true },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
    limit,
    offset,
  })
}

export async function getActiveProductsCount(filters?: {
  categoryId?: string
  subcategoryId?: string
}) {
  const { categoryId, subcategoryId } = filters ?? {}
  const conditions = [eq(products.active, true)]
  if (categoryId) conditions.push(eq(products.categoryId, categoryId))
  if (subcategoryId) conditions.push(eq(products.subcategoryId, subcategoryId))

  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(and(...conditions))

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
  filters?: { categoryId?: string; subcategoryId?: string },
) {
  const searchTerm = `%${query}%`
  const conditions = [
    eq(products.active, true),
    or(
      ilike(products.name, searchTerm),
      ilike(products.description, searchTerm),
      ilike(products.material, searchTerm),
    ),
  ]
  if (filters?.categoryId)
    conditions.push(eq(products.categoryId, filters.categoryId))
  if (filters?.subcategoryId)
    conditions.push(eq(products.subcategoryId, filters.subcategoryId))

  return await db.query.products.findMany({
    where: and(...conditions),
    with: { variants: true, category: true, subcategory: true, images: true },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
    limit,
    offset,
  })
}

export async function searchActiveProductsCount(
  query: string,
  filters?: { categoryId?: string; subcategoryId?: string },
) {
  const searchTerm = `%${query}%`
  const conditions = [
    eq(products.active, true),
    or(
      ilike(products.name, searchTerm),
      ilike(products.description, searchTerm),
      ilike(products.material, searchTerm),
    ),
  ]
  if (filters?.categoryId)
    conditions.push(eq(products.categoryId, filters.categoryId))
  if (filters?.subcategoryId)
    conditions.push(eq(products.subcategoryId, filters.subcategoryId))

  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(and(...conditions))

  return Number(result[0]?.count || 0)
}
