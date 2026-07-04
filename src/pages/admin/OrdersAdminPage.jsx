import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"
import { Search, Eye, Filter, CheckCircle2, Clock, Truck, XCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Erreur chargement commandes:", error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders()
  }, [])

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700 flex items-center w-fit"><Clock size={12} className="mr-1.5" /> En attente</span>
      case 'confirmed': return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 flex items-center w-fit"><CheckCircle2 size={12} className="mr-1.5" /> Confirmée</span>
      case 'processing': return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700 flex items-center w-fit"><Package size={12} className="mr-1.5" /> En préparation</span>
      case 'delivered': return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 flex items-center w-fit"><Truck size={12} className="mr-1.5" /> Livrée</span>
      case 'cancelled': return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 flex items-center w-fit"><XCircle size={12} className="mr-1.5" /> Annulée</span>
      default: return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 w-fit">{status}</span>
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm) ||
      order.id.slice(0,8).toLowerCase().includes(searchTerm.toLowerCase())
      
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-gray-500 mb-2 font-medium">
        <Link to="/" className="hover:text-navy transition-colors">Accueil</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link to="/admin" className="hover:text-navy transition-colors">Administration</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-navy">Commandes</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Commandes</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les commandes de vos clients</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" className="h-10 border-gray-200">
          Rafraîchir
        </Button>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-premium-border flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Rechercher (Nom, téléphone, réf...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy text-sm"
          />
        </div>
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Filter size={18} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy text-sm appearance-none bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="processing">En préparation</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="w-full">
        {/* Version Mobile : Cartes */}
        <div className="md:hidden space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-premium-border p-4 animate-pulse">
                <div className="h-4 bg-gray-200 w-1/4 rounded mb-2"></div>
                <div className="h-5 bg-gray-200 w-1/2 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
              </div>
            ))
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-premium-border p-8 text-center text-gray-500">
              <Package size={32} className="mx-auto mb-2 text-gray-300" />
              <p>Aucune commande trouvée</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-premium-border p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-semibold text-gray-500">#{order.id.substring(0, 8).toUpperCase()}</span>
                    <h4 className="font-bold text-navy mt-1">{order.customer_name}</h4>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-100 pt-2">
                  <span>{order.customer_phone}</span>
                  <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                
                <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-3">
                  <span className="font-bold text-gold text-lg">{order.total_amount.toLocaleString()} FCFA</span>
                  <Link 
                    to={`/admin/orders/${order.id}`}
                    className="inline-flex items-center justify-center text-navy bg-beige-100 hover:bg-beige-200 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Eye size={16} className="mr-1.5" /> Détails
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Version Desktop : Tableau */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-premium-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Réf.</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 bg-white">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-medium text-navy">Chargement des commandes...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center bg-gray-50/30">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Package size={48} className="mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-navy">Aucune commande trouvée</p>
                        <p className="text-sm">Essayez de modifier vos filtres ou termes de recherche.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-600">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-navy">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {order.customer_phone}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 font-bold text-gold">
                        {order.total_amount.toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center text-navy hover:text-gold font-medium bg-gray-50 hover:bg-beige-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Eye size={16} className="mr-1" /> Détails
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
