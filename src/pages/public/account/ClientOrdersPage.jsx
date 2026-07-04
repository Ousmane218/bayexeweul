import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "react-router-dom"
import { Clock, CheckCircle2, Truck, XCircle, Package, ArrowRight } from "lucide-react"

export default function ClientOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error("Erreur chargement de l'historique :", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 flex items-center w-fit"><Clock size={14} className="mr-1.5" /> En attente</span>
      case 'confirmed':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center w-fit"><CheckCircle2 size={14} className="mr-1.5" /> Confirmée</span>
      case 'processing':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 flex items-center w-fit"><Package size={14} className="mr-1.5" /> En préparation</span>
      case 'delivered':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center w-fit"><Truck size={14} className="mr-1.5" /> Livrée</span>
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center w-fit"><XCircle size={14} className="mr-1.5" /> Annulée</span>
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 w-fit">{status}</span>
    }
  }

  return (
    <div className="bg-premium-bg min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-navy transition-colors flex items-center">
             Accueil
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link to="/account" className="hover:text-navy transition-colors">
            Mon compte
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-navy">Mes commandes</span>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy mb-2 tracking-tight">Historique de vos commandes</h1>
          <p className="text-gray-500">Retrouvez toutes les commandes associées à votre compte.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white shadow-sm">
            <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-navy mb-2">Vous n'avez pas encore de commandes</h2>
            <p className="text-gray-500 mb-6">Découvrez nos produits et passez votre première commande dès aujourd'hui !</p>
            <Link 
              to="/"
              className="inline-flex bg-navy text-white px-8 py-3 rounded-xl font-medium hover:bg-navy-hover transition-colors shadow-md shadow-navy/20"
            >
              Continuer mes achats
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-white hover:border-gold/30 transition-all overflow-hidden p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-navy text-lg">#{order.id.substring(0, 8).toUpperCase()}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center">
                      Commandée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 md:border-0">
                    <div className="text-right">
                      <span className="block text-xs text-gray-500">Total</span>
                      <span className="font-bold text-navy text-xl">{order.total_amount.toLocaleString()} FCFA</span>
                    </div>
                    
                    <Link 
                      to={`/account/orders/${order.id}`}
                      className="flex items-center text-navy font-semibold hover:text-gold transition-colors bg-gray-50 hover:bg-beige-100 px-4 py-2 rounded-xl"
                    >
                      Détails <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
