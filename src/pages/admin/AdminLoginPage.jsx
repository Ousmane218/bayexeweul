import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { user, isAdmin, loading: authLoading } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Gérer le cas où un utilisateur est déjà connecté (visite directe de la page)
  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        navigate("/admin", { replace: true })
      } else {
        supabase.auth.signOut().then(() => {
          setError("Accès refusé : vous n'avez pas les droits d'administrateur.")
        })
      }
    }
  }, [user, isAdmin, authLoading, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Vérification explicite du rôle admin juste après le login
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (profileError) {
        console.error("Profile fetch error:", profileError)
      }

      if (profileError || !profile || profile.role !== "admin") {
        await supabase.auth.signOut()
        setError("Accès refusé : vous n'avez pas les droits d'administrateur.")
        setLoading(false)
        return
      }
      
      // Si c'est un admin, la redirection se fera soit ici, soit via le useEffect
      // car le onAuthStateChange de useAuth va aussi se déclencher.
      navigate("/admin", { replace: true })
    } catch (err) {
      setError("Identifiants incorrects ou erreur de connexion.")
      setLoading(false)
    }
  }

  // Ne pas flasher le formulaire si on vérifie la session
  if (authLoading && !loading) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-bg">
      <div className="max-w-md w-full bg-white p-8 border border-premium-border shadow-sm rounded-lg">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="BAYEXÉWEUL" className="h-16 md:h-20 lg:h-24 w-auto object-contain mx-auto mb-4 scale-110" />
          <p className="text-gray-500">Connexion Espace Admin</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input 
              type="email" 
              placeholder="admin@bayexeweul.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-navy text-white hover:bg-navy-hover mt-6"
            disabled={loading || authLoading}
          >
            {loading ? "Vérification des droits..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  )
}
