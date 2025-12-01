import {
  pgTable,
  varchar,
  integer,
  boolean,
  text,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createdAt, id, updatedAt } from './schema-helpers'

export const orderStatusEnum = pgEnum('status', [
  'pending',
  'delivered',
  'canceled',
])
export const paymentStatusEnum = pgEnum('status', [
  'pending',
  'completed',
  'cancelled',
])

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
  categoryId: varchar('category_id').references(() => categories.id),
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
  images: text('images'), // Storing as text, could be JSON or array
  priceInPlasters: integer('price_in_plasters').notNull(),
  description: text('description'),
  material: varchar('material'),
  categoryId: varchar('category_id').references(() => categories.id),
  subcategoryId: varchar('subcategory_id').references(() => subcategories.id),
  active: boolean('active').default(true),
  quantity: integer('quantity').default(0),
  createdAt,
  updatedAt,
})

// Variant table
export const variants = pgTable('variants', {
  id,
  sku: varchar('sku').notNull().unique(),
  productId: varchar('product_id').references(() => products.id),
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
  paymentId: varchar('payment_id'),
  orderNumber: varchar('order_number').notNull().unique(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(), // Total price
  customerId: varchar('customer_id').references(() => customers.id),
  status: orderStatusEnum(), // e.g., 'pending', 'completed', 'cancelled'
  createdAt,
  updatedAt,
})

// Order items table (for individual items in an order)
export const orderItems = pgTable('order_items', {
  id,
  orderId: varchar('order_id').references(() => orders.id),
  quantity: integer('quantity').notNull(),
  priceAtOrder: integer('price_at_order').notNull(),
  variantId: varchar('variant_id').references(() => variants.id),
  createdAt,
  updatedAt,
})

// Payment table
export const payments = pgTable('payments', {
  id,
  status: paymentStatusEnum(), // e.g., 'pending', 'completed', 'failed'
  orderId: varchar('order_id').references(() => orders.id),
  amount: integer('amount').notNull(),
  paymentMethod: varchar('payment_method').notNull(), // Fixed from 'payment method'
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
