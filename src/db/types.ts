import { categories, subcategories } from './schema'

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export type Subcategory = typeof subcategories.$inferSelect
export type NewSubcategory = typeof subcategories.$inferInsert
export type CategoryWithSubcategories = Category & {
  subcategories: Array<Subcategory>
}
