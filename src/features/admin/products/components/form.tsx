import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

// Product form schema based on drizzle-orm products schema
export const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  priceInPiasters: z
    .number('Price must be a number')
    .int()
    .positive('Price must be greater than 0'),
  description: z.string().min(1, 'Proper description is required'),
  material: z.string().min(1, 'Material is required'),
  images: z.url('Invalid image URL'), // stored as text, could be JSON string or similar
  categoryId: z.uuid('Category ID must be a valid UUID'),
  subcategoryId: z.uuid('Subcategory ID must be a valid UUID'),
  active: z.boolean().optional().default(true),
  quantity: z.number().int().nonnegative().default(0),
})
type ProductFormProps = {}

export default function ProductForm({}: ProductFormProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      priceInPiasters: 0,
      material: '',
      images: '',
      categoryId: '',
      subcategoryId: '',
      active: true,
      quantity: 0,
    },
  })
  return <div>ProductForm</div>
}
