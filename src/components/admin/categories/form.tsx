import * as z from 'zod'
import { CategoryWithSubcategories, SelectCategory } from '@/db/types'
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  subcategories: z
    .array(z.string())
    .min(1, 'Please enter at least one subcategory.'),
})

type CategoryFormProps = {
  data: CategoryWithSubcategories
}

export default function CategoryForm({ data: {} }: CategoryFormProps) {
  return <div>CategoryForm</div>
}
