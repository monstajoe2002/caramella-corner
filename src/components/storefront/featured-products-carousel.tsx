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
import { Button } from '../ui/button'
import { ArrowRightIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface FeaturedProductsCarouselProps {
  products: Array<Omit<ProductWithVariants, 'category' | 'subcategory'>>
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
                  className={cn(
                    { 'opacity-30': index !== current - 1 },
                    'relative overflow-hidden group transition-opacity duration-500',
                  )}
                >
                  <CardContent className="flex aspect-video items-center justify-center p-0">
                    <Image
                      src={firstImage.ikThumbnailUrl}
                      responsive={true}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                  </CardContent>
                  {/* Backdrop filter */}
                  <div className="absolute inset-0 bg-linear-to-t from-black to-white transition-opacity duration-500 opacity-25 group-hover:opacity-50" />
                  <div className="absolute inset-0 flex flex-col justify-end items-center gap-2 mb-4">
                    <h2 className="text-primary-foreground">{product.name}</h2>
                    <Button size={'lg'} asChild>
                      <Link
                        to="/products/$slug"
                        params={{ slug: product.slug }}
                      >
                        Explore <ArrowRightIcon />
                      </Link>
                    </Button>
                  </div>
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
