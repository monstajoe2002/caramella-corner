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
import { PlusIcon, CheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useServerFn } from '@tanstack/react-start'
import { createCategory } from '../data'
import slugify from 'slugify'
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
  const [selected, setSelected] = useState<string[]>([])
  const [newTag, setNewTag] = useState<string>('')
  const [tags, setTags] = useState<{ id: string; name: string }[]>(
    data?.subcategories ?? [],
  )

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
        id: crypto.randomUUID(),
        name: newTag,
      },
    ])
    setSelected((prev) => [...prev, newTag])
    setNewTag('')
  }

  const form = useForm({
    defaultValues: {
      name: '',
      subcategories: [] as string[],
    },
    validators: {
      onSubmit: categoryFormSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await createCategoryFn({
        data: {
          name: value.name,
          slug: slugify(value.name),
          subcategories: selected.map((sel) => ({
            name: sel,
            slug: slugify(sel),
          })),
        },
      })
      if (res.error) {
        alert(res.message)
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
                            key={tag.id}
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
        <Field orientation="horizontal">
          <Button type="submit">Create</Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
