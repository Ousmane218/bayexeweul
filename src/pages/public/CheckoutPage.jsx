import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { storeConfig } from "@/config/storeConfig"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Phone, MapPin, FileText, AlertCircle, CheckCircle2 } from "lucide-react"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user, profile } = useAuth()

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    notes: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Rediriger vers panier si vide
  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/cart')
    }
  }, [cartItems, navigate, success])

  // Pré-remplir le nom si connecté
  useEffect(() => {
    if (profile?.full_name && !formData.customer_name) {
      setFormData(prev => ({ ...prev, customer_name: profile.full_name }))
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateWhatsAppMessage = (orderRef) => {
    let message = `Bonjour ${storeConfig.storeName},\n\n`
    message += `Je viens de passer la commande *#${orderRef}*.\n\n`
    message += `*Détails de livraison :*\n`
    message += `- Nom : ${formData.customer_name}\n`
    message += `- Téléphone : ${formData.customer_phone}\n`
    message += `- Adresse : ${formData.delivery_address}\n`
    if (formData.notes) {
      message += `- Note : ${formData.notes}\n`
    }
    message += `\n*Articles commandés :*\n`
    
    cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${(item.price * item.quantity).toLocaleString()} FCFA)\n`
    })

    message += `\n*Total : ${cartTotal.toLocaleString()} FCFA*\n\n`
    message += `Merci de confirmer la prise en charge de ma commande.`

    return encodeURIComponent(message)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!formData.customer_name || !formData.customer_phone || !formData.delivery_address) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setLoading(true)

    try {
      // 0. Vérifier la session au niveau de Supabase pour s'assurer d'avoir l'ID si connecté
      const { data: { user: authUser } } = await supabase.auth.getUser()
      const currentUserId = authUser?.id || user?.id || null

      // 1. Générer l'id complet et une référence courte
      const orderId = crypto.randomUUID()
      const orderRef = orderId.substring(0, 8).toUpperCase()
      
      const orderPayload = {
        id: orderId,
        user_id: currentUserId,
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        delivery_address: formData.delivery_address.trim(),
        notes: formData.notes.trim() || null,
        total_amount: cartTotal,
        status: 'pending',
        whatsapp_sent: false
      }

      // 2. Créer la commande
      const { error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)

      if (orderError) {
        console.error("Order insert error:", orderError)
        throw orderError
      }

      // 3. Créer les lignes de commande
      const orderItemsToInsert = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert)

      if (itemsError) {
        console.error("Order items insert error:", itemsError)
        throw itemsError
      }

      // 4. Succès local
      setSuccess(true)
      
      // 5. Redirection WhatsApp
      const whatsappUrl = `https://wa.me/${storeConfig.whatsappNumber.replace('+', '')}?text=${generateWhatsAppMessage(orderRef)}`
      
      // Nettoyer le panier après un léger délai pour que l'UI affiche le succès sans flasher le composant vide
      setTimeout(() => {
        clearCart()
        window.open(whatsappUrl, '_blank')
      }, 500)

    } catch (err) {
      console.error(err)
      setError("Une erreur est survenue lors de la création de la commande.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-premium-bg min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-premium-border text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-navy mb-4">Commande Validée !</h2>
          <p className="text-gray-500 mb-8">
            Votre commande a été enregistrée avec succès. Une fenêtre WhatsApp va s'ouvrir pour confirmer les détails avec notre équipe.
          </p>
          <Link 
            to="/"
            className="w-full bg-navy text-white h-14 rounded-xl font-medium flex items-center justify-center hover:bg-navy-hover transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-premium-bg min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/cart" className="text-gray-500 hover:text-navy transition-colors flex items-center mb-6 text-sm w-fit font-medium">
          <ArrowLeft size={16} className="mr-2" />
          Retour au panier
        </Link>
        
        <h1 className="text-3xl font-serif font-bold text-navy mb-8">Finaliser la commande</h1>

        {error && (
          <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-xl flex items-center text-sm border border-red-100 shadow-sm">
            <AlertCircle size={18} className="mr-3 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulaire */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-premium-border overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-navy">Informations de livraison</h2>
                <p className="text-sm text-gray-500 mt-1">Où devons-nous expédier votre commande ?</p>
              </div>
              
              <div className="p-6 md:p-8">
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-navy">Nom complet <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                          <User size={20} strokeWidth={1.5} />
                        </div>
                        <input
                          type="text"
                          name="customer_name"
                          required
                          value={formData.customer_name}
                          onChange={handleChange}
                          className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-navy"
                          placeholder="Ex: Amadou Diallo"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-navy">Téléphone / WhatsApp <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                          <Phone size={20} strokeWidth={1.5} />
                        </div>
                        <input
                          type="tel"
                          name="customer_phone"
                          required
                          value={formData.customer_phone}
                          onChange={handleChange}
                          className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-navy"
                          placeholder="Ex: 77 123 45 67"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-navy">Adresse complète <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                          <MapPin size={20} strokeWidth={1.5} />
                        </div>
                        <textarea
                          name="delivery_address"
                          required
                          value={formData.delivery_address}
                          onChange={handleChange}
                          rows={3}
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-navy resize-none"
                          placeholder="Quartier, rue, repères..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-navy">Notes (Optionnel)</label>
                      <div className="relative group">
                        <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                          <FileText size={20} strokeWidth={1.5} />
                        </div>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={2}
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-navy resize-none"
                          placeholder="Instructions particulières de livraison..."
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Résumé Panier */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-premium-border p-6 sticky top-24">
              <h3 className="text-lg font-bold text-navy mb-4 border-b border-gray-100 pb-4">Résumé</h3>
              
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-4">
                      <span className="font-medium text-navy line-clamp-1">{item.name}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-navy shrink-0">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy">Total à payer</span>
                  <span className="font-bold text-gold text-xl">{cartTotal.toLocaleString()} FCFA</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-2 text-right">Paiement à la livraison</p>
              </div>
              
              <Button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="w-full h-14 bg-navy hover:bg-navy-hover text-white rounded-xl text-lg font-medium transition-all shadow-md shadow-navy/20 disabled:opacity-70 disabled:shadow-none"
              >
                {loading ? (
                  <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "Confirmer la commande"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
