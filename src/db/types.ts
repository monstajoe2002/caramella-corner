import {
  categories,
  images,
  products,
  subcategories,
  variants,
  customers,
  orders,
  payments,
  orderItems,
} from './schema'
// category
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

//subcategory
export type Subcategory = typeof subcategories.$inferSelect
export type NewSubcategory = typeof subcategories.$inferInsert
export type CategoryWithSubcategories = Category & {
  subcategories: Array<Subcategory>
}
export type NewCategoryWithSubcategories = NewCategory & {
  subcategories: Array<NewSubcategory>
}
// variant
export type Variant = typeof variants.$inferSelect
export type NewVariant = typeof variants.$inferInsert

// images
export type Image = typeof images.$inferSelect
export type NewImage = typeof images.$inferInsert

// product
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type ProductWithVariants = Product & {
  variants: Array<Variant>
  category: Category
  subcategory: Subcategory
  images: Array<Image>
}
export type NewProductWithVariants = NewProduct & {
  variants: Array<NewVariant>
  category?: Category
  subcategory?: Subcategory
  images?: Array<NewImage>
}

// customer
export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert

// payment
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert

// order
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type NewOrderWithItems = NewOrder & {
  orderItems: NewOrderItem[]
}
export type OrderWithCustomer = Order & {
  customer: Customer
  payment: Payment | null
  orderItems: OrderItemWithVariant[]
}

// order item
export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
export type OrderItemWithVariant = OrderItem & {
  variant: Variant
}
