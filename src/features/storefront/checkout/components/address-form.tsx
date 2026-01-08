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
import { Banknote, CheckIcon, CircleCheck, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Customer } from '@/db/types'
import { placeOrder } from '../../orders/data'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { CartItem } from '@/lib/types'
import { authClient } from '@/lib/auth-client'
interface AddressFormProps {
  customerData: Pick<Customer, 'address'>
  cartItems: Array<Pick<CartItem, 'price' | 'quantity' | 'variant'>>
  cartQuantity: number
}
export function AddressForm({
  customerData: { address },
  cartQuantity,
  cartItems,
}: AddressFormProps) {
  const { data } = authClient.useSession()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    defaultValues: {
      name: data?.user.name || '',
      address: address || '',
      paymentMethod: 'cash',
    },
    validators: {
      onSubmit: addressFormSchema,
    },
    onSubmit: async ({ value: { address, name } }) => {
      const totalPrice = cartItems
        .reduce((sum, item) => sum + Number(item.price) * item.quantity!, 0)
        .toFixed(2)
      setIsLoading(true)
      const orderData = {
        price: Number(totalPrice),
        quantity: cartQuantity,
        addressInfo: {
          address,
          name,
        },
        orderItems: cartItems.map((item) => ({
          priceAtOrder: Number(item.price),
          quantity: item.quantity!,
          variantId: item.variant.id,
        })),
        customerInfo: {
          email: data?.user.email || '',
          id: data?.user.id || '',
        },
      }
      // console.log(orderData)
      const res = await placeOrder({
        data: orderData,
      })
      if (res?.error) {
        toast.error(res.message)
        setIsLoading(false)
      } else {
        toast.success('Order placed successfully!')
      }
      setIsLoading(false)
    },
  })

  return (
    <form
      id="address-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col"
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
                <FieldLabel htmlFor={field.name}>Payment Method</FieldLabel>
                <RadioGroupPrimitive.Root
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="max-w-lg w-full grid grid-cols-2 gap-4"
                >
                  <RadioGroupPrimitive.Item
                    value={'cash'}
                    className={cn(
                      'relative group ring-[1px] ring-border rounded py-2 px-3 text-start',
                      'data-[state=checked]:ring-2 data-[state=checked]:ring-primary',
                    )}
                  >
                    <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-primary stroke-white group-data-[state=unchecked]:hidden" />

                    <Banknote className="mb-2.5 text-muted-foreground" />
                    <span className="font-semibold tracking-tight">
                      Cash on delivery
                    </span>
                    <p className="text-xs">
                      Pay the full amount in cash when the item is delivered.
                    </p>
                  </RadioGroupPrimitive.Item>
                  <RadioGroupPrimitive.Item
                    value={'credit'}
                    className={cn(
                      'relative group ring-[1px] ring-border rounded py-2 px-3 text-start',
                      'data-[state=checked]:ring-2 data-[state=checked]:ring-primary',
                      'disabled:opacity-60',
                    )}
                    disabled
                  >
                    <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-primary stroke-white group-data-[state=unchecked]:hidden" />

                    <CreditCard className="mb-2.5 text-muted-foreground" />
                    <span className="font-semibold tracking-tight">
                      Credit Card (Coming Soon)
                    </span>
                    <p className="text-xs">Pay the full amount online.</p>
                  </RadioGroupPrimitive.Item>
                </RadioGroupPrimitive.Root>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>
      <Button type="submit" className="mt-8">
        <LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
          <CheckIcon />
          Checkout
        </LoadingSwap>
      </Button>
    </form>
  )
}
