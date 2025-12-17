import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  getTotalRevenue,
  getNewCustomers,
  getTotalOrders,
  getActiveProducts,
} from '@/features/admin/dashboard/data'
import { DollarSign, Users, ShoppingCart, Package } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function LoadingCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-full rounded-md" />
        <CardDescription className="text-xs">
          <Skeleton className="h-3 w-24 rounded-md mt-2" />
        </CardDescription>
      </CardContent>
    </Card>
  )
}

function RouteComponent() {
  const { data: totalRevenue = 0, isLoading: isRevenueLoading } = useQuery({
    queryKey: ['dashboard', 'totalRevenue'],
    queryFn: () => getTotalRevenue(),
  })

  const { data: newCustomers = 0, isLoading: isCustomersLoading } = useQuery({
    queryKey: ['dashboard', 'newCustomers'],
    queryFn: () => getNewCustomers(),
  })

  const { data: totalOrders = 0, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['dashboard', 'totalOrders'],
    queryFn: () => getTotalOrders(),
  })

  const { data: activeProducts = 0, isLoading: isProductsLoading } = useQuery({
    queryKey: ['dashboard', 'activeProducts'],
    queryFn: () => getActiveProducts(),
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount)
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground mt-4">
          Overview of your store's performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isRevenueLoading ? (
          <LoadingCard title="Total Revenue" />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
              <CardDescription className="text-xs">
                From completed payments
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {isCustomersLoading ? (
          <LoadingCard title="New Customers" />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newCustomers}</div>
              <CardDescription className="text-xs">
                In the last 30 days
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {isOrdersLoading ? (
          <LoadingCard title="Total Orders" />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <CardDescription className="text-xs">
                All time orders
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {isProductsLoading ? (
          <LoadingCard title="Active Products" />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProducts}</div>
              <CardDescription className="text-xs">
                Currently available products
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
