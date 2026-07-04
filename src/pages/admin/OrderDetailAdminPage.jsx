import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, User, Phone, MapPin, FileText, CheckCircle2, Clock, Truck, XCircle, Package, AlertCircle } from "lucide-react"

export default function OrderDetailAdminPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
      
      // Récupérer les articles
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id)
        
      if (itemsError) throw itemsError

      setOrder(orderData)
      setOrderItems(itemsData || [])
    } catch (err) {
      console.error(err)
      setError("Impossible de charger les détails de la commande.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrderDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleStatusChange = async (newStatus) => {
    try {
      if (order.status === 'delivered') {
        throw new Error("Commande livrée verrouillée.")
      }

      setSavingStatus(true)
      setError("")
      setSuccess("")

      if (newStatus === 'delivered' && !order.stock_decremented) {
        // Décrémentation du stock requise
        
        // 1. Récupérer l'état actuel du stock
        const productIds = orderItems.map(item => item.product_id)
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, stock, name')
          .in('id', productIds)

        if (productsError) throw productsError

        // 2. Vérifier si le stock est suffisant
        for (const item of orderItems) {
          const product = productsData.find(p => p.id === item.product_id)
          if (!product || product.stock < item.quantity) {
             throw new Error(`Stock insuffisant pour le produit "${product?.name || item.product_name}". Stock actuel : ${product?.stock || 0}, Requis : ${item.quantity}.`)
          }
        }

        // 3. Décrémenter le stock
        for (const item of orderItems) {
          const product = productsData.find(p => p.id === item.product_id)
          const newStock = Math.max(0, product.stock - item.quantity) // Sécurité supplémentaire
          
          const { error: updateStockError } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.product_id)

          if (updateStockError) throw updateStockError
        }

        // 4. Mettre à jour la commande
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: newStatus,
            stock_decremented: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          
        if (updateError) throw updateError
        
        setOrder(prev => ({ ...prev, status: newStatus, stock_decremented: true }))
        setSuccess("Statut mis à jour et stock décrémenté avec succès.")
      } else {
        // Changement de statut normal
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          
        if (updateError) throw updateError
        
        setOrder(prev => ({ ...prev, status: newStatus }))
        setSuccess("Statut mis à jour avec succès.")
      }
    } catch (err) {
      console.error(err)
      setError(err.message || "Erreur lors de la mise à jour du statut")
    } finally {
      setSavingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-xl flex items-center justify-center">
        <AlertCircle className="mr-3" />
        <p className="font-medium">{error || "Commande introuvable."}</p>
      </div>
    )
  }



  const getStatusColorClass = (status) => {
    switch(status) {
      case 'pending': return "bg-orange-50 text-orange-700 border-orange-200"
      case 'confirmed': return "bg-blue-50 text-blue-700 border-blue-200"
      case 'processing': return "bg-purple-50 text-purple-700 border-purple-200"
      case 'delivered': return "bg-green-50 text-green-700 border-green-200"
      case 'cancelled': return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const renderTimeline = () => {
    if (order.status === 'cancelled') {
      return (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center">
          <XCircle className="text-red-500 mr-4" size={32} />
          <div>
            <h3 className="text-red-700 font-bold text-lg">Commande annulée</h3>
            <p className="text-red-600 text-sm">Le client a annulé cette commande, ou elle a été annulée manuellement par l'administration.</p>
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
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center text-sm text-gray-500 font-medium mb-2">
        <Link to="/" className="hover:text-navy transition-colors">Accueil</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link to="/admin" className="hover:text-navy transition-colors">Administration</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link to="/admin/orders" className="hover:text-navy transition-colors">Commandes</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-navy truncate max-w-[200px]">#{order.id.substring(0, 8).toUpperCase()}</span>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/admin/orders" className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-navy hover:border-navy transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy flex items-center">
              Commande <span className="font-mono text-lg ml-2 text-gray-500">#{order.id.substring(0, 8).toUpperCase()}</span>
            </h1>
            <p className="text-sm text-gray-500">
              Passée le {new Date(order.created_at).toLocaleString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        {/* Gestion du statut */}
        {order.status === 'delivered' ? (
          <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-xl border border-green-200 text-sm font-bold flex items-center shadow-sm">
            <CheckCircle2 size={18} className="mr-2" /> Commande livrée (Verrouillée)
          </div>
        ) : (
          <div className="flex items-center space-x-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 pl-2">Statut :</div>
            <select 
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={savingStatus}
              className={`h-10 pl-3 pr-8 rounded-lg font-bold text-sm border focus:outline-none appearance-none cursor-pointer transition-colors ${getStatusColorClass(order.status)}`}
            >
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="processing">En préparation</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        )}
        
        {/* Messages de succès / erreur */}
        {(success || error) && (
          <div className="w-full mt-4">
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center text-sm border border-green-100 animate-in fade-in">
                <CheckCircle2 size={16} className="mr-2 shrink-0" />
                <p className="font-medium">{success}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm border border-red-100 animate-in fade-in">
                <AlertCircle size={16} className="mr-2 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Avertissement de stock non décrémenté */}
        {order.status === 'delivered' && !order.stock_decremented && (
          <div className="w-full mt-4 bg-orange-50 text-orange-800 p-4 rounded-xl flex items-start text-sm border border-orange-200 shadow-sm animate-in fade-in">
            <AlertCircle size={20} className="mr-3 shrink-0 text-orange-500" />
            <div>
              <p className="font-bold">Attention : Le stock n'a pas été décrémenté !</p>
              <p className="mt-1">Cette commande est marquée comme livrée mais les quantités n'ont pas été déduites de l'inventaire. Cela peut arriver si vous avez manuellement changé le statut sans passer par cette interface, ou suite à une erreur technique.</p>
            </div>
          </div>
        )}
      </div>

      {renderTimeline()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Principale: Articles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-premium-border overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center">
              <Package className="text-gray-400 mr-2" size={20} />
              <h2 className="text-lg font-bold text-navy">Articles de la commande</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Produit</th>
                    <th className="px-6 py-3 text-center">Prix Unitaire</th>
                    <th className="px-6 py-3 text-center">Quantité</th>
                    <th className="px-6 py-3 text-right">Sous-total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orderItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/30">
                      <td className="px-6 py-4 font-medium text-navy">{item.product_name}</td>
                      <td className="px-6 py-4 text-center text-gray-500">{item.product_price.toLocaleString()} FCFA</td>
                      <td className="px-6 py-4 text-center font-bold text-navy">x{item.quantity}</td>
                      <td className="px-6 py-4 text-right font-bold text-navy">{item.subtotal.toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50/50 border-t border-gray-100">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-medium text-gray-600">Total :</td>
                    <td className="px-6 py-4 text-right font-bold text-gold text-lg">{order.total_amount.toLocaleString()} FCFA</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Colonne Latérale: Client */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-premium-border p-6">
            <h2 className="text-lg font-bold text-navy mb-6 flex items-center">
              <User className="text-gray-400 mr-2" size={20} />
              Informations client
            </h2>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nom Complet</span>
                <span className="text-sm font-bold text-navy">{order.customer_name}</span>
              </div>
              
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center">
                  <Phone size={14} className="mr-1" /> Téléphone / WhatsApp
                </span>
                <a href={`https://wa.me/${order.customer_phone.replace('+', '').replace(/\s/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-green-600 hover:underline">
                  {order.customer_phone}
                </a>
              </div>
              
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center">
                  <MapPin size={14} className="mr-1" /> Adresse de livraison
                </span>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {order.delivery_address}
                </p>
              </div>

              {order.notes && (
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center">
                    <FileText size={14} className="mr-1" /> Notes du client
                  </span>
                  <p className="text-sm text-orange-800 bg-orange-50 p-3 rounded-lg border border-orange-100 italic">
                    "{order.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Etat du stock */}
          <div className="bg-white rounded-2xl shadow-sm border border-premium-border p-6">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center">
              <Package className="text-gray-400 mr-2" size={20} />
              État du stock
            </h2>
            <div className="flex items-start space-x-3">
              {order.stock_decremented ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Stock décrémenté</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Les quantités de cette commande ont été déduites de votre inventaire.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                    <Package size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Stock intact</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Le stock sera automatiquement déduit lorsque la commande passera au statut <strong>Livrée</strong>.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
