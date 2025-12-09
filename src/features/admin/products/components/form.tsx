import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
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
import { getSubcategoriesByCategoryId } from '../../categories/data'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../categories/data'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { PlusIcon, XIcon } from 'lucide-react'
import ImagekitUpload, { authenticator } from './imagekit-upload'
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from '@imagekit/react'
import { cn } from '@/lib/utils'
import { ProductWithVariants } from '@/db/types'

const variantsSchema = z.object({
  sku: z.string().min(1, 'SKU is required').toUpperCase(),
  color: z.string(),
  size: z.string(),
})
// Product form schema based on drizzle-orm products schema
export const productFormSchema = z.object({
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
type ProductFormProps = {
  data?: ProductWithVariants
}

export default function ProductForm({ data }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      material: '',
      images: '',
      categoryId: '',
      subcategoryId: '',
      active: true,
      quantity: 0,
      variants: [
        {
          sku: '',
          color: '',
          size: '',
        },
      ],
    },
    validators: {
      onSubmit: productFormSchema,
      onBlur: productFormSchema,
    },
  })
  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Please select a file to upload')
      return
    }

    // Extract all files from the file input
    const files = Array.from(fileInput.files)

    for (const file of files) {
      // Retrieve authentication parameters for the upload.
      let authParams
      try {
        authParams = await authenticator()
      } catch (authError) {
        console.error('Failed to authenticate for upload:', authError)
        return
      }
      const { signature, expire, token } = authParams

      // Call the ImageKit SDK upload function with the required parameters and callbacks.
      try {
        const uploadResponse = await upload({
          // Authentication parameters
          expire,
          token,
          signature,
          publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
          file,
          fileName: file.name, // Optionally set a custom file name

          // Abort signal to allow cancellation of the upload if needed.
          abortSignal: abortController.signal,
        })
      } catch (error) {
        // Handle specific error types provided by the ImageKit SDK.
        if (error instanceof ImageKitAbortError) {
          console.error('Upload aborted:', error.reason)
        } else if (error instanceof ImageKitInvalidRequestError) {
          console.error('Invalid request:', error.message)
        } else if (error instanceof ImageKitUploadNetworkError) {
          console.error('Network error:', error.message)
        } else if (error instanceof ImageKitServerError) {
          console.error('Server error:', error.message)
        } else {
          // Handle any other errors that may occur.
          console.error('Upload error:', error)
        }
      }
    }
  }
  const getCategoriesFn = useServerFn(getCategories)
  const getSubcategoriesByCategoryIdFn = useServerFn(
    getSubcategoriesByCategoryId,
  )

  const catId = form.getFieldValue('categoryId')
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesFn,
  })
  const { data: subcategories } = useQuery({
    queryKey: ['subcategories', catId],
    queryFn: () =>
      getSubcategoriesByCategoryIdFn({ data: { categoryId: catId } }),
    enabled: !!catId,
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
          name="price"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>EGP</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Your product's price.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        {/* variants field goes here */}
        <form.Field
          name="variants"
          mode="array"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <FieldSet>
                <FieldLegend variant="label">Variants</FieldLegend>
                <FieldDescription>
                  Add different variants of your product here
                </FieldDescription>
                <FieldGroup>
                  {field.state.value.map((_, index) => (
                    <div
                      key={`variants[${index}]`}
                      className={cn(
                        'md:grid flex flex-col grid-cols-3 gap-4',
                        field.state.value.length > 1 && 'grid-cols-4',
                      )}
                    >
                      {/* SKU subfield */}
                      <form.Field
                        name={`variants[${index}].sku`}
                        children={(subField) => {
                          const isSubFieldInvalid =
                            subField.state.meta.isTouched &&
                            !subField.state.meta.isValid
                          return (
                            <Field data-invalid={isSubFieldInvalid}>
                              <FieldLabel htmlFor={field.name}>SKU</FieldLabel>
                              <FieldContent>
                                <InputGroup>
                                  <InputGroupInput
                                    id={`form-variants-array-sku-${index}`}
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                    aria-invalid={isSubFieldInvalid}
                                    placeholder="P001"
                                  />
                                </InputGroup>
                                {isSubFieldInvalid && (
                                  <FieldError
                                    errors={subField.state.meta.errors}
                                  />
                                )}
                              </FieldContent>
                            </Field>
                          )
                        }}
                      />
                      {/* color subfield */}
                      <form.Field
                        name={`variants[${index}].color`}
                        children={(subField) => {
                          const isSubFieldInvalid =
                            subField.state.meta.isTouched &&
                            !subField.state.meta.isValid
                          return (
                            <Field data-invalid={isSubFieldInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Color
                              </FieldLabel>
                              <FieldContent>
                                <InputGroup>
                                  <InputGroupInput
                                    id={`form-variants-array-color-${index}`}
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                    aria-invalid={isSubFieldInvalid}
                                    placeholder="Red"
                                  />
                                </InputGroup>
                                {isSubFieldInvalid && (
                                  <FieldError
                                    errors={subField.state.meta.errors}
                                  />
                                )}
                              </FieldContent>
                            </Field>
                          )
                        }}
                      />
                      {/* size subfield */}
                      <form.Field
                        name={`variants[${index}].size`}
                        children={(subField) => {
                          const isSubFieldInvalid =
                            subField.state.meta.isTouched &&
                            !subField.state.meta.isValid
                          return (
                            <Field data-invalid={isSubFieldInvalid}>
                              <FieldLabel htmlFor={field.name}>Size</FieldLabel>
                              <FieldContent>
                                <InputGroup>
                                  <InputGroupInput
                                    id={`form-variants-array-size-${index}`}
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                    aria-invalid={isSubFieldInvalid}
                                    placeholder="XL"
                                  />
                                </InputGroup>
                                {isSubFieldInvalid && (
                                  <FieldError
                                    errors={subField.state.meta.errors}
                                  />
                                )}
                              </FieldContent>
                            </Field>
                          )
                        }}
                      />
                      {/* delete button */}
                      {field.state.value.length > 1 && (
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            className="self-end"
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => field.removeValue(index)}
                            aria-label={`Remove variant ${index + 1}`}
                          >
                            <XIcon />
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}
                    </div>
                  ))}
                </FieldGroup>
                {/* add button outside the grid */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    field.pushValue({ color: '', size: '', sku: '' })
                  }
                  disabled={field.state.value.length >= 5}
                >
                  Add Variant
                </Button>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
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
                <ImagekitUpload
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  fileInputRef={fileInputRef}
                  handleUpload={handleUpload}
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
                        return (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
          <form.Subscribe
            selector={(state) => state.values.categoryId}
            children={(categoryId) => {
              return (
                categoryId && (
                  <form.Field
                    name="subcategoryId"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Subcategory
                          </FieldLabel>
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
                              {subcategories?.map((s) => {
                                return (
                                  <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  />
                )
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
        <Button type="submit" disabled={isLoading}>
          <LoadingSwap
            isLoading={isLoading}
            className="flex gap-2 items-center"
          >
            <PlusIcon /> Create
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  )
}
