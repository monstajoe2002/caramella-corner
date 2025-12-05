import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
  active: z.boolean(),
  quantity: z.number().int().nonnegative(),
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
    validators: {
      onSubmit: productFormSchema,
    },
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                <FieldDescription>
                  Provide a concise title for your bug report.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>
    </form>
  )
}
