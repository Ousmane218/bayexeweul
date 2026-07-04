import { Link } from "react-router-dom"
import { useCategories } from "@/hooks/useCategories"
import { LayoutGrid } from "lucide-react"

export default function CategoriesPage() {
  const { categories, loading, error } = useCategories()

  return (
    <div className="bg-premium-bg min-h-screen">
      {/* Header court */}
      <div className="bg-navy text-white py-16 mb-8 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold capitalize mb-4">
            Toutes nos catégories
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Découvrez l'ensemble de notre catalogue. Trouvez exactement ce que vous cherchez parmi notre vaste sélection de produits de qualité.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse border border-premium-border"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center max-w-lg mx-auto border border-red-100">
            Une erreur est survenue lors du chargement des catégories.
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="bg-white border border-premium-border border-dashed rounded-xl py-24 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-beige-100 text-gold rounded-full flex items-center justify-center mb-6">
                <LayoutGrid size={32} />
             </div>
             <h3 className="text-xl font-bold text-navy mb-2">Aucune catégorie</h3>
             <p className="text-gray-500">Les catégories seront bientôt disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.slug}`}
                className="group relative h-64 bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center border border-premium-border hover:shadow-lg hover:border-navy transition-all duration-300"
              >
                {/* 
                  Décoration d'arrière-plan pour un look premium
                */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-beige-100 group-hover:scale-105 transition-transform duration-500 -z-10"></div>
                
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-colors duration-300 mb-4 z-10">
                  <LayoutGrid size={28} />
                </div>
                
                <h3 className="text-xl font-serif font-bold text-navy group-hover:text-gold transition-colors z-10 text-center px-4">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
