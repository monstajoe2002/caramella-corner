import CartItems from '@/features/storefront/cart/components/cart-items'
import { AddressForm } from '@/features/storefront/checkout/components/address-form'
import { getSessionCustomer } from '@/features/storefront/customers/data'
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
  loader: async () => {
    const customer = await getSessionCustomer()
    return {
      name: customer!.name,
      address: customer!.address,
      customerId: customer!.id,
      email: customer!.email,
    }
  },
})

function RouteComponent() {
  const { name, address, customerId, email } = Route.useLoaderData()
  const cartItems = useCartStore((c) => c.items)
  const cartQuantity = useCartStore((c) => c.totalQuantity)
  return (
    <div>
      <h1 className="text-start">Confirm Checkout</h1>
      <div className="flex flex-col justify-around min-h-[calc(100vh-100px)]">
        <CartItems cartItems={cartItems} />
        <AddressForm
          customerData={{ name, address, email, id: customerId }}
          cartItems={cartItems}
          cartQuantity={cartQuantity}
        />
      </div>
    </div>
  )
}
