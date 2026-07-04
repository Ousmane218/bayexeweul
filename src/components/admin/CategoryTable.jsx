import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CategoryTable({ categories, onEdit, onDelete, onToggleStatus, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-premium-border p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-premium-border border-dashed p-12 text-center">
        <p className="text-gray-500 mb-4">Aucune catégorie trouvée.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-premium-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-premium-border">
            <tr>
              <th className="p-4">Image/Icon</th>
              <th className="p-4">Nom</th>
              <th className="p-4">Slug</th>
              <th className="p-4 text-center">Ordre</th>
              <th className="p-4 text-center">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-premium-border">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {category.image_url ? (
                      <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                    ) : category.icon ? (
                      <span className="text-gray-500">{category.icon}</span>
                    ) : (
                      <span className="text-gray-400 font-bold">{category.name.charAt(0)}</span>
                    )}
                  </div>
                </td>
                <td className="p-4 font-bold text-navy">{category.name}</td>
                <td className="p-4 text-gray-500">{category.slug}</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                    {category.sort_order}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onToggleStatus(category.id, category.is_active)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      category.is_active 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {category.is_active ? <Eye size={12} className="mr-1" /> : <EyeOff size={12} className="mr-1" />}
                    {category.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(category)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
                          onDelete(category.id)
                        }
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
