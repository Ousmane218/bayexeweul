import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react"
import { useWishlist } from "@/context/WishlistContext"
import { useCart } from "@/context/CartContext"

export default function ClientWishlistPage() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (loading) {
    return (
      <div className="bg-premium-bg min-h-[70vh] py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-premium-bg min-h-[70vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link to="/account" className="text-gray-500 hover:text-navy mr-4 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-navy">Mes favoris</h1>
            <p className="text-gray-500 mt-1">Retrouvez les produits que vous avez mis de côté</p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-premium-border text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-red-50 text-red-300 rounded-full flex items-center justify-center mb-6">
              <Heart size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-4">Votre liste de souhaits est vide</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Vous n'avez pas encore ajouté de produits à vos favoris. Parcourez notre catalogue pour trouver votre bonheur !</p>
            <Link to="/" className="bg-navy text-white px-8 py-3 rounded-xl font-medium hover:bg-navy-hover transition-colors">
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map(item => {
              const product = item.products
              if (!product) return null

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-premium-border overflow-hidden group">
                  <div className="aspect-square bg-gray-50 relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${product.stock > 0 ? 'group-hover:scale-105' : 'grayscale-[50%]'}`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <Heart size={32} className="opacity-20 mb-2" />
                        <span className="text-xs">Pas d'image</span>
                      </div>
                    )}
                    
                    {product.stock <= 0 && (
                      <div className="absolute bottom-0 left-0 w-full bg-red-600/90 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wide z-10 backdrop-blur-sm">
                        Rupture
                      </div>
                    )}
                    
                    {/* Bouton de suppression */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        removeFromWishlist(product.id)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-colors z-20"
                      title="Retirer des favoris"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="p-4 flex flex-col h-[140px] justify-between">
                    <div>
                      <Link to={`/products/${product.slug || product.id}`} className="font-medium text-sm text-gray-800 line-clamp-2 hover:text-navy transition-colors mb-1">
                        {product.name}
                      </Link>
                      <div className="font-bold text-navy">{product.price?.toLocaleString()} FCFA</div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (product.stock > 0) addToCart(product)
                      }}
                      disabled={product.stock <= 0}
                      className={`w-full h-10 rounded-lg font-medium text-sm flex items-center justify-center transition-colors
                        ${product.stock > 0 
                          ? 'bg-beige-100 text-navy hover:bg-gold hover:text-white' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      {product.stock > 0 ? "Ajouter au panier" : "Indisponible"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
