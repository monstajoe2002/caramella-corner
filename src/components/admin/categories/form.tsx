import * as z from 'zod'
import { CategoryWithSubcategories } from '@/db/types'
import { useForm } from '@tanstack/react-form'
import {
  FieldGroup,
  FieldLabel,
  FieldError,
  Field,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  subcategories: z
    .array(z.string().min(1))
    .min(1, 'Please enter at least one subcategory.'),
})

type CategoryFormProps = {
  data: CategoryWithSubcategories
}

export default function CategoryForm({ data: {} }: CategoryFormProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      subcategories: [] as string[],
    },
    validators: {
      onSubmit: categoryFormSchema,
    },
    onSubmit: (values) => {
      console.log(values)
    },
  })
  return (
    <form
      id="bug-report-form"
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
                <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Login button not working on mobile"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>
    </form>
  )
}
