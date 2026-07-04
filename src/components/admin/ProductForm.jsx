import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCategories } from '@/hooks/useCategories'
import { useToast } from '@/context/ToastContext'
import { ImagePlus, X, Loader2 } from 'lucide-react'

export default function ProductForm({ productToEdit, onSubmit, onCancel, loading }) {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { addToast } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    is_active: true,
    is_featured: false,
  })
  
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (productToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: productToEdit.name || '',
        slug: productToEdit.slug || '',
        description: productToEdit.description || '',
        price: productToEdit.price || '',
        stock: productToEdit.stock || '',
        category_id: productToEdit.category_id || '',
        is_active: productToEdit.is_active ?? true,
        is_featured: productToEdit.is_featured ?? false,
      })
      setImagePreview(productToEdit.image_url || null)
    }
  }, [productToEdit])

  const generateSlug = (text) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
  }

  const handleNameChange = (e) => {
    const newName = e.target.value
    setFormData((prev) => ({
      ...prev,
      name: newName,
      // Si on est en création et que le slug n'a pas été modifié manuellement
      slug: !productToEdit ? generateSlug(newName) : prev.slug
    }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.category_id) {
      addToast("Veuillez remplir les champs obligatoires (Nom, Prix, Catégorie).", "error")
      return
    }
    
    // Nettoyer les types
    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10) || 0,
    }
    
    onSubmit(dataToSubmit, imageFile)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Colonne de gauche */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
            <Input name="name" value={formData.name} onChange={handleNameChange} required placeholder="Ex: Montre Connectée Pro" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <Input name="slug" value={formData.slug} onChange={handleChange} placeholder="montre-connectee-pro" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
              <Input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" placeholder="25000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <Input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" placeholder="10" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
            <select 
              name="category_id" 
              value={formData.category_id} 
              onChange={handleChange} 
              required
              className="w-full border border-premium-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            >
              <option value="">Sélectionner une catégorie</option>
              {categoriesLoading ? (
                <option disabled>Chargement des catégories...</option>
              ) : categoriesError ? (
                <option disabled>Erreur: {categoriesError}</option>
              ) : !categories || categories.length === 0 ? (
                <option disabled>Aucune catégorie disponible</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description courte</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows="4" 
              className="w-full border border-premium-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              placeholder="Description du produit..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Aperçu" className="max-h-40 rounded mx-auto" />
                  <button 
                    type="button" 
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                  <ImagePlus size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Cliquez pour ajouter une image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="rounded text-navy focus:ring-navy" />
              <span className="text-sm font-medium text-gray-700">Produit actif</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="rounded text-gold focus:ring-gold" />
              <span className="text-sm font-medium text-gray-700">Mettre en avant</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" className="bg-navy hover:bg-navy-hover text-white" disabled={loading}>
          {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Enregistrement...</> : (productToEdit ? 'Mettre à jour' : 'Ajouter')}
        </Button>
      </div>
    </form>
  )
}
