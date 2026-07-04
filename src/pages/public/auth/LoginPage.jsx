import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Mail, Lock, AlertCircle, User } from "lucide-react"
import { storeConfig } from "@/config/storeConfig"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Le composant PublicLayout ou ClientProtectedRoute gèrera la session avec useAuth()
      navigate("/account")
      
    } catch (err) {
      console.error(err)
      setError("Email ou mot de passe incorrect.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-premium-bg min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Éléments de décoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-navy/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative z-10">
        <div className="text-center">
          <img src="/logo.png" alt={storeConfig.storeName} className="h-16 md:h-20 lg:h-24 w-auto object-contain mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-navy mb-2 tracking-tight">Bon retour !</h2>
          <p className="text-sm text-gray-500">
            Connectez-vous à votre espace <span className="font-semibold text-navy">{storeConfig.storeName}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center text-sm border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="mr-3 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-navy block mb-2">Adresse email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                  <Mail size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-navy"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-navy block">Mot de passe</label>
                <Link to="#" className="text-xs text-gold hover:underline font-medium">Mot de passe oublié ?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                  <Lock size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-navy"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-navy hover:bg-navy-hover text-white rounded-xl text-lg font-medium transition-all shadow-md shadow-navy/20 disabled:opacity-70 disabled:shadow-none"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        <div className="pt-6 mt-6 border-t border-gray-100 text-center text-sm">
          <p className="text-gray-500">
            Vous n'avez pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-navy hover:text-gold transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
