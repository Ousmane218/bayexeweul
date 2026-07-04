import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { storeConfig } from "@/config/storeConfig"
import { ArrowLeft, Clock, CheckCircle2, Truck, XCircle, Package, MapPin, Phone, MessageCircle, AlertCircle } from "lucide-react"

export default function ClientOrderDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && id) {
      fetchOrderDetails()
    }
  }, [user, id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      
      // Récupérer la commande
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
        
      if (orderError) throw orderError
      
      // Sécurité : Vérifier que la commande appartient bien à l'utilisateur connecté
      if (orderData.user_id !== user.id) {
        throw new Error("unauthorized")
      }
      
      // Récupérer les articles
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products ( image_url )
        `)
        .eq('order_id', id)
        
      if (itemsError) throw itemsError

      setOrder(orderData)
      setOrderItems(itemsData || [])
    } catch (err) {
      console.error(err)
      if (err.message === "unauthorized") {
        setError("Commande introuvable ou vous n'avez pas l'autorisation de la consulter.")
      } else {
        setError("Impossible de charger les détails de la commande.")
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 flex items-center w-fit"><Clock size={14} className="mr-1.5" /> En attente</span>
      case 'confirmed': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center w-fit"><CheckCircle2 size={14} className="mr-1.5" /> Confirmée</span>
      case 'processing': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 flex items-center w-fit"><Package size={14} className="mr-1.5" /> En préparation</span>
      case 'delivered': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center w-fit"><Truck size={14} className="mr-1.5" /> Livrée</span>
      case 'cancelled': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center w-fit"><XCircle size={14} className="mr-1.5" /> Annulée</span>
      default: return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 w-fit">{status}</span>
    }
  }

  const renderTimeline = () => {
    if (order.status === 'cancelled') {
      return (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center mb-8">
          <XCircle className="text-red-500 mr-4" size={32} />
          <div>
            <h3 className="text-red-700 font-bold text-lg">Commande annulée</h3>
            <p className="text-red-600 text-sm">Cette commande a été annulée. Contactez le support si vous pensez qu'il s'agit d'une erreur.</p>
          </div>
        </div>
      )
    }

    const steps = [
      { id: 'pending', label: 'Commande reçue', icon: <Clock size={20} /> },
      { id: 'confirmed', label: 'Confirmée', icon: <CheckCircle2 size={20} /> },
      { id: 'processing', label: 'En préparation', icon: <Package size={20} /> },
      { id: 'delivered', label: 'Livrée', icon: <Truck size={20} /> },
    ]

    const currentIndex = steps.findIndex(s => s.id === order.status)
    const activeIndex = currentIndex === -1 ? 0 : currentIndex

    return (
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-6 relative overflow-hidden">
        <h3 className="text-lg font-bold text-navy mb-8">Suivi de commande</h3>
        
        <div className="relative">
          {/* Barre de progression d'arrière-plan */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full hidden sm:block"></div>
          
          {/* Barre de progression active */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gold -translate-y-1/2 rounded-full hidden sm:block transition-all duration-500"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          ></div>

          <div className="flex flex-col sm:flex-row justify-between relative z-10 space-y-6 sm:space-y-0">
            {steps.map((step, index) => {
              const isCompleted = index <= activeIndex
              const isCurrent = index === activeIndex
              
              return (
                <div key={step.id} className="flex sm:flex-col items-center sm:text-center group relative">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 transition-colors duration-300 z-10
                      ${isCompleted ? 'bg-gold text-white' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {step.icon}
                  </div>
                  <div className="ml-4 sm:ml-0 sm:mt-4">
                    <p className={`text-sm font-bold ${isCurrent ? 'text-navy' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const handleWhatsAppContact = () => {
    const orderRef = order.id.substring(0, 8).toUpperCase()
    const message = encodeURIComponent(`Bonjour, je vous contacte au sujet de ma commande #${orderRef}.`)
    const whatsappUrl = `https://wa.me/${storeConfig.whatsappNumber.replace('+', '')}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="bg-premium-bg min-h-[85vh] flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-premium-bg min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/account/orders" className="text-gray-500 hover:text-navy transition-colors inline-flex items-center mb-8 font-medium">
            <ArrowLeft size={16} className="mr-2" /> Retour à mes commandes
          </Link>
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 flex flex-col items-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-navy mb-2">Oups !</h2>
            <p className="text-gray-600 font-medium">{error || "Commande introuvable."}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-premium-bg min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link to="/account/orders" className="text-gray-500 hover:text-navy transition-colors flex items-center mb-6 text-sm w-fit font-medium">
          <ArrowLeft size={16} className="mr-2" />
          Retour à mes commandes
        </Link>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy mb-1 flex items-center">
              Commande <span className="font-mono ml-2 text-gold">#{order.id.substring(0, 8).toUpperCase()}</span>
            </h1>
            <p className="text-sm text-gray-500">
              Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            {getStatusBadge(order.status)}
          </div>
        </div>
        
        {renderTimeline()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-sm border border-white overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center">
                <Package className="text-navy mr-2" size={20} />
                <h2 className="text-lg font-bold text-navy">Articles commandés</h2>
              </div>
              <ul className="divide-y divide-gray-50">
                {orderItems.map(item => (
                  <li key={item.id} className="p-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                      {item.products?.image_url ? (
                        <img src={item.products.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="text-gray-300" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-navy line-clamp-1">{item.product_name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.product_price.toLocaleString()} FCFA <span className="font-bold text-navy ml-2">x{item.quantity}</span></p>
                    </div>
                    <div className="font-bold text-navy shrink-0">
                      {item.subtotal.toLocaleString()} FCFA
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex justify-between items-center">
                <span className="font-medium text-gray-500">Total de la commande</span>
                <span className="text-2xl font-bold text-gold">{order.total_amount.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-sm border border-white p-6">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
                <MapPin className="text-gray-400 mr-2" size={18} />
                Livraison
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-gray-500 mb-1">Livré à</span>
                  <span className="font-bold text-navy">{order.customer_name}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Adresse</span>
                  <span className="font-medium text-gray-700">{order.delivery_address}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Contact</span>
                  <span className="font-medium text-gray-700">{order.customer_phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-sm border border-white p-6">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
                <Phone className="text-gray-400 mr-2" size={18} />
                Besoin d'aide ?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Vous avez une question sur cette commande ? Contactez notre service client.
              </p>
              <button 
                onClick={handleWhatsAppContact}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-xl font-medium flex items-center justify-center transition-colors shadow-md shadow-green-500/20"
              >
                <MessageCircle size={18} className="mr-2" />
                Contacter sur WhatsApp
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
