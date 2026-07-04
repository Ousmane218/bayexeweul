import { Outlet, Link, useNavigate } from "react-router-dom"
import { Search, ShoppingCart, Menu, User, Heart, Phone, LogOut, Shield } from "lucide-react"
import { useCategories } from "@/hooks/useCategories"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/hooks/useAuth"
import { useWishlist } from "@/context/WishlistContext"
import { useState } from "react"
import { storeConfig } from "@/config/storeConfig"

export default function PublicLayout() {
  const { categories } = useCategories()
  const { cartCount } = useCart()
  const { user, profile, signOut } = useAuth()
  const { wishlistItems } = useWishlist()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const wishlistItemCount = wishlistItems.length

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-premium-bg">
      {/* Top Banner */}
      <div className="bg-navy text-white text-xs py-2">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-2 sm:gap-0">
          <div className="flex items-center space-x-4">
            <span className="font-medium">{storeConfig.deliveryText}</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-400"></span>
            <span className="text-gray-200">{storeConfig.importText}</span>
          </div>
          <div className="flex items-center font-medium">
            <Phone size={14} className="mr-2 text-gold" />
            WhatsApp: {storeConfig.whatsappDisplay}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-premium-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-navy tracking-tight shrink-0 uppercase">
            {storeConfig.storeName}
          </Link>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-12 relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Chercher des produits, marques et catégories..." 
              className="w-full h-11 pl-5 pr-12 rounded-lg border-2 border-premium-border bg-gray-50 focus:outline-none focus:ring-0 focus:border-navy transition-colors text-sm"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center bg-navy text-white rounded-r-md hover:bg-navy-hover transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* Icons - Right */}
          <div className="flex items-center space-x-5 shrink-0 relative">
            {!user ? (
              <Link to="/login" className="flex flex-col items-center text-navy hover:text-gold transition-colors">
                <User size={22} strokeWidth={1.5} />
                <span className="text-[10px] hidden md:block mt-1 font-medium">Connexion</span>
              </Link>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex flex-col items-center text-navy hover:text-gold transition-colors focus:outline-none"
                >
                  <User size={22} strokeWidth={1.5} />
                  <span className="text-[10px] hidden md:block mt-1 font-medium">Mon compte</span>
                </button>
                
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-premium-border overflow-hidden z-50 py-2">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-semibold text-navy truncate">{profile?.full_name || 'Client'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/account" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-beige-100 hover:text-navy transition-colors">
                        <User size={16} className="mr-3 text-gray-400" />
                        Mon compte
                      </Link>
                      {profile?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-beige-100 hover:text-navy transition-colors">
                          <Shield size={16} className="mr-3 text-gold" />
                          Administration
                        </Link>
                      )}
                      <div className="border-t border-gray-50 my-1"></div>
                      <button onClick={() => { setShowUserMenu(false); signOut(); }} className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
                        <LogOut size={16} className="mr-3" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            <Link to={user ? "/account/wishlist" : "/login"} className="flex flex-col items-center text-navy hover:text-gold transition-colors relative">
              <div className="relative">
                <Heart size={22} strokeWidth={1.5} />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] hidden md:block mt-1 font-medium">Favoris</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center text-navy hover:text-gold transition-colors relative">
              <div className="relative">
                <ShoppingCart size={22} strokeWidth={1.5} />
                <span className="absolute -top-1.5 -right-2 bg-gold text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="text-[10px] hidden md:block mt-1 font-medium">Panier</span>
            </Link>
            <button className="md:hidden text-navy ml-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher..." 
              className="w-full h-10 pl-4 pr-10 rounded-lg border border-premium-border bg-gray-50 focus:outline-none focus:border-navy text-sm"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-navy">
              <Search size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Categories Navbar */}
      <nav className="bg-white border-b border-premium-border shadow-sm">
        <div className="container mx-auto px-4">
          <ul className="flex items-center space-x-8 h-12 text-sm font-medium text-gray-700 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <li><Link to="/categories" className="text-navy font-bold flex items-center"><Menu size={16} className="mr-2"/> Toutes les catégories</Link></li>
            {categories?.slice(0, 10).map(cat => (
              <li key={cat.id}>
                <Link to={`/category/${cat.slug}`} className="hover:text-navy transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white pt-16 pb-8 mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-serif font-bold text-gold mb-6 uppercase">{storeConfig.storeName}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {storeConfig.tagline}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-400">Liens Utiles</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="#" className="hover:text-gold transition-colors">À propos de nous</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Contactez-nous</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Vendre sur {storeConfig.storeName}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-400">Service Client</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="#" className="hover:text-gold transition-colors">Centre d'aide</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Retours & Remboursements</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Méthodes de paiement</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-400">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-4">Recevez nos meilleures offres directement dans votre boîte mail.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-white/10 border border-white/20 rounded-l-md px-4 py-2 w-full text-sm focus:outline-none focus:border-gold transition-colors text-white placeholder:text-gray-400"
              />
              <button className="bg-gold hover:bg-gold-hover text-navy font-bold text-sm px-4 rounded-r-md transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center border-t border-white/10 pt-8 text-xs text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} {storeConfig.storeName}. Tous droits réservés.</p>
          <div className="flex space-x-4">
            <Link to="#" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
            <Link to="#" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
