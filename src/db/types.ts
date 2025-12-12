import { categories, images, products, subcategories, variants } from './schema'
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
}
export type NewProductWithVariants = NewProduct & {
  variants: Array<NewVariant>
  category?: Category
  subcategory?: Subcategory
  images?: Image[]
}
