import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, Package, Tags, Settings, LogOut, Globe, User, ShoppingCart } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useOrdersStats } from "@/hooks/useOrdersStats"

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile, signOut } = useAuth()
  const { pendingCount } = useOrdersStats()

  const handleLogout = async () => {
    await signOut()
    navigate("/admin/login")
  }

  const displayName = profile?.full_name || "Administrateur"
  const userInitial = displayName.charAt(0).toUpperCase()
  const userEmail = user?.email || "admin@bayexeweul.com"

  return (
    <div className="min-h-screen flex bg-premium-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <Link to="/" className="text-xl font-serif font-bold text-gold tracking-widest uppercase">
            BAYEXÉWEUL
            <span className="block text-[10px] text-gray-400 font-sans tracking-normal mt-1">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          <Link to="/admin" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-white/10 text-white">
            <LayoutDashboard size={18} className="mr-3" />
            Tableau de bord
          </Link>
          <Link to="/admin/products" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Package size={18} className="mr-3" />
            Produits
          </Link>
          <Link to="/admin/orders" className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname.includes('/admin/orders') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center">
              <ShoppingCart size={18} className="mr-3" />
              Commandes
            </div>
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>
          <Link to="/admin/categories" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Tags size={18} className="mr-3" />
            Catégories
          </Link>
          <Link to="/admin/profile" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <User size={18} className="mr-3" />
            Mon profil
          </Link>
          <Link to="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Settings size={18} className="mr-3" />
            Paramètres
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link to="/" className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Globe size={18} className="mr-3" />
            Retour au site
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="h-20 bg-white border-b border-premium-border flex items-center justify-end px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-navy">{displayName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
