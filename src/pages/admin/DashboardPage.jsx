import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Clock, CheckCircle2, Truck, XCircle, Package, TrendingUp, AlertTriangle, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Commandes
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Produits
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('is_active, stock')

      if (productsError) throw productsError

      // Calculs
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      let pending = 0
      let todayCount = 0
      let revenue = 0

      orders.forEach(order => {
        if (order.status === 'pending') pending++
        if (new Date(order.created_at) >= todayStart) todayCount++
        if (order.status === 'delivered') revenue += (order.total_amount || 0)
      })

      let active = 0
      let outOfStock = 0
      let lowStock = 0

      products.forEach(p => {
        if (p.is_active) active++
        if (p.stock === 0) outOfStock++
        if (p.stock > 0 && p.stock <= 5) lowStock++
      })

      setStats({
        pendingOrders: pending,
        todayOrders: todayCount,
        totalRevenue: revenue,
        activeProducts: active,
        outOfStockProducts: outOfStock,
        lowStockProducts: lowStock,
      })

      setRecentOrders(orders.slice(0, 5))

    } catch (err) {
      console.error("Erreur chargement dashboard:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700">En attente</span>
      case 'confirmed': return <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">Confirmée</span>
      case 'processing': return <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700">En préparation</span>
      case 'delivered': return <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">Livrée</span>
      case 'cancelled': return <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">Annulée</span>
      default: return <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-navy mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-orange-100 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">Commandes en attente</CardTitle>
            <Clock size={18} className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{stats.pendingOrders}</div>
            <p className="text-xs text-gray-400 mt-1">À traiter rapidement</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">Commandes du jour</CardTitle>
            <Package size={18} className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{stats.todayOrders}</div>
            <p className="text-xs text-gray-400 mt-1">Depuis ce matin</p>
          </CardContent>
        </Card>

        <Card className="border-gold/30 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">Chiffre d'affaires (Net)</CardTitle>
            <TrendingUp size={18} className="text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold">{stats.totalRevenue.toLocaleString()} FCFA</div>
            <p className="text-xs text-gray-400 mt-1">Total hors annulations</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">Produits Actifs</CardTitle>
            <CheckCircle2 size={18} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{stats.activeProducts}</div>
            <p className="text-xs text-gray-400 mt-1">Visibles en boutique</p>
          </CardContent>
        </Card>

        <Card className="border-red-100 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">En rupture de stock</CardTitle>
            <AlertCircle size={18} className="text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</div>
            <p className="text-xs text-red-400 mt-1">Nécessite réapprovisionnement</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">Stock Faible (&le; 5)</CardTitle>
            <AlertTriangle size={18} className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</div>
            <p className="text-xs text-orange-400 mt-1">Bientôt en rupture</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-navy">Dernières commandes</h2>
        <Link to="/admin/orders" className="text-sm text-gold hover:underline font-medium">Voir tout</Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="w-full">
            {/* Version Mobile : Cartes */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Aucune commande récente.</div>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/admin/orders/${order.id}`} className="font-mono font-semibold text-navy text-xs hover:text-gold transition-colors">
                          #{order.id.substring(0,8).toUpperCase()}
                        </Link>
                        <h4 className="font-bold text-gray-800 text-sm mt-0.5">{order.customer_name}</h4>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                      <span className="font-bold text-navy text-sm">{order.total_amount.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Version Desktop : Tableau */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-b border-premium-border">
                  <tr>
                    <th className="px-6 py-3 font-medium">Commande</th>
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Statut</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Aucune commande récente.</td>
                    </tr>
                  ) : (
                    recentOrders.map(order => (
                      <tr key={order.id} className="border-b border-premium-border hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-mono font-medium text-navy text-xs">
                          <Link to={`/admin/orders/${order.id}`} className="hover:text-gold transition-colors">
                            #{order.id.substring(0,8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700">{order.customer_name}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 text-right font-bold text-navy">{order.total_amount.toLocaleString()} FCFA</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
