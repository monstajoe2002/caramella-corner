import { addressFormSchema } from '@/lib/zod-schemas'
import { useForm } from '@tanstack/react-form'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { toast } from 'sonner'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import z from 'zod'
import { paymentMethodEnum } from '@/db/schema'
import { Banknote, BanknoteIcon, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
export function AddressForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      address: '',
      paymentMethod: 'cash',
    },
    validators: {
      onSubmit: addressFormSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success('Form submitted successfully')
    },
  })

  return (
    <form
      id="address-form"
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
                  placeholder="John Doe"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="address"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="123 El Gezira Street, Zamalek, Cairo, Egypt, 11211"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="paymentMethod"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <RadioGroupPrimitive.Root className="max-w-md w-full grid grid-cols-3 gap-4">
                  <RadioGroupPrimitive.Item
                    value={'cash'}
                    className={cn(
                      'relative group ring-[1px] ring-border rounded py-2 px-3 text-start',
                      'data-[state=checked]:ring-2 data-[state=checked]:ring-primary',
                    )}
                  >
                    <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-blue-500 stroke-white group-data-[state=unchecked]:hidden" />

                    <Banknote className="mb-2.5 text-muted-foreground" />
                    <span className="font-semibold tracking-tight">
                      Cash on delivery
                    </span>
                    <p className="text-xs">
                      Pay the full amount in cash once your order is shipped.
                    </p>
                  </RadioGroupPrimitive.Item>
                </RadioGroupPrimitive.Root>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>
    </form>
  )
}
