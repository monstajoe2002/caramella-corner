import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ProductWithVariants } from '@/db/types'
import { cn } from '@/lib/utils'
import { Image } from '@imagekit/react'
import { useState, useEffect } from 'react'
interface FeaturedProductsCarouselProps {
  products: ProductWithVariants[]
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
          {products.map((product, index) => {
            const [firstImage] = product.images
            return (
              <CarouselItem key={product.id} className="basis-3/5">
                <Card
                  className={cn({
                    'opacity-30': index !== current - 1,
                  })}
                >
                  <CardContent className="flex aspect-video items-center justify-center p-6">
                    <Image src={firstImage.ikThumbnailUrl} />
                  </CardContent>
                </Card>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
