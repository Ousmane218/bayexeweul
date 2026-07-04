import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useCategoryProducts } from "@/hooks/useCategoryProducts"
import ProductCard from "@/components/product/ProductCard"
import { ArrowLeft, PackageSearch, ChevronLeft, ChevronRight } from "lucide-react"
import { useSEO } from "@/hooks/useSEO"

export default function CategoryPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(1)
  const { category, products, totalPages, loading, error } = useCategoryProducts(slug, page, 24)

  // Reset page when slug changes
  useEffect(() => {
    setPage(1)
  }, [slug])

  useSEO({
    title: category?.name || "",
    description: category?.name ? `Découvrez notre sélection de produits dans la catégorie ${category.name.toLowerCase()}.` : "",
    url: window.location.href
  })

  if (loading && products.length === 0) {
    return (
      <div className="bg-premium-bg min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-200 w-64 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || (!category && !loading)) {
    return (
      <div className="bg-premium-bg min-h-screen py-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-navy mb-4">Catégorie introuvable</h1>
        <p className="text-gray-500 mb-8">Cette catégorie n'existe pas ou n'est plus disponible.</p>
        <Link to="/categories" className="text-gold hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Retour aux catégories
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-premium-bg min-h-screen">
      {/* En-tête de catégorie */}
      <div className="bg-navy text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <Link to="/categories" className="text-gray-400 hover:text-white flex items-center mb-4 text-sm w-fit transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Toutes les catégories
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold capitalize">
            {category?.name}
          </h1>
          <p className="text-gray-300 mt-2">
            Découvrez notre sélection de produits dans la catégorie {category?.name?.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Grille de produits */}
      <div className="container mx-auto px-4 pb-20">
        {products.length === 0 && !loading ? (
          <div className="bg-white border border-premium-border border-dashed rounded-lg py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-beige-100 text-gold rounded-full flex items-center justify-center mb-4">
              <PackageSearch size={32} />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Aucun produit disponible</h3>
            <p className="text-gray-500 max-w-md">
              Il n'y a pas encore de produits dans cette catégorie. Revenez plus tard !
            </p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-6 border-t border-gray-200 pt-8">
                <button
                  onClick={() => {
                    setPage(p => Math.max(1, p - 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={page === 1 || loading}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-navy disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Précédent
                </button>
                
                <span className="text-sm font-medium text-gray-500">
                  Page {page} <span className="mx-1 text-gray-300">/</span> {totalPages}
                </span>

                <button
                  onClick={() => {
                    setPage(p => Math.min(totalPages, p + 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={page === totalPages || loading}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-navy disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
