import {
  pgTable,
  varchar,
  integer,
  boolean,
  text,
  pgEnum,
  uuid,
  numeric,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createdAt, id, updatedAt } from './schema-helpers'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'delivered',
  'canceled',
])
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
])
export const paymentMethodEnum = pgEnum('payment_method', ['credit', 'cash'])

// Category table
export const categories = pgTable('categories', {
  id,
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull(),
  createdAt,
  updatedAt,
})

// Subcategory table
export const subcategories = pgTable('subcategories', {
  id,
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'cascade',
  }),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull(),
  createdAt,
  updatedAt,
})

// Product table
export const products = pgTable('products', {
  id,
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull(),
  // images: text('images').array().notNull(), // Storing as text, could be JSON or array
  price: numeric('price').notNull(),
  description: text('description').notNull(),
  material: varchar('material').notNull(),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'cascade',
  }),
  subcategoryId: uuid('subcategory_id').references(() => subcategories.id, {
    onDelete: 'cascade',
  }),
  active: boolean('active').default(true),
  quantity: integer('quantity').default(0),
  createdAt,
  updatedAt,
})
// Image Table
export const images = pgTable('images', {
  id,
  productId: uuid('product_id').references(() => products.id, {
    onDelete: 'cascade',
  }),
  ikFileId: varchar('ik_file_id').notNull(),
  ikFileName: varchar('ik_file_name').notNull(),
  ikUrl: varchar('ik_url').notNull(),
  ikThumbnailUrl: varchar('ik_thumbnail_url').notNull(),
})

// Variant table
export const variants = pgTable('variants', {
  id,
  sku: varchar('sku').notNull().unique(),
  productId: uuid('product_id').references(() => products.id, {
    onDelete: 'cascade',
  }),
  color: varchar('color'),
  size: varchar('size'),
  createdAt,
  updatedAt,
})

// Customer table
export const customers = pgTable('customers', {
  id,
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  address: text('address'),
  createdAt,
  updatedAt,
})

// Order table (main orders table)
export const orders = pgTable('orders', {
  id,
  paymentId: uuid('payment_id'),
  orderNumber: varchar('order_number').notNull().unique(),
  quantity: integer('quantity').notNull(),
  price: numeric('price').notNull(), // Total price
  customerId: uuid('customer_id').references(() => customers.id, {
    onDelete: 'cascade',
  }),
  status: orderStatusEnum().notNull(), // e.g., 'pending', 'completed', 'cancelled'
  createdAt,
  updatedAt,
})

// Order items table (for individual items in an order)
export const orderItems = pgTable('order_items', {
  id,
  orderId: uuid('order_id').references(() => orders.id, {
    onDelete: 'cascade',
  }),
  quantity: integer('quantity').notNull(),
  priceAtOrder: numeric('price_at_order').notNull(),
  variantId: uuid('variant_id').references(() => variants.id),
  createdAt,
  updatedAt,
})

// Payment table
export const payments = pgTable('payments', {
  id,
  status: paymentStatusEnum().notNull(), // e.g., 'pending', 'completed', 'failed'
  orderId: uuid('order_id').references(() => orders.id, {
    onDelete: 'cascade',
  }),
  amount: numeric('amount').notNull(),
  paymentMethod: paymentMethodEnum().notNull(), // Fixed from 'payment method'
  createdAt,
  updatedAt,
})

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  products: many(products),
}))

export const subcategoriesRelations = relations(
  subcategories,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subcategories.categoryId],
      references: [categories.id],
    }),
    products: many(products),
  }),
)

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  variants: many(variants),
  images: many(images),
}))

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}))

export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  orderItems: many(orderItems),
}))

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  payment: one(payments, {
    fields: [orders.paymentId],
    references: [payments.id],
  }),
  orderItems: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(variants, {
    fields: [orderItems.variantId],
    references: [variants.id],
  }),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}))
