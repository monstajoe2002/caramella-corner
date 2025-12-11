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
import { PlusIcon, SaveIcon, XIcon } from 'lucide-react'
import ImagekitUpload, { authenticator } from './imagekit-upload'
import {
  Image,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from '@imagekit/react'
import { cn } from '@/lib/utils'
import { ProductWithVariants } from '@/db/types'
import { productSchema } from '@/lib/schemas'
import slugify from 'slugify'
import { createProduct, editProduct } from '../data'
import { toast } from 'sonner'

type ProductFormProps = {
  data?: Omit<ProductWithVariants, 'category' | 'subcategory'>
}

export default function ProductForm({ data }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [catId, setCatId] = useState(data?.categoryId || '')
  const [images, setImages] = useState<string[]>(data?.images ?? [])
  const createProductFn = useServerFn(createProduct)
  const editProductFn = useServerFn(editProduct)
  const form = useForm({
    defaultValues: {
      name: data?.name ?? '',
      description: data?.description ?? '',
      price: Number(data?.price) ?? 0,
      material: data?.material ?? '',
      images: [] as string[],
      categoryId: data?.categoryId ?? '',
      subcategoryId: data?.subcategoryId ?? '',
      active: data?.active ?? true,
      quantity: data?.quantity ?? 0,
      variants:
        data?.variants && data.variants.length > 0
          ? data.variants
          : [
              {
                sku: '',
                color: '',
                size: '',
              },
            ],
    },
    validators: {
      onSubmit: productSchema,
      onBlur: productSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      const slug = slugify(value.name, { lower: true })

      // Only upload if there are files selected
      const uploadedImages: string[] = (await handleUpload(slug)) ?? []

      // Merge existing images with newly uploaded images
      const finalImages = [
        ...images.filter((url) => !url.includes('fakepath')),
        ...uploadedImages,
      ]

      // Update images state
      setImages(finalImages)

      // Common data structure for both create and edit
      const productData = {
        ...value,
        images: finalImages,
        categoryId: catId,
        slug,
        price: Number(value.price),
        variants: value.variants.map((variant) => ({
          sku: variant.sku,
          color: variant.color ?? '',
          size: variant.size ?? '',
        })),
      }

      try {
        if (!data) {
          // Creating new product
          const res = await createProductFn({ data: productData })
          if (res.error) {
            toast.error(res.message)
          } else {
            toast.success('Product created successfully!')
          }
        } else {
          // Editing existing product
          const res = await editProductFn({
            data: {
              id: data.id,
              ...productData,
            },
          })
          // TODO: fix error handling
          if (res.error) {
            toast.error(res.message)
          } else {
            toast.success('Product updated successfully!')
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
  })
  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController()

  const fileInputRef = useRef<HTMLInputElement>(null)
  // TODO: Handle image edit
  const handleUpload = async (slug?: string) => {
    const fileInput = fileInputRef.current

    // Return empty array if no files selected (not undefined)
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return [] // Changed from `return` to `return []`
    }

    const images: string[] = []
    const files = Array.from(fileInput.files)

    for (const file of files) {
      let authParams
      try {
        authParams = await authenticator()
      } catch (authError) {
        console.error('Failed to authenticate for upload:', authError)
        continue // Skip this file but continue with others
      }
      const { signature, expire, token } = authParams

      try {
        const uploadResponse = await upload({
          expire,
          token,
          signature,
          publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
          file,
          folder: `products/${data?.slug ?? slug}`,
          fileName: file.name,
          abortSignal: abortController.signal,
        })
        images.push(uploadResponse.url!)
      } catch (error) {
        if (error instanceof ImageKitInvalidRequestError) {
          toast.error(`Invalid request: ${error.message}`)
        } else if (error instanceof ImageKitUploadNetworkError) {
          toast.error(`Network error: ${error.message}`)
        } else if (error instanceof ImageKitServerError) {
          toast.error(`Server error: ${error.message}`)
        } else {
          toast.error(`Upload error: ${error}`)
        }
      }
    }

    fileInput.value = ''
    setImages((prev) => [...prev, ...images])
    return images
  }
  const getCategoriesFn = useServerFn(getCategories)
  const getSubcategoriesByCategoryIdFn = useServerFn(
    getSubcategoriesByCategoryId,
  )

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
  const handleDeleteImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url))
  }
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
                                    value={subField.state.value ?? ''}
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
                                    value={subField.state.value ?? ''}
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
                <div className="flex flex-wrap gap-4 mb-2">
                  {images.map((url, idx) => (
                    <div>
                      <Button
                        size={'icon-sm'}
                        type="button"
                        onClick={() => handleDeleteImage(url)}
                        variant={'destructive'}
                        className="rounded-full relative translate-x-16 translate-y-5"
                      >
                        <XIcon />
                      </Button>
                      <Image
                        key={idx}
                        src={url}
                        alt={`Product image ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {images.length > 0 ? 'Add more images:' : 'Upload images:'}
                  </p>
                  <ImagekitUpload
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    fileInputRef={fileInputRef}
                  />
                </div>
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
                    onValueChange={(val) => {
                      field.handleChange(val)
                      setCatId(val)
                    }}
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
            {!data ? (
              <>
                <PlusIcon /> Create
              </>
            ) : (
              <>
                <SaveIcon /> Save changes
              </>
            )}
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  )
}
