import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { getProductBySlug } from '@/features/storefront/products/data'
import { Image } from '@imagekit/react'
import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { BadgePercentIcon, ShoppingCartIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/cart-store'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { formatVariant, seo } from '@/lib/utils'

export const Route = createFileRoute('/_storefront/products/$slug')({
  component: RouteComponent,
  loader: ({ params: { slug } }) => getProductBySlug({ data: { slug } }),
  head: ({ loaderData: product, params: { slug } }) => {
    const keywords = [
      product?.name,
      product?.category?.name,
      product?.subcategory?.name,
      product?.material,
      'Caramella Corner',
      'online store',
      'shopping',
    ]
      .filter(Boolean)
      .join(', ')

    const description = product?.description
      ? `${product.description} - Available at Caramella Corner for EGP ${product.priceAfterDiscount}.`
      : `Shop ${product?.name} at Caramella Corner. ${product?.category?.name ? `Category: ${product?.category.name}.` : ''} Price: EGP ${product?.priceAfterDiscount}.`

    const image = product?.images?.[0]?.ikUrl
    const domain = import.meta.env.VITE_PUBLIC_APP_URL
    return {
      meta: seo({
        title: `${product?.name} | Caramella Corner`,
        description,
        keywords,
        image,
        url: `${domain}/products/${slug}`,
      }),
    }
  },
})

function RouteComponent() {
  const product = Route.useLoaderData()
  const addToCart = useCartStore((c) => c.addToCart)
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    undefined,
  )
  const [quantity, setQuantity] = useState<number>(1)

  useEffect(() => {
    if (product.variants.length > 0) {
      setSelectedVariant(product.variants[0].sku)
    }
  }, [product.variants])

  return (
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
      <div className="mt-8 md:mt-0 space-y-2 flex flex-col">
        <h1 className="text-start">{product.name}</h1>
        <p className="uppercase text-secondary-foreground">
          {product.category?.name}
        </p>
        <Badge>{product.subcategory?.name}</Badge>
        <h2 className="text-primary">EGP {product.priceAfterDiscount}</h2>
        {product.discount > 0 && (
          <h3 className="line-through text-muted-foreground">
            EGP {product.price}
          </h3>
        )}
        {product.discount > 0 && (
          <div className="flex gap-1">
            <BadgePercentIcon />
            <span className="sr-only">Discount badge</span>
            <p className="font-semibold mt-0 text-secondary-foreground">
              {product.discount * 100}% off
            </p>
          </div>
        )}
        <p>{product.description}</p>
        <b>Material: </b>
        <span className="text-muted-foreground">{product.material}</span>

        {/* variant select */}
        <Select
          value={selectedVariant}
          onValueChange={(value) => setSelectedVariant(value)}
        >
          <SelectTrigger className="w-[300px] mt-4">
            <SelectValue placeholder="Select a variant..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Variants</SelectLabel>
              {product.variants.map((variant) => {
                const { color, size } = variant
                return (
                  <SelectItem key={variant.id} value={variant.sku}>
                    {formatVariant(color ?? '', size ?? '')}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* quantity input */}
        <div>
          <Label className="mt-4 mb-2" htmlFor="quantity">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            min={1}
            max={product.quantity!}
            className="w-full max-w-xs space-y-2"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <Button
          onClick={() => {
            const variantDetails = product.variants.find(
              (v) => v.sku === selectedVariant,
            )

            if (!variantDetails) {
              toast.error('Selected variant not found')
              return
            }

            addToCart({
              ...product,
              variant: variantDetails,
              quantity,
              price:
                product.discount > 0
                  ? product.priceAfterDiscount
                  : Number(product.price),
              image: product.images[0],
            })
          }}
          className="mt-4"
        >
          <ShoppingCartIcon />
          Add To Cart
        </Button>
      </div>
    </div>
  )
}
