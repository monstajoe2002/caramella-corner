import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Image } from '@imagekit/react'
import { ArrowRight } from 'lucide-react'
interface ProductCardProps {
  name: string
  description: string
  price: string
  slug: string
  imageUrl: string
  quantity: number
}

const ProductCard = ({ name, imageUrl, description }: ProductCardProps) => {
  return (
    <Card className="max-w-xs shadow-none gap-0 pt-0 mt-8">
      <CardHeader className="py-4 px-5 flex flex-row items-center gap-3 font-semibold">
        {name}
      </CardHeader>

      <CardContent className="mt-1 text-[15px] text-muted-foreground px-5">
        <p>{description}</p>
        <Image
          src={imageUrl}
          className="mt-5 aspect-video rounded-xl object-cover object-center"
          alt={name}
        />
      </CardContent>

      <CardFooter className="mt-6">
        <Button className="/blocks">
          Explore <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
