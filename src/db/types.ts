import { categories, subcategories } from './schema'

export type SelectCategory = typeof categories.$inferSelect
export type InsertCategory = typeof categories.$inferInsert

export type SelectSubcategory = typeof subcategories.$inferSelect
export type InsertSubcategory = typeof subcategories.$inferInsert
export type CategoryWithSubcategories = SelectCategory & {
  subcategories: Array<SelectSubcategory>
}
