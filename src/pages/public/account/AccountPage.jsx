import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { User, LogOut, Save, X, Package, Heart, ArrowRight } from "lucide-react"

export default function AccountPage() {
  const { profile, user, refreshProfile, signOut } = useAuth()
  
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (profile) {
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
    <div className="bg-premium-bg min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-navy/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-navy mb-2 tracking-tight">Mon Compte</h1>
            <p className="text-gray-500">Gérez vos informations personnelles</p>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
            <Link 
              to="/account/wishlist"
              className="w-full md:w-auto flex items-center justify-center text-red-600 bg-white hover:bg-red-50 px-5 py-2.5 rounded-xl shadow-sm border border-red-100 font-medium transition-all"
            >
              <Heart size={18} className="mr-2" />
              Favoris
            </Link>
            <Link 
              to="/account/orders"
              className="w-full md:w-auto flex items-center justify-center text-navy bg-white hover:bg-gray-50 px-5 py-2.5 rounded-xl shadow-sm border border-gray-200 font-medium transition-all"
            >
              <Package size={18} className="mr-2" />
              Mes commandes
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full md:w-auto flex items-center justify-center text-red-600 hover:text-white bg-white hover:bg-red-600 px-5 py-2.5 rounded-xl shadow-sm border border-red-100 font-medium transition-all"
            >
              <LogOut size={18} className="mr-2" />
              Déconnexion
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
          <div className="p-6 md:p-10">
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

              <div className="pt-8 border-t border-gray-100 flex justify-end space-x-4">
                {hasChanges && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={loading}
                    className="h-12 px-6 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    <X size={18} className="mr-2" />
                    Annuler
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={!hasChanges || loading}
                  className="h-12 px-8 rounded-xl bg-navy text-white hover:bg-navy-hover font-medium transition-all shadow-md shadow-navy/20 disabled:opacity-70 disabled:shadow-none"
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
  )
}
