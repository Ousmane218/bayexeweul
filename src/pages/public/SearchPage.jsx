import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearchProducts } from '@/hooks/useSearchProducts'
import { useCategories } from '@/hooks/useCategories'
import ProductCard from '@/components/product/ProductCard'
import { SlidersHorizontal, X, Search, PackageSearch, RotateCcw } from 'lucide-react'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  const { products, loading, error, activeFiltersCount } = useSearchProducts(searchParams)
  const { categories } = useCategories()

  // Valeurs actuelles depuis l'URL
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const min = searchParams.get('min') || ''
  const max = searchParams.get('max') || ''
  const stock = searchParams.get('stock') === 'true'
  const featured = searchParams.get('featured') === 'true'
  const sort = searchParams.get('sort') || 'recent'

  // Fonction de mise à jour d'un paramètre
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const resetFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // La recherche se met à jour onBlur ou au Enter via updateParam('q', value)
    // Mais pour l'input form, on gère la soumission :
    const formData = new FormData(e.target)
    updateParam('q', formData.get('q'))
  }

  // Élément JSX pour les filtres (évite le re-render destructif)
  const filtersContent = (
    <div className="space-y-8">
      {/* Recherche */}
      <div>
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">Recherche</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            placeholder="Mots-clés..." 
            className="w-full h-10 pl-3 pr-10 rounded-lg border border-premium-border bg-gray-50 focus:outline-none focus:border-navy text-sm"
          />
          <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-navy">
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Catégories */}
      <div>
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">Catégorie</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="radio" 
              name="category" 
              checked={category === ''}
              onChange={() => updateParam('category', '')}
              className="rounded-full text-gold focus:ring-gold"
            />
            <span className="text-sm text-gray-700">Toutes les catégories</span>
          </label>
          {categories?.map(cat => (
            <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="category" 
                checked={category === cat.slug}
                onChange={() => updateParam('category', cat.slug)}
                className="rounded-full text-gold focus:ring-gold"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div>
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">Prix (FCFA)</h3>
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={min}
            onChange={(e) => updateParam('min', e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-premium-border bg-gray-50 text-sm focus:outline-none focus:border-navy"
          />
          <span className="text-gray-400">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={max}
            onChange={(e) => updateParam('max', e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-premium-border bg-gray-50 text-sm focus:outline-none focus:border-navy"
          />
        </div>
      </div>

      {/* Options de disponibilité */}
      <div>
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">Disponibilité</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={stock}
              onChange={(e) => updateParam('stock', e.target.checked ? 'true' : '')}
              className="rounded text-gold focus:ring-gold"
            />
            <span className="text-sm text-gray-700">En stock uniquement</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={featured}
              onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')}
              className="rounded text-gold focus:ring-gold"
            />
            <span className="text-sm text-gray-700">Produits mis en avant</span>
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-premium-bg min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Header de la page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-premium-border gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-navy mb-2">Recherche de produits</h1>
            <p className="text-gray-500 text-sm">
              {loading ? "Recherche en cours..." : `${products.length} résultat${products.length > 1 ? 's' : ''} trouvé${products.length > 1 ? 's' : ''}`}
              {q && <span className="font-medium text-navy"> pour "{q}"</span>}
            </p>
          </div>
          
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
            {/* Bouton Filtres Mobile */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center space-x-2 bg-white border border-premium-border px-4 py-2 rounded-lg text-navy text-sm font-medium"
            >
              <SlidersHorizontal size={16} />
              <span>Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Select de Tri */}
            <select 
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="h-10 px-3 bg-white border border-premium-border rounded-lg text-sm text-navy focus:outline-none focus:border-navy"
            >
              <option value="recent">Plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="name_asc">Nom A-Z</option>
              <option value="name_desc">Nom Z-A</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-premium-border sticky top-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="font-bold text-navy flex items-center">
                  <SlidersHorizontal size={18} className="mr-2" />
                  Filtres
                </h2>
                {activeFiltersCount > 0 && (
                  <button 
                    onClick={resetFilters}
                    className="text-xs text-gray-500 hover:text-red-500 flex items-center transition-colors"
                  >
                    <RotateCcw size={12} className="mr-1" />
                    Effacer
                  </button>
                )}
              </div>
              {filtersContent}
            </div>
          </aside>

          {/* Drawer Mobile */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex">
              <div 
                className="fixed inset-0 bg-navy/50 backdrop-blur-sm"
                onClick={() => setShowMobileFilters(false)}
              ></div>
              <div className="relative w-4/5 max-w-sm bg-white h-full overflow-y-auto p-6 shadow-2xl animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <h2 className="font-bold text-navy flex items-center text-lg">
                    <SlidersHorizontal size={20} className="mr-2" />
                    Filtres
                  </h2>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                {filtersContent}
                
                <div className="mt-8 pt-4 border-t border-gray-100 flex gap-4">
                  <button 
                    onClick={resetFilters}
                    className="flex-1 px-4 py-3 bg-gray-100 text-navy font-medium rounded-lg text-sm"
                  >
                    Réinitialiser
                  </button>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-4 py-3 bg-navy text-white font-medium rounded-lg text-sm"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grille de résultats */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white rounded-lg animate-pulse border border-premium-border"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center border border-red-100">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-premium-border border-dashed rounded-xl py-24 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-beige-100 text-gold rounded-full flex items-center justify-center mb-6">
                    <PackageSearch size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-navy mb-2">Aucun produit trouvé</h3>
                 <p className="text-gray-500 max-w-sm mb-6">
                    Essayez de modifier vos critères de recherche ou de retirer certains filtres.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                   <button 
                    onClick={resetFilters}
                    className="bg-white border-2 border-navy text-navy px-6 py-2.5 rounded-lg font-medium hover:bg-beige-100 transition-colors"
                   >
                     Réinitialiser les filtres
                   </button>
                   <Link 
                    to="/categories"
                    className="bg-navy text-white px-6 py-2.5 rounded-lg font-medium hover:bg-navy-hover transition-colors flex items-center justify-center"
                   >
                     Voir toutes les catégories
                   </Link>
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
