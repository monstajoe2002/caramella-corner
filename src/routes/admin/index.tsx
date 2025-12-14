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

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ['dashboard', 'totalRevenue'],
    queryFn: () => getTotalRevenue(),
  })

  const { data: newCustomers = 0 } = useQuery({
    queryKey: ['dashboard', 'newCustomers'],
    queryFn: () => getNewCustomers(),
  })

  const { data: totalOrders = 0 } = useQuery({
    queryKey: ['dashboard', 'totalOrders'],
    queryFn: () => getTotalOrders(),
  })

  const { data: activeProducts = 0 } = useQuery({
    queryKey: ['dashboard', 'activeProducts'],
    queryFn: () => getActiveProducts(),
  })

  const formatCurrency = (amount: number) => {
    // Assuming amounts are stored in piasters (1 EGP = 100 piasters)
    const egpAmount = amount / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(egpAmount)
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <CardDescription className="text-xs">
              From completed payments
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCustomers}</div>
            <CardDescription className="text-xs">
              In the last 30 days
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <CardDescription className="text-xs">
              All time orders
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <CardDescription className="text-xs">
              Currently available products
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
