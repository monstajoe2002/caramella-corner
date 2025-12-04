import { categories, products, subcategories } from './schema'
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

// product
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
