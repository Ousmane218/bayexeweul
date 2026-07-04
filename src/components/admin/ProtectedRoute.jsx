import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-premium-bg">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-navy font-medium">Vérification des droits d'accès...</p>
      </div>
    )
  }

  // Si l'utilisateur n'est pas connecté, on redirige vers le login
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  // Si connecté mais pas admin
  if (!isAdmin) {
    // Redirection vers l'accueil car l'utilisateur n'a pas les droits requis
    return <Navigate to="/" replace />
  }

  // Sinon on affiche les routes enfants (AdminLayout)
  return <Outlet />
}
