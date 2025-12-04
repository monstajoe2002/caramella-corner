import { z } from 'zod'

// Product form schema based on drizzle-orm products schema
export const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  priceInPiasters: z
    .number('Price must be a number')
    .int()
    .positive('Price must be 0 or greater'),
  description: z.string().min(1, 'Proper description is required'),
  material: z.string().min(1, 'Material is required'),
  images: z.url('Invalid image URL'), // stored as text, could be JSON string or similar
  categoryId: z.uuid('Category ID must be a valid UUID'),
  subcategoryId: z.uuid('Subcategory ID must be a valid UUID').optional(),
  active: z.boolean().optional().default(true),
  quantity: z.number().int().nonnegative().optional().default(0),
})
type ProductFormProps = {}

export default function ProductForm({}: ProductFormProps) {
  return <div>ProductForm</div>
}
