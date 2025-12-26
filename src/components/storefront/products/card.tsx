import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Image } from '@imagekit/react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
interface ProductCardProps {
  name: string
  description: string
  price: string
  slug: string
  imageUrl: string
  quantity: number
  category: string
  priceAfterDiscount: number
}

const ProductCard = ({
  name,
  imageUrl,
  description,
  price,
  quantity,
  category,
  slug,
  priceAfterDiscount,
}: ProductCardProps) => {
  return (
    <Card className="max-w-xs shadow-none gap-0 pt-0 mt-8">
      <CardHeader className="py-4 px-5 flex flex-col font-semibold">
        <h3>{name}</h3>
        <p className="mt-0 text-primary">
          EGP{' '}
          <span
            className={cn({
              'line-through text-primary-400':
                priceAfterDiscount < Number(price),
            })}
          >
            {price}
          </span>{' '}
          {priceAfterDiscount < Number(price) && priceAfterDiscount}
        </p>
        <Badge variant={'secondary'}>{category}</Badge>
      </CardHeader>

      <CardContent className="mt-1 text-[15px] text-muted-foreground px-5">
        <p>{description}</p>
        <Image
          src={imageUrl}
          className="mt-5 aspect-video rounded-xl object-cover object-center"
          alt={name}
        />
      </CardContent>

      <CardFooter className="mt-6 flex flex-col items-start">
        <p>
          <b>{quantity}</b> left in stock
        </p>
        <Button asChild>
          <Link to={'/products/$slug'} params={{ slug }}>
            {' '}
            Explore <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
