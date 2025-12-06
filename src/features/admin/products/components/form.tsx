import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getCategories } from '../../categories/data'
import { useQuery } from '@tanstack/react-query'

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
  const getCategoriesFn = useServerFn(getCategories)
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoriesFn(),
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
                  Provide a name for your product.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                <FieldDescription>
                  Describe your product in detail.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="material"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Material</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="50% cotton, 50% polyester"
                  autoComplete="off"
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="images"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Images</FieldLabel>
                <Input
                  type="file"
                  multiple
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <FieldSet className="md:grid grid-cols-2 flex">
          <form.Field
            name="categoryId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  >
                    <SelectTrigger
                      id="product-select-category"
                      aria-invalid={isInvalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {categories?.map((c) => {
                        return <SelectItem value={c.id}>{c.name}</SelectItem>
                      })}
                    </SelectContent>
                  </Select>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
          <form.Field
            name="subcategoryId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Subcategory</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  >
                    <SelectTrigger
                      id="product-select-subcategory"
                      aria-invalid={isInvalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {categories?.map((c) => {
                        return c.subcategories.map((s) => {
                          return <SelectItem value={s.id}>{s.name}</SelectItem>
                        })
                      })}
                    </SelectContent>
                  </Select>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldSet>
        <FieldSet>
          <form.Field
            name="quantity"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
          <form.Field
            name="active"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field orientation={'horizontal'} data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="form-tanstack-switch-twoFactor">
                      Active
                    </FieldLabel>
                    <FieldDescription>
                      If you uncheck this, your product will <b>not</b> be
                      displayed on the storefront.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    aria-invalid={isInvalid}
                  />
                </Field>
              )
            }}
          />
        </FieldSet>
      </FieldGroup>
    </form>
  )
}
