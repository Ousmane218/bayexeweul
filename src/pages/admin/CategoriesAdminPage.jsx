import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminCategories } from "@/hooks/useAdminCategories"
import CategoryTable from "@/components/admin/CategoryTable"
import CategoryForm from "@/components/admin/CategoryForm"

export default function CategoriesAdminPage() {
  const { 
    categories, 
    loading, 
    error, 
    fetchCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    toggleStatus 
  } = useAdminCategories()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleOpenForm = (category = null) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setEditingCategory(null)
    setIsFormOpen(false)
  }

  const handleSubmit = async (formData) => {
    let res
    if (editingCategory) {
      res = await updateCategory(editingCategory.id, formData)
    } else {
      res = await addCategory(formData)
    }

    if (res.success) {
      handleCloseForm()
    } else {
      alert("Erreur: " + res.error)
    }
  }

  const handleDelete = async (id) => {
    const res = await deleteCategory(id)
    if (!res.success) {
      alert(res.error) // Affiche le message d'erreur si lié à des produits
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    await toggleStatus(id, currentStatus)
  }

  // Filtrage local pour la recherche
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Gestion des Catégories</h1>
          <p className="text-gray-500 text-sm">Organisez votre catalogue produit</p>
        </div>
        
        {!isFormOpen && (
          <Button onClick={() => handleOpenForm()} className="bg-navy hover:bg-navy-hover text-white">
            <Plus size={18} className="mr-2" />
            Nouvelle catégorie
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          Erreur: {error}
        </div>
      )}

      {isFormOpen ? (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <CategoryForm 
            category={editingCategory}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            loading={loading}
          />
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Barre de recherche et filtres */}
          <div className="bg-white p-4 rounded-xl border border-premium-border flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <input 
                type="text" 
                placeholder="Rechercher une catégorie..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-premium-border focus:border-navy focus:outline-none text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Table */}
          <CategoryTable 
            categories={filteredCategories}
            loading={loading}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      )}
    </div>
  )
}
