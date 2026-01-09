import { Separator } from '@/components/ui/separator'
import { getOrderById } from '@/features/storefront/orders/db'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
const searchSchema = z.object({
  o: z.string().nonempty(),
})
export const Route = createFileRoute('/_storefront/order-confirmed')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { o } }) => ({ orderId: o }),
  loader: async ({ deps: { orderId } }) => getOrderById(orderId),
})

function RouteComponent() {
  const order = Route.useLoaderData()
  return (
    <div className="py-10 lg:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-8">
            <div>
              <h1 className="font-heading mb-6 text-4xl text-balance sm:text-5xl lg:text-5xl text-start">
                Thank you for your purchase!
              </h1>
              <p className="text-muted-foreground text-base text-balance">
                Your order will be processed within 24 hours during working
                days. We will notify you by email once your order has been
                shipped.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-bold">Billing address</h2>

              <Separator />

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold">Order Number</dt>
                  <dd className="col-span-2"># {order?.orderNumber}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold">Name</dt>
                  <dd className="col-span-2">{order?.customer?.name}</dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold">Address</dt>
                  <dd>{order?.customer?.address}</dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold">Email</dt>
                  <dd>{order?.customer?.email}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
