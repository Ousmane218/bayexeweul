import { useState } from 'react'
import { Edit, Trash2, PackageSearch, ImageOff } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export default function ProductTable({ products, loading, error, onEdit, onDelete, onToggleStatus }) {
  const [productToDelete, setProductToDelete] = useState(null)
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">
        Erreur lors du chargement des produits: {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full">
        {/* Loading mobile */}
        <div className="md:hidden space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-premium-border rounded-xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-3 bg-gray-100 w-1/2 rounded"></div>
                  <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Loading desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 border-b border-premium-border">
              <tr>
                <th className="px-6 py-3 font-medium">Image</th>
                <th className="px-6 py-3 font-medium">Produit</th>
                <th className="px-6 py-3 font-medium">Prix & Stock</th>
                <th className="px-6 py-3 font-medium">Statuts</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-premium-border animate-pulse">
                  <td className="px-6 py-4"><div className="w-12 h-12 bg-gray-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 w-32 mb-2 rounded"></div><div className="h-3 bg-gray-100 w-20 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 w-16 mb-2 rounded"></div><div className="h-3 bg-gray-100 w-10 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-5 bg-gray-200 w-16 rounded-full"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 w-16 ml-auto rounded"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-premium-border border-dashed rounded-lg py-16 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-beige-100 text-gold rounded-full flex items-center justify-center mb-4">
          <PackageSearch size={32} />
        </div>
        <h3 className="text-lg font-bold text-navy mb-1">Aucun produit trouvé</h3>
        <p className="text-gray-500 text-sm">Commencez par ajouter votre premier produit au catalogue.</p>
      </div>
    )
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
  }

  return (
    <div className="w-full">
      {/* Version Mobile : Cartes */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-premium-border rounded-xl p-4 shadow-sm flex flex-col gap-4">
            <div className="flex gap-4 items-start">
              <div className="shrink-0">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                    <ImageOff size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-navy truncate">{product.name}</h4>
                <p className="text-xs text-gray-500 mb-1">{product.categories?.name || 'Sans catégorie'}</p>
                <div className="font-bold text-gray-900">{product.price.toLocaleString()} FCFA</div>
                <div className={`text-xs mt-1 font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-600'}`}>
                  {product.stock} en stock
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
              <button 
                onClick={() => onToggleStatus(product.id, 'is_active', !product.is_active)}
                className={`flex-1 px-2 py-1.5 text-[10px] uppercase tracking-wide font-bold rounded-lg border transition-colors text-center ${
                  product.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}
              >
                {product.is_active ? 'Actif' : 'Inactif'}
              </button>
              <button 
                onClick={() => onToggleStatus(product.id, 'is_featured', !product.is_featured)}
                className={`flex-1 px-2 py-1.5 text-[10px] uppercase tracking-wide font-bold rounded-lg border transition-colors text-center ${
                  product.is_featured ? 'bg-gold/10 text-gold border-gold/30' : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
              >
                {product.is_featured ? 'Vedette' : 'Standard'}
              </button>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => onEdit(product)}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-beige-100 text-navy hover:bg-beige-200 rounded-lg transition-colors font-medium text-sm"
              >
                <Edit size={16} /> Modifier
              </button>
              <button 
                onClick={() => handleDeleteClick(product)}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
              >
                <Trash2 size={16} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Version Desktop : Tableau */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-premium-border bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 border-b border-premium-border">
            <tr>
              <th className="px-6 py-3 font-medium">Image</th>
              <th className="px-6 py-3 font-medium">Produit</th>
              <th className="px-6 py-3 font-medium">Prix & Stock</th>
              <th className="px-6 py-3 font-medium">Statuts</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-premium-border hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400">
                      <ImageOff size={20} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-navy">{product.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{product.categories?.name || 'Sans catégorie'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{product.price.toLocaleString()} FCFA</div>
                  <div className={`text-xs mt-1 font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-600'}`}>
                    {product.stock} en stock
                  </div>
                </td>
                <td className="px-6 py-4 space-y-2">
                  <div>
                    <button 
                      onClick={() => onToggleStatus(product.id, 'is_active', !product.is_active)}
                      className={`px-2 py-1 text-[10px] uppercase tracking-wide font-bold rounded-full border transition-colors ${
                        product.is_active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                      }`}
                    >
                      {product.is_active ? 'Actif' : 'Inactif'}
                    </button>
                  </div>
                  <div>
                    <button 
                      onClick={() => onToggleStatus(product.id, 'is_featured', !product.is_featured)}
                      className={`px-2 py-1 text-[10px] uppercase tracking-wide font-bold rounded-full border transition-colors ${
                        product.is_featured ? 'bg-gold/10 text-gold border-gold/30 hover:bg-gray-100 hover:text-gray-500 hover:border-gray-200' : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gold/10 hover:text-gold hover:border-gold/30'
                      }`}
                    >
                      {product.is_featured ? 'En vedette' : 'Standard'}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-2 text-navy hover:bg-beige-100 rounded-md transition-colors"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(product)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ConfirmDialog 
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) onDelete(productToDelete.id, productToDelete.image_url)
        }}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer le produit "${productToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
      />
    </div>
  )
}
