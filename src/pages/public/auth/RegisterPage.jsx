import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Mail, Lock, User, AlertCircle } from "lucide-react"
import { storeConfig } from "@/config/storeConfig"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          }
        }
      })

      if (authError) throw authError

      // Si l'inscription réussit, redirection vers account
      navigate("/account")
      
    } catch (err) {
      console.error(err)
      if (err.message.includes("already registered")) {
        setError("Cet email est déjà utilisé.")
      } else {
        setError("Erreur lors de l'inscription : " + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-premium-bg min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Éléments de décoration */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-navy/5 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative z-10">
        <div className="text-center">
          <img src="/logo.png" alt={storeConfig.storeName} className="h-16 md:h-20 lg:h-24 w-auto object-contain mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-navy mb-2 tracking-tight">Créer un compte</h2>
          <p className="text-sm text-gray-500">
            Rejoignez <span className="font-semibold text-navy">{storeConfig.storeName}</span> dès aujourd'hui
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center text-sm border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="mr-3 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-navy block mb-2">Nom complet</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                  <User size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-navy"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

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
              <label className="text-sm font-semibold text-navy block mb-2">Mot de passe</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                  <Lock size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-navy"
                  placeholder="•••••••• (6 caractères min)"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy block mb-2">Confirmer le mot de passe</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                  <Lock size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              "Créer mon compte"
            )}
          </Button>
        </form>

        <div className="pt-6 mt-6 border-t border-gray-100 text-center text-sm">
          <p className="text-gray-500">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="font-semibold text-navy hover:text-gold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
