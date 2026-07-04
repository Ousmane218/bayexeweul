import { RefreshCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page500() {
  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="flex-1 flex items-center justify-center py-20 bg-premium-bg min-h-screen">
      <div className="container mx-auto px-4 text-center max-w-lg">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <RefreshCcw size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4">Erreur Interne</h1>
        <p className="text-gray-600 mb-8">
          Oups ! Quelque chose s'est mal passé de notre côté. Nous travaillons déjà à résoudre le problème.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={handleReload} className="bg-navy hover:bg-navy-hover text-white w-full sm:w-auto">
            <RefreshCcw size={18} className="mr-2" />
            Recharger la page
          </Button>
          <Button size="lg" variant="outline" onClick={handleGoHome} className="w-full sm:w-auto">
            <Home size={18} className="mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  )
}
