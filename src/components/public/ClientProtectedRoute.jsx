import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export default function ClientProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-premium-bg flex flex-col items-center justify-center text-navy">
        <div className="w-12 h-12 border-4 border-navy/20 border-t-navy rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Chargement...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
