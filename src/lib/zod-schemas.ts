import z from 'zod'
export const imagesSchema = z.object({
  id: z.string().optional(),
  ikFileId: z.string().nonempty(),
  ikFileName: z.string().nonempty(),
  ikUrl: z.string().nonempty(),
  ikThumbnailUrl: z.string().nonempty(),
})

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
  discount: z
    .number()
    .int()
    .nonnegative()
    .min(0)
    .max(100, 'Invalid discount value'),
  material: z.string().min(1, 'Material is required'),
  images: z.array(imagesSchema),
  variants: z.array(variantsSchema).min(1, 'At least one variant is need'),
  categoryId: z.uuid('Category ID must be a valid UUID'),
  subcategoryId: z.uuid('Subcategory ID must be a valid UUID'),
  active: z.boolean(),
  quantity: z.number().int().nonnegative(),
})

export const customerFormSchema = z.object({
  email: z.email('Invalid email address').nonempty(),
})
