import { useParams, Link } from "react-router-dom"
import { useCategoryProducts } from "@/hooks/useCategoryProducts"
import ProductCard from "@/components/product/ProductCard"
import { ArrowLeft, PackageSearch } from "lucide-react"

export default function CategoryPage() {
  const { slug } = useParams()
  const { category, products, loading, error } = useCategoryProducts(slug)

  if (loading) {
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

  if (error || !category) {
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
            {category.name}
          </h1>
          <p className="text-gray-300 mt-2">
            Découvrez notre sélection de produits dans la catégorie {category.name.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Grille de produits */}
      <div className="container mx-auto px-4 pb-20">
        {products.length === 0 ? (
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
