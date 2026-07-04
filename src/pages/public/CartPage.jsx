import { Link, useNavigate } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const navigate = useNavigate()

  const handleCheckoutRedirect = () => {
    if (cartItems.length === 0) return
    navigate('/checkout')
  }

  return (
    <div className="bg-premium-bg min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
             <Link to="/" className="text-gray-500 hover:text-navy transition-colors flex items-center mb-4 text-sm w-fit">
               <ArrowLeft size={16} className="mr-2" />
               Continuer mes achats
             </Link>
             <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy">Votre Panier</h1>
          </div>
          {cartItems.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center transition-colors mt-4 sm:mt-0"
            >
              <Trash2 size={16} className="mr-2" />
              Vider le panier
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-premium-border p-12 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-4">Votre panier est vide</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Vous n'avez ajouté aucun article à votre panier pour le moment. Découvrez nos produits et laissez-vous tenter !
            </p>
            <Link 
              to="/"
              className="bg-navy text-white px-8 py-3 rounded-lg font-medium hover:bg-navy-hover transition-colors flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              Voir les produits
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Liste des articles */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm border border-premium-border overflow-hidden">
                <ul className="divide-y divide-premium-border">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 group hover:bg-gray-50/50 transition-colors">
                      <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center relative">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="text-gray-300" size={32} />
                        )}
                        {item.stock <= 10 && (
                          <div className="absolute bottom-0 left-0 w-full bg-orange-100 text-orange-700 text-[10px] font-bold text-center py-0.5">
                            Il en reste {item.stock}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link to={`/products/${item.slug}`} className="font-bold text-navy text-lg hover:text-gold transition-colors line-clamp-2 pr-4">
                              {item.name}
                            </Link>
                            {item.categories && (
                               <span className="text-xs text-gray-500 uppercase tracking-wider">{item.categories.name}</span>
                            )}
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full hover:bg-red-50"
                            title="Supprimer"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="text-gold font-bold mb-4 text-lg">
                          {item.price.toLocaleString()} FCFA
                        </div>
                        
                        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 mt-auto">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center text-navy hover:bg-gray-50 transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-medium text-navy">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-navy hover:bg-gray-50 transition-colors disabled:opacity-50"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="font-bold text-navy text-right flex-1 sm:flex-none">
                            <span className="text-xs text-gray-500 font-normal block mb-1">Sous-total</span>
                            <span className="text-lg">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Résumé de la commande */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm border border-premium-border p-6 sticky top-6">
                <h2 className="text-xl font-bold text-navy mb-6 border-b border-gray-100 pb-4">Résumé de la commande</h2>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</span>
                    <span className="font-medium text-navy">{cartTotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frais de livraison</span>
                    <span className="text-green-600 font-medium">Calculé sur WhatsApp</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-navy text-lg">Total estimé</span>
                    <span className="font-bold text-gold text-2xl">{cartTotal.toLocaleString()} FCFA</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-right">Hors frais de livraison éventuels</p>
                </div>
                
                <button 
                  onClick={handleCheckoutRedirect}
                  className="w-full bg-navy text-white h-14 rounded-xl font-bold text-lg hover:bg-navy-hover transition-colors flex items-center justify-center shadow-md shadow-navy/20"
                >
                  Valider la commande
                </button>
                
                <div className="mt-4 p-4 bg-beige-100 rounded-lg text-xs text-navy/80 text-center leading-relaxed">
                  Vous serez redirigé vers une page sécurisée pour renseigner vos informations de livraison.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
