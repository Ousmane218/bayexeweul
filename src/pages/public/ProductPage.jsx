import { useParams, Link } from "react-router-dom"
import { useProduct } from "@/hooks/useProduct"
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { storeConfig } from "@/config/storeConfig"

export default function ProductPage() {
  const { id: slugOrId } = useParams() 
  const { product, loading, error } = useProduct(slugOrId)
  const { addToCart } = useCart()

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2 aspect-square bg-gray-100 rounded-2xl animate-pulse"></div>
            <div className="w-full md:w-1/2 space-y-6">
              <div className="h-4 bg-gray-200 w-32 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 w-3/4 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-200 w-40 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-100 w-full rounded animate-pulse"></div>
              <div className="h-14 bg-gray-200 w-full rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-premium-bg min-h-screen py-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-navy mb-4">Produit introuvable</h1>
        <p className="text-gray-500 mb-8">Ce produit n'existe pas ou a été retiré du catalogue.</p>
        <Link to="/" className="text-gold hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleWhatsAppOrder = () => {
    if (product.stock <= 0) return
    const text = `Bonjour, je suis intéressé par ce produit : ${product.name} - Prix : ${product.price} FCFA. Lien : ${window.location.href}`
    const message = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/${storeConfig.whatsappNumber.replace('+', '')}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Fil d'ariane */}
      <div className="bg-premium-bg border-b border-premium-border py-4">
        <div className="container mx-auto px-4 flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-navy transition-colors">Accueil</Link>
          <span className="mx-2">/</span>
          {product.categories ? (
            <>
              <Link to={`/category/${product.categories.slug}`} className="hover:text-navy transition-colors">
                {product.categories.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          ) : (
             <>
               <span>Sans catégorie</span>
               <span className="mx-2">/</span>
             </>
          )}
          <span className="text-navy font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Gauche: Image */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-50 rounded-2xl aspect-square flex items-center justify-center overflow-hidden border border-premium-border relative">
              {product.is_featured && (
                <div className="absolute top-4 left-4 bg-gold text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm z-10">
                  Produit mis en avant
                </div>
              )}
              
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageOff size={64} className="mb-4 opacity-50" />
                  <span className="font-medium">Aucune image disponible</span>
                </div>
              )}
            </div>
          </div>

          {/* Droite: Infos */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            {product.categories && (
              <Link to={`/category/${product.categories.slug}`} className="text-gold font-medium uppercase tracking-wider text-sm mb-3 hover:underline w-fit">
                {product.categories.name}
              </Link>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-6">
              <div className="flex text-gold">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <span className="text-sm text-gray-500 ml-2">(Nouveau)</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="text-3xl font-bold text-navy">
                {product.price.toLocaleString()} FCFA
              </div>
              {product.stock > 0 ? (
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  En stock
                </div>
              ) : (
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Rupture de stock
                </div>
              )}
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
              <p>{product.description || "Aucune description fournie pour ce produit."}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-sm">
                <div className="w-10 h-10 rounded-full bg-beige-100 flex items-center justify-center text-navy mr-4">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-navy">Livraison disponible</p>
                  <p className="text-gray-500">Partout au Sénégal et à l'international</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-10 h-10 rounded-full bg-beige-100 flex items-center justify-center text-navy mr-4">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-navy">Paiement sécurisé</p>
                  <p className="text-gray-500">Transaction protégée à 100%</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-premium-border">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-navy hover:bg-navy-hover text-white h-14 text-base font-semibold rounded-xl disabled:opacity-50"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Ajouter au panier
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={handleWhatsAppOrder}
                  disabled={product.stock <= 0}
                  className="sm:w-1/3 h-14 text-base font-semibold rounded-xl border-navy text-navy hover:bg-beige-100 disabled:opacity-50"
                >
                  Commander via WhatsApp
                </Button>
              </div>
            </div>
            
            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-orange-500 text-sm mt-4 font-medium flex items-center">
                <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                Attention, plus que {product.stock} article{product.stock > 1 ? 's' : ''} en stock !
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
