import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 bg-premium-bg">
      <div className="container mx-auto px-4 text-center max-w-lg">
        <h1 className="text-9xl font-serif font-bold text-navy mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Page introuvable</h2>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas, a été supprimée ou est temporairement indisponible.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button size="lg" className="bg-navy hover:bg-navy-hover text-white w-full sm:w-auto">
              <Home size={18} className="mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Link to="/categories">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Search size={18} className="mr-2" />
              Explorer le catalogue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
