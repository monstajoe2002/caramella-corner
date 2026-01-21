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
import { useEffect, useState } from 'react'
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from '@/components/ui/shadcn-io/tags'
import { PlusIcon, CheckIcon, SaveIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useServerFn } from '@tanstack/react-start'
import { createCategory, editCategory } from '../data'
import slugify from 'slugify'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  subcategories: z
    .array(z.string().min(1))
    .min(1, 'Please enter at least one subcategory.'),
})

type CategoryFormProps = {
  data?: CategoryWithSubcategories
}

export default function CategoryForm({ data }: CategoryFormProps) {
  const createCategoryFn = useServerFn(createCategory)
  const editCategoryFn = useServerFn(editCategory)
  const [isLoading, setIsLoading] = useState(false)
  const [selected, setSelected] = useState<string[]>(
    data?.subcategories.map((s) => s.name) ?? [],
  )
  const [newTag, setNewTag] = useState<string>('')
  const [tags, setTags] = useState<{ id: string | null; name: string }[]>(
    data?.subcategories ?? [],
  )
  const navigate = useNavigate()

  const handleRemove = (value: string) => {
    if (!selected.includes(value)) {
      return
    }
    setSelected((prev) => prev.filter((v) => v !== value))
  }
  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      handleRemove(value)
      return
    }
    setSelected((prev) => [...prev, value])
  }
  const handleCreateTag = () => {
    setTags((prev) => [
      ...prev,
      {
        id: null, // New tags don't have a database ID yet
        name: newTag,
      },
    ])
    setSelected((prev) => [...prev, newTag])
    setNewTag('')
  }

  const form = useForm({
    defaultValues: {
      name: data?.name ?? '',
      subcategories: [] as string[],
    },
    validators: {
      onSubmit: categoryFormSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)

      try {
        const res = !data
          ? await createCategoryFn({
              data: {
                name: value.name,
                // slug: slugify(value.name, { lower: true }),
                subcategories: selected.map((sel) => ({
                  name: sel,
                  slug: slugify(sel, { lower: true }),
                })),
              },
            })
          : await editCategoryFn({
              data: {
                id: data.id,
                name: value.name,
                // slug: slugify(value.name, { lower: true }),
                subcategories: selected.map((sel) => {
                  // Find existing subcategory to preserve its ID
                  const existingSubcat = tags.find((t) => t.name === sel)
                  // Only include ID if it's a real database ID (not null)
                  const subcatData: any = {
                    name: sel,
                    slug: slugify(sel, { lower: true }),
                  }
                  // Only add ID if the subcategory exists in the database
                  if (existingSubcat?.id) {
                    subcatData.id = existingSubcat.id
                  }
                  return subcatData
                }),
              },
            })

        if (res.error) {
          toast.error(res.message)
        } else {
          toast.success(res.message)
          navigate({ to: '/admin/categories', replace: true })
        }
      } finally {
        setIsLoading(false)
      }
    },
  })
  // manually update the subcategories field when selected changes
  useEffect(() => {
    form.setFieldValue('subcategories', selected)
  }, [selected, form])
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
                  placeholder="New Collection"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="subcategories"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Subcategories</FieldLabel>
                <Tags>
                  <TagsTrigger>
                    {selected.map((tag) => (
                      <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
                        {tags.find((t) => t.name === tag)?.name}
                      </TagsValue>
                    ))}
                  </TagsTrigger>
                  <TagsContent>
                    <TagsInput
                      onValueChange={setNewTag}
                      placeholder="Search tag..."
                    />
                    <TagsList>
                      <TagsEmpty>
                        <Button
                          variant={'link'}
                          className="mx-auto flex cursor-pointer items-center gap-2"
                          onClick={handleCreateTag}
                          type="button"
                        >
                          <PlusIcon
                            className="text-muted-foreground"
                            size={14}
                          />
                          Create new tag: {newTag}
                        </Button>
                      </TagsEmpty>
                      <TagsGroup>
                        {tags.map((tag) => (
                          <TagsItem
                            key={tag.id ?? tag.name}
                            onSelect={handleSelect}
                            value={tag.name}
                          >
                            {tag.name}
                            {selected.includes(tag.name) && (
                              <CheckIcon
                                className="text-muted-foreground"
                                size={14}
                              />
                            )}
                          </TagsItem>
                        ))}
                      </TagsGroup>
                    </TagsList>
                  </TagsContent>
                </Tags>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

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
