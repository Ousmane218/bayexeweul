import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, ImageOff, Heart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { useToast } from "@/context/ToastContext"
import { useAuth } from "@/hooks/useAuth"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { addToast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock <= 0) {
      addToast("Produit en rupture de stock", "error")
      return
    }
    addToCart(product)
  }

  return (
    <Link to={`/products/${product.slug}`} className="block h-full">
      <Card className={`border-premium-border rounded-lg overflow-hidden group transition-all h-full flex flex-col ${product.stock <= 0 ? 'opacity-90' : 'hover:shadow-md'}`}>
        <CardContent className="p-0 flex flex-col h-full">
          <div className="aspect-square bg-gray-50 flex items-center justify-center text-gray-400 relative overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-500 ${product.stock > 0 ? 'group-hover:scale-105' : 'grayscale-[50%]'}`}
              />
            ) : (
              <div className="flex flex-col items-center">
                <ImageOff size={32} className="mb-2 opacity-50" />
                <span className="text-xs font-medium">Image non dispo</span>
              </div>
            )}
            
            {product.categories?.name && (
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded text-navy z-10 shadow-sm">
                {product.categories.name}
              </div>
            )}
            
            {product.is_featured && (
              <div className="absolute top-2 left-2 mt-8 bg-gold text-white text-[10px] font-bold px-2 py-1 rounded z-10 shadow-sm">
                En vedette
              </div>
            )}

            {product.stock <= 0 && (
              <div className="absolute bottom-0 left-0 w-full bg-red-600/90 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wide z-10 backdrop-blur-sm">
                Rupture de stock
              </div>
            )}
            
            {/* Bouton Wishlist */}
            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!user) {
                  navigate('/login')
                  return
                }
                toggleWishlist(product.id)
              }}
              className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all shadow-sm z-20 hover:scale-110 active:scale-95 ${isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"} />
            </button>
          </div>
          <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-navy transition-colors">
                {product.name}
              </h3>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2">
              <p className="font-bold text-navy">{product.price.toLocaleString()} FCFA</p>
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                  product.stock > 0 
                    ? "bg-beige-100 text-navy hover:bg-gold hover:text-white" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                title={product.stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
              >
                <ShoppingCart size={14} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
