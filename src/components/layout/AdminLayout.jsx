import { useState } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, Package, Tags, LogOut, Globe, User, ShoppingCart, Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useOrdersStats } from "@/hooks/useOrdersStats"

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile, signOut } = useAuth()
  const { pendingCount } = useOrdersStats()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate("/admin/login")
  }

  const displayName = profile?.full_name || "Administrateur"
  const userEmail = user?.email || "admin@bayexeweul.com"

  return (
    <div className="min-h-screen flex bg-premium-bg">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-navy text-white flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-800">
          <Link to="/" className="flex items-center ml-4 lg:ml-0">
            <img src="/logo.png" alt="BAYEXÉWEUL" className="h-12 md:h-16 w-auto object-contain scale-110 origin-left" />
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white p-2">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/admin' ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={18} className="mr-3" />
            Tableau de bord
          </Link>
          <Link to="/admin/products" onClick={() => setIsSidebarOpen(false)} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname.includes('/admin/products') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <Package size={18} className="mr-3" />
            Produits
          </Link>
          <Link to="/admin/orders" onClick={() => setIsSidebarOpen(false)} className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname.includes('/admin/orders') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
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
          <Link to="/admin/categories" onClick={() => setIsSidebarOpen(false)} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname.includes('/admin/categories') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <Tags size={18} className="mr-3" />
            Catégories
          </Link>
          <Link to="/admin/profile" onClick={() => setIsSidebarOpen(false)} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname.includes('/admin/profile') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <User size={18} className="mr-3" />
            Mon profil
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
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        {/* Admin Header */}
        <header className="h-20 bg-white border-b border-premium-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-navy rounded-lg hover:bg-gray-100">
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-medium text-navy">{displayName}</p>
              <p className="text-xs text-gray-500 hidden sm:block">{userEmail}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
