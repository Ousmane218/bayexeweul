import { useState } from 'react'
import { Edit, Trash2, PackageSearch, ImageOff } from 'lucide-react'

export default function ProductTable({ products, loading, error, onEdit, onDelete, onToggleStatus }) {
  
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
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?\nCette action est irréversible.`)) {
      onDelete(product.id, product.image_url)
    }
  }

  return (
    <div className="w-full overflow-x-auto">
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
                <div className={`text-xs mt-1 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-600'}`}>
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
  )
}
