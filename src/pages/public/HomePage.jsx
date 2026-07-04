import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/useCategories"
import { useProducts } from "@/hooks/useProducts"
import { useSEO } from "@/hooks/useSEO"
import ProductCard from "@/components/product/ProductCard"
import { 
  Truck, ShieldCheck, Headset,
  MessageCircle, Star
} from "lucide-react"

// Fallback icon for categories without images
import { Tag } from "lucide-react"
import { storeConfig } from "@/config/storeConfig"

export default function HomePage() {
  useSEO({
    title: "",
    description: "Découvrez nos produits aux meilleurs prix. BAYEXÉWEUL, votre marketplace de confiance au Sénégal."
  })

  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { products, loading: productsLoading, error: productsError } = useProducts({ limit: 12 })

  return (
    <div className="bg-premium-bg">
      {/* 4. Hero Section */}
      <section className="bg-white py-8 border-b border-premium-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Gauche : Texte & CTA */}
            <div className="lg:w-5/12 space-y-6">
              <div className="inline-block px-3 py-1 bg-beige-200 text-navy font-semibold text-sm rounded-full mb-2">
                {storeConfig.storeName}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight">
                {storeConfig.heroTitle.split(', ')[0]}, <span className="text-gold">{storeConfig.heroTitle.split(', ')[1]}</span>
              </h1>
              <p className="text-lg text-gray-600">
                {storeConfig.heroSubtitle}
              </p>
              <Button size="lg" className="bg-navy hover:bg-navy-hover text-white text-base px-8 h-12 mt-4 rounded-md">
                Découvrir maintenant
              </Button>
            </div>

            {/* Droite : Grille dynamique de catégories (Top 3) */}
            <div className="lg:w-7/12 w-full">
              {categoriesLoading ? (
                <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[400px] animate-pulse">
                  <div className="col-span-2 row-span-2 bg-gray-100 rounded-2xl"></div>
                  <div className="bg-gray-100 rounded-2xl"></div>
                  <div className="bg-gray-100 rounded-2xl"></div>
                </div>
              ) : categories && categories.length >= 3 ? (
                <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[400px]">
                  {/* Grand encart (Catégorie 1) */}
                  <Link to={`/category/${categories[0].slug}`} className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group border border-premium-border hover:border-gold transition-colors block">
                    {categories[0].image_url ? (
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${categories[0].image_url})` }}></div>
                    ) : (
                      <div className="absolute inset-0 bg-beige-100 flex items-center justify-center text-navy/20">
                         <Tag size={80} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent"></div>
                    <div className="absolute top-6 right-6">
                      <span className="bg-white text-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">À l'affiche</span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-bold text-white text-2xl md:text-3xl mb-1 drop-shadow-md">{categories[0].name}</h3>
                      <p className="text-sm text-gray-200">Découvrir la collection</p>
                    </div>
                  </Link>

                  {/* Petits encarts (Catégories 2 et 3) */}
                  {categories.slice(1, 3).map((cat) => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="relative bg-navy rounded-2xl overflow-hidden group border border-premium-border hover:border-gold transition-colors flex flex-col justify-end p-4">
                      {cat.image_url ? (
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" style={{ backgroundImage: `url(${cat.image_url})` }}></div>
                      ) : (
                        <div className="absolute inset-0 bg-navy flex items-center justify-center text-gold/30">
                           <Tag size={40} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <h3 className="relative font-bold text-white text-sm text-center drop-shadow-md z-10">{cat.name}</h3>
                    </Link>
                  ))}
                </div>
              ) : (
                 <div className="h-[400px] bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <Tag size={48} className="mb-4 opacity-20" />
                    <p>Les catégories s'afficheront ici</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section Avantages */}
      <section className="py-10 bg-white border-b border-premium-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-beige-200 rounded-full flex items-center justify-center text-navy">
                <Truck size={24} />
              </div>
              <h4 className="font-bold text-navy text-sm">{storeConfig.deliveryText}</h4>
              <p className="text-xs text-gray-500">{storeConfig.importText}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-beige-200 rounded-full flex items-center justify-center text-navy">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-navy text-sm">Paiement sécurisé</h4>
              <p className="text-xs text-gray-500">Vos transactions sont protégées</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-beige-200 rounded-full flex items-center justify-center text-navy">
                <Star size={24} />
              </div>
              <h4 className="font-bold text-navy text-sm">Produits sélectionnés</h4>
              <p className="text-xs text-gray-500">Qualité garantie à 100%</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-beige-200 rounded-full flex items-center justify-center text-navy">
                <Headset size={24} />
              </div>
              <h4 className="font-bold text-navy text-sm">Service client</h4>
              <p className="text-xs text-gray-500">Assistance 7j/7 sur WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Catégories populaires dynamiques via Supabase */}
      <section className="py-12 bg-premium-bg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-navy">Catégories Populaires</h2>
            <Link to="/categories" className="text-sm font-medium text-gold hover:underline">Voir tout</Link>
          </div>
          
          {categoriesLoading ? (
            /* Skeleton Loader */
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-premium-border rounded-xl p-4 flex flex-col items-center animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
                  <div className="h-3 bg-gray-200 w-16 rounded"></div>
                </div>
              ))}
            </div>
          ) : categoriesError ? (
            /* Error State (optional, fallback to empty) */
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">
              Une erreur est survenue lors du chargement des catégories.
            </div>
          ) : categories.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-premium-border border-dashed rounded-2xl py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-beige-100 text-gold rounded-full flex items-center justify-center mb-4">
                <Tag size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Aucune catégorie disponible</h3>
              <p className="text-gray-500 max-w-md">
                Les catégories sont en cours de mise à jour. Revenez bientôt pour découvrir notre nouveau catalogue.
              </p>
            </div>
          ) : (
            /* Data State */
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {categories.map((cat) => {
                return (
                  <Link key={cat.id || cat.slug} to={`/category/${cat.slug}`} className="bg-white border border-premium-border rounded-xl flex flex-col items-center text-center hover:shadow-md hover:border-navy transition-all group overflow-hidden">
                    {cat.image_url ? (
                      <div className="w-full h-24 bg-gray-100 relative mb-3">
                         <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors"></div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 mt-4 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-navy group-hover:text-white text-navy transition-colors">
                        <Tag size={20} strokeWidth={1.5} />
                      </div>
                    )}
                    <span className={`text-xs font-medium text-gray-700 leading-tight pb-4 px-2 ${cat.image_url ? 'pt-1' : ''}`}>{cat.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* 7. Produits récents (Dynamiques via Supabase) */}
      <section className="py-12 bg-white border-y border-premium-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy mb-8">Nouveaux arrivages</h2>
          
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : productsError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">
              Erreur lors du chargement des produits.
            </div>
          ) : products.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg py-12 text-center px-4">
              <p className="text-gray-500">Les produits seront bientôt disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. Section Confiance */}
      <section className="py-16 bg-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-gold mb-12">Pourquoi choisir {storeConfig.storeName} ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="font-bold text-xl">Qualité</h4>
              <p className="text-sm text-gray-300">Nous sélectionnons rigoureusement nos fournisseurs pour vous garantir le meilleur.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-xl">Confiance</h4>
              <p className="text-sm text-gray-300">Des milliers de clients satisfaits et un service transparent à chaque étape.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-xl">Diversité</h4>
              <p className="text-sm text-gray-300">De la mode à l'électronique, trouvez absolument tout sur notre plateforme.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-xl">Accessibilité</h4>
              <p className="text-sm text-gray-300">Des prix étudiés pour vous offrir le meilleur rapport qualité-prix du marché.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA WhatsApp */}
      <section className="py-12 bg-beige-200">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl p-8 border border-premium-border shadow-sm">
          <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-navy mb-2">Vous cherchez un produit spécifique ?</h2>
            <p className="text-gray-600">Notre équipe peut le trouver pour vous et l'importer directement.</p>
          </div>
          <a 
            href={`https://wa.me/${storeConfig.whatsappNumber.replace('+', '')}?text=${encodeURIComponent("Bonjour, je cherche un produit spécifique sur " + storeConfig.storeName)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1DA851] text-white font-medium px-8 h-14 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all"
          >
            <MessageCircle className="mr-2" size={24} />
            Nous contacter sur WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
