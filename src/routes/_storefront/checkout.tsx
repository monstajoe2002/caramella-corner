import CartItems from '@/features/storefront/cart/components/cart-items'
import { AddressForm } from '@/features/storefront/checkout/components/address-form'
import {
  getCurrentSession,
  getSessionCustomer,
} from '@/features/storefront/customers/data'
import { storefrontAuthMiddleware } from '@/features/storefront/middleware'
import { useCartStore } from '@/lib/cart-store'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import z from 'zod'
const searchSchema = z.object({
  c: z.string().nonempty(),
})
export const Route = createFileRoute('/_storefront/checkout')({
  component: RouteComponent,
  server: {
    middleware: [storefrontAuthMiddleware],
  },
  validateSearch: searchSchema,
  beforeLoad: async ({ search, location }) => {
    const session = await getCurrentSession()
    if (!search.c) {
      throw notFound({ throw: true })
    }
    if (!session) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  loader: async () => {
    const customer = await getSessionCustomer()
    return customer?.address || ''
  },
})

function RouteComponent() {
  const address = Route.useLoaderData()
  const cartItems = useCartStore((c) => c.items)
  const cartQuantity = useCartStore((c) => c.totalQuantity)
  return (
    <div>
      <h1 className="text-start">Confirm Checkout</h1>
      <div className="flex flex-col justify-around min-h-[calc(100vh-100px)]">
        <CartItems cartItems={cartItems} />
        <AddressForm
          customerData={{ address }}
          cartItems={cartItems}
          cartQuantity={cartQuantity}
        />
      </div>
    </div>
  )
}
