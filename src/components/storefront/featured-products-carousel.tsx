import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Product } from '@/db/types'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
interface FeaturedProductsCarouselProps {
  products: Product[]
}
export default function FeaturedProductsCarousel({
  products,
}: FeaturedProductsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="mx-auto w-full px-12">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {products.map((product, index) => (
            <CarouselItem key={product.id} className="basis-3/5">
              <Card
                className={cn({
                  'opacity-30': index !== current - 1,
                })}
              >
                <CardContent className="flex aspect-video items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
