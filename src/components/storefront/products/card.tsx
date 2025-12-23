import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

const ProductCard = () => {
  return (
    <Card className="max-w-xs shadow-none gap-0 pt-0 mt-8">
      <CardHeader className="py-4 px-5 flex flex-row items-center gap-3 font-semibold">
        Shadcn UI Blocks
      </CardHeader>

      <CardContent className="mt-1 text-[15px] text-muted-foreground px-5">
        <p>
          Explore a collection of Shadcn UI blocks and components, ready to
          preview and copy.
        </p>
        <div className="mt-5 w-full aspect-video bg-muted rounded-xl" />
      </CardContent>

      <CardFooter className="mt-6">
        <Button className="/blocks">
          Explore Blocks <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
