import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-start">Order Details</h1>
      <p className="text-start text-muted-foreground">
        View the details of the order with the ID: {Route.useParams().id}
      </p>
    </div>
  )
}
