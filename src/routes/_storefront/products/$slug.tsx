import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { getProductBySlug } from '@/features/admin/products/data'
import { Image } from '@imagekit/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/products/$slug')({
  component: RouteComponent,
  loader: ({ params: { slug } }) => getProductBySlug({ data: { slug } }),
})

function RouteComponent() {
  const product = Route.useLoaderData()
  return (
    <div>
      <div className="md:grid md:grid-cols-2 flex flex-col p-4">
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {product.images.map((img) => (
              <CarouselItem key={img.id}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square">
                      <Image src={img.ikUrl} className="w-full object-cover" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {product.images.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
        <div className="mt-8 md:mt-0">
          <h1 className="text-start">{product.name}</h1>
        </div>
      </div>
    </div>
  )
}
