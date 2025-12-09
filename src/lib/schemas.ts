import z from 'zod'
export const variantsSchema = z.object({
  sku: z.string().min(1, 'SKU is required').toUpperCase(),
  color: z.string(),
  size: z.string(),
})
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z
    .number('Price must be a number')
    .positive('Price must be greater than 0'),
  description: z.string().min(1, 'Proper description is required'),
  material: z.string().min(1, 'Material is required'),
  images: z.url('Invalid image URL'), // stored as text, could be JSON string or similar
  variants: z.array(variantsSchema),
  categoryId: z.uuid('Category ID must be a valid UUID'),
  subcategoryId: z.uuid('Subcategory ID must be a valid UUID'),
  active: z.boolean(),
  quantity: z.number().int().nonnegative(),
})
