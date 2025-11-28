import { pgTable, varchar, integer, boolean, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Category table
export const categories = pgTable('categories', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull(),
  subcategories: varchar('subcategories').array(), // Array of subcategory names
})

// Product table
export const products = pgTable('products', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull(),
  images: text('images'), // Storing as text, could be JSON or array
  priceInPlasters: integer('price_in_plasters').notNull(),
  description: text('description'),
  material: varchar('material'),
  categoryId: varchar('category_id').references(() => categories.id),
  active: boolean('active').default(true),
  quantity: integer('quantity').default(0),
})

// Variant table
export const variants = pgTable('variants', {
  id: varchar('id').primaryKey(),
  sku: varchar('sku').notNull().unique(),
  productId: varchar('product_id').references(() => products.id),
})

// Customer table
export const customers = pgTable('customers', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  address: text('address'),
})

// Order table (main orders table)
export const orders = pgTable('orders', {
  id: varchar('id').primaryKey(),
  paymentId: varchar('payment_id'),
  orderNumber: varchar('order_number').notNull().unique(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(), // Total price in plasters
  customerId: varchar('customer_id').references(() => customers.id),
  status: varchar('status').notNull(), // e.g., 'pending', 'completed', 'cancelled'
})

// Order items table (for individual items in an order)
export const orderItems = pgTable('order_items', {
  id: varchar('id').primaryKey(),
  orderId: varchar('order_id').references(() => orders.id),
  quantity: integer('quantity').notNull(),
  priceAtOrder: integer('price_at_order').notNull(), // Price at time of order
  variantId: varchar('variant_id').references(() => variants.id),
})

// Payment table
export const payments = pgTable('payments', {
  id: varchar('id').primaryKey(),
  status: varchar('status').notNull(), // e.g., 'pending', 'completed', 'failed'
  orderId: varchar('order_id').references(() => orders.id),
  amount: integer('amount').notNull(),
  paymentMethod: varchar('payment_method').notNull(), // e.g., 'card', 'paypal'
})

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
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
