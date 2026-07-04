import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useAdminProducts } from "@/hooks/useAdminProducts"
import { useToast } from "@/context/ToastContext"
import ProductTable from "@/components/admin/ProductTable"
import ProductForm from "@/components/admin/ProductForm"

export default function ProductsAdminPage() {
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductStatus 
  } = useAdminProducts()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { addToast } = useToast()

  const handleOpenForm = (product = null) => {
    setProductToEdit(product)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setProductToEdit(null)
  }

  const handleSubmitForm = async (productData, imageFile) => {
    setActionLoading(true)
    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, productData, imageFile)
      } else {
        await addProduct(productData, imageFile)
      }
      handleCloseForm()
      addToast(productToEdit ? "Produit modifié avec succès" : "Produit ajouté avec succès", "success")
    } catch (err) {
      console.error(err)
      addToast("Une erreur est survenue.", "error")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id, imageUrl) => {
    try {
      await deleteProduct(id, imageUrl)
      addToast("Produit supprimé avec succès", "success")
    } catch (err) {
      console.error(err)
      addToast("Erreur lors de la suppression du produit", "error")
    }
  }

  const handleToggleStatus = async (id, field, value) => {
    await toggleProductStatus(id, field, value)
  }

  if (isFormOpen) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleCloseForm}
            className="p-2 mr-4 text-gray-500 hover:text-navy hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-navy">
            {productToEdit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h1>
        </div>

        <Card className="border-premium-border shadow-sm">
          <CardContent className="p-6">
            <ProductForm 
              productToEdit={productToEdit} 
              onSubmit={handleSubmitForm} 
              onCancel={handleCloseForm}
              loading={actionLoading}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
        <Link to="/" className="hover:text-navy transition-colors">Accueil</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link to="/admin" className="hover:text-navy transition-colors">Administration</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-navy">Produits</span>
      </div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy">Gestion des Produits</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre catalogue, les stocks et les mises en avant.</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-navy hover:bg-navy-hover text-white h-10">
          <Plus size={16} className="mr-2" /> Ajouter un produit
        </Button>
      </div>

      <Card className="border-premium-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-premium-border flex gap-4 bg-gray-50/50">
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              className="border border-premium-border rounded-md px-3 py-2 text-sm w-72 focus:outline-none focus:ring-1 focus:ring-navy" 
              disabled // Désactivé en attendant d'implémenter la recherche
            />
          </div>
          
          <ProductTable 
            products={products}
            loading={loading}
            error={error}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>
    </div>
  )
}
