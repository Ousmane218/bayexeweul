import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { User, LogOut, Save, X, Package, Heart, Home, ChevronRight, ShoppingBag, Grid } from "lucide-react"

export default function AccountPage() {
  const { profile, user, refreshProfile, signOut } = useAuth()
  
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullName(profile.full_name || "")
    }
  }, [profile])

  const hasChanges = fullName !== (profile?.full_name || "")

  const handleCancel = () => {
    setFullName(profile?.full_name || "")
    setError("")
    setSuccess("")
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (!fullName.trim()) {
      setError("Le nom complet est obligatoire.")
      return
    }

    setLoading(true)
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', profile?.id)
        
      if (updateError) throw updateError
      
      await refreshProfile()
      setSuccess("Profil mis à jour avec succès.")
    } catch (err) {
      console.error(err)
      setError("Erreur lors de la mise à jour du profil.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  if (!profile && !user) return null

  return (
    <div className="bg-premium-bg min-h-[85vh] py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-navy/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-navy transition-colors flex items-center">
            <Home size={14} className="mr-1" /> Accueil
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-navy">Mon compte</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy mb-2 tracking-tight">Mon Compte</h1>
          <p className="text-gray-500">Bienvenue, {profile?.full_name || 'Client'}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Navigation latérale */}
          <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-premium-border overflow-hidden">
              <div className="p-4 bg-navy text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {(profile?.full_name || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold truncate">{profile?.full_name || 'Client'}</p>
                  <p className="text-xs text-white/70 truncate">{user?.email}</p>
                </div>
              </div>
              
              <div className="p-2 space-y-1">
                <Link to="/account" className="flex items-center px-4 py-3 bg-beige-100 text-navy font-bold rounded-xl transition-colors">
                  <User size={18} className="mr-3" /> Mes informations
                </Link>
                <Link to="/account/orders" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-navy font-medium rounded-xl transition-colors">
                  <Package size={18} className="mr-3" /> Mes commandes
                </Link>
                <Link to="/account/wishlist" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-navy font-medium rounded-xl transition-colors">
                  <Heart size={18} className="mr-3" /> Mes favoris
                </Link>
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <button onClick={handleLogout} className="flex items-center w-full justify-center px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 font-bold rounded-xl transition-colors">
                  <LogOut size={18} className="mr-2" /> Déconnexion
                </button>
              </div>
            </div>

            {/* CTAs pour éviter les dead ends */}
            <div className="space-y-3">
              <Link to="/" className="w-full flex items-center justify-center bg-gold text-navy font-bold py-3.5 px-4 rounded-xl hover:bg-gold-hover transition-colors shadow-sm">
                <ShoppingBag size={18} className="mr-2" /> Continuer mes achats
              </Link>
              <Link to="/categories" className="w-full flex items-center justify-center bg-white border-2 border-navy text-navy font-bold py-3.5 px-4 rounded-xl hover:bg-beige-100 transition-colors shadow-sm">
                <Grid size={18} className="mr-2" /> Voir les catégories
              </Link>
            </div>

          </div>

          {/* Contenu principal */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <div className="bg-white rounded-3xl shadow-sm border border-premium-border overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-50">
                <h2 className="text-xl font-bold text-navy">Informations personnelles</h2>
                <p className="text-sm text-gray-500 mt-1">Mettez à jour vos coordonnées</p>
              </div>
              
              <div className="p-6 md:p-8">
                {success && (
                  <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center text-sm shadow-sm animate-in fade-in">
                    <p className="font-medium">{success}</p>
                  </div>
                )}
                
                {error && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center text-sm shadow-sm animate-in fade-in">
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-navy">Nom complet <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-14 px-5 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-navy"
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-500">Adresse email</label>
                      <input 
                        type="email" 
                        value={profile?.email || user?.email || ""}
                        disabled
                        className="w-full h-14 px-5 rounded-xl border-transparent bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                      />
                      <p className="text-xs text-gray-400 mt-1">L'adresse email ne peut pas être modifiée.</p>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-500">Rôle du compte</label>
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-navy/5 text-navy font-semibold text-sm">
                          <User size={16} className="mr-2" />
                          {profile?.role === 'admin' ? 'Administrateur' : 'Client standard'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-4">
                    {hasChanges && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={loading}
                        className="h-12 px-6 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors w-full sm:w-auto"
                      >
                        <X size={18} className="mr-2" />
                        Annuler
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      disabled={!hasChanges || loading}
                      className="h-12 px-8 rounded-xl bg-navy text-white hover:bg-navy-hover font-medium transition-all shadow-md shadow-navy/20 disabled:opacity-70 disabled:shadow-none w-full sm:w-auto"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
                      ) : (
                        <Save size={18} className="mr-2" />
                      )}
                      Enregistrer les modifications
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
