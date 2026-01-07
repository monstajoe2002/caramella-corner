import CartItems from '@/components/storefront/cart/cart-items'
import { AddressForm } from '@/components/storefront/checkout/address-form'
import { useCartStore } from '@/lib/cart-store'
import { createFileRoute, notFound } from '@tanstack/react-router'
import z from 'zod'
const searchSchema = z.object({
  c: z.string().nonempty(),
})
export const Route = createFileRoute('/_storefront/checkout')({
  // TODO: fix notfound component
  notFoundComponent: () => {
    return <p>Cart not found!</p>
  },
  component: RouteComponent,
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    if (!search.c) {
      throw notFound({ throw: true })
    }
  },
})

function RouteComponent() {
  const cartItems = useCartStore((c) => c.items)
  return (
    <div className="flex flex-col justify-around min-h-[calc(100vh-100px)]">
      <CartItems cartItems={cartItems} />
      <AddressForm />
    </div>
  )
}
