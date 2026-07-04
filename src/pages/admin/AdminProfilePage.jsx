import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Save, X, User } from "lucide-react"

export default function AdminProfilePage() {
  const { profile, user, refreshProfile } = useAuth()
  
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
    }
  }, [profile])

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-premium-border p-8 flex flex-col items-center text-center">
        <User size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-navy mb-2">Profil introuvable</h2>
        <p className="text-gray-500">Les données de votre profil ne sont pas disponibles pour le moment.</p>
      </div>
    )
  }

  const hasChanges = fullName !== (profile.full_name || "")

  const handleCancel = () => {
    setFullName(profile.full_name || "")
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
        .eq('id', profile.id)
        
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-premium-border overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Mon Profil</h1>
          <p className="text-sm text-gray-500">Gérez vos informations personnelles</p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="max-w-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-navy">Nom complet <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500">Adresse email</label>
              <input 
                type="email" 
                value={profile.email || user?.email || ""}
                disabled
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500">Rôle</label>
              <input 
                type="text" 
                value={profile.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                disabled
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500">Date de création</label>
              <input 
                type="text" 
                value={formatDate(profile.created_at)}
                disabled
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500">Dernière modification</label>
              <input 
                type="text" 
                value={formatDate(profile.updated_at)}
                disabled
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4 mt-8">
            {hasChanges && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={loading}
                className="h-11 px-6 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X size={18} className="mr-2" />
                Annuler
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={!hasChanges || loading}
              className="h-11 px-8 rounded-lg bg-navy text-white hover:bg-navy-hover transition-colors"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
              ) : (
                <Save size={18} className="mr-2" />
              )}
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
