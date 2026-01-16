import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto ">
      <h1 className="text-start">About Us</h1>

      <div className="space-y-8">
        <section>
          <p className="text-justify mt-4">
            <strong>Caramella Corner</strong> is the perfect place for those
            looking for excellence. We provide you with your clothing needs,
            whether imported or locally manufactured, to satisfy all tastes. Do
            not search too much and enjoy with us many options to mix and throw
            together to suit your taste. We pride ourselves with providing
            trend-driven styles at affordable prices. Our mission is to provide
            high-quality products that empower women to feel confident and
            stylish in their own skin. Join our fashion community today and
            discover the latest looks that will take your wardrobe to the next
            level.
          </p>
        </section>

        <section className="bg-muted/50 dark:bg-muted/30 p-6 rounded-lg border border-border text-justify">
          <h2 className="text-2xl font-semibold mb-4">Returns & Exchanges</h2>

          <div className="space-y-4 text-muted-foreground">
            <p>
              If you are not happy with your purchase, you can exchange the
              product for another one within 7 days from the day you receive it.
            </p>

            <p>
              At delivery, the courier won't allow you to open the package, as
              the packages are insured.
            </p>

            <p>
              If you have any problems with the order please contact us and
              we'll send you a new courier to exchange your order{' '}
              <strong>WITH NEW SHIPPING FEES</strong>.
            </p>

            <p>
              Any product you exchange must be in its original packaging,
              unused, and with the label attached and in the same condition you
              received it in.{' '}
              <strong>
                COURIER WILL REQUEST A PHOTO OF ITEM BEFORE RECEIVING THE
                RETURNED ITEM TO BE SENT TO US FOR RETURN APPROVAL.
              </strong>
            </p>

            <p className="font-semibold">NEW FEES WILL BE APPLIED.</p>

            <p className="text-destructive font-semibold">
              PLEASE NOTE: NO EXCHANGE IF ITEM DOESN'T MATCH THE ORIGINAL
              CONDITION
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
