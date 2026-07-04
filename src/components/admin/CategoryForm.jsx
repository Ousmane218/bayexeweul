import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Save, UploadCloud, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CategoryForm({ category, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    image_url: '',
    sort_order: 0,
    is_active: true
  })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)
  const [previewImage, setPreviewImage] = useState(category?.image_url || null)

  useEffect(() => {
    if (category) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        icon: category.icon || '',
        image_url: category.image_url || '',
        sort_order: category.sort_order || 0,
        is_active: category.is_active !== false // true by default
      })
      if (category.image_url) {
        setPreviewImage(category.image_url)
      }
    }
  }, [category])

  // Générateur de slug automatique
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD') // Sépare les accents
      .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplace caractères non-alphanumériques par des tirets
      .replace(/(^-|-$)+/g, '') // Enlève les tirets en début et fin
  }

  const handleNameChange = (e) => {
    const newName = e.target.value
    // Si on est en création (pas de category.id) et que le slug n'a pas été modifié manuellement
    // on auto-remplit le slug.
    if (!category && (!formData.slug || generateSlug(formData.name) === formData.slug)) {
      setFormData({ ...formData, name: newName, slug: generateSlug(newName) })
    } else {
      setFormData({ ...formData, name: newName })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
      setUploadError(null)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setFormData({ ...formData, image_url: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    let finalImageUrl = formData.image_url

    const file = fileInputRef.current?.files[0]
    if (file) {
      setUploading(true)
      setUploadError(null)
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${formData.slug || 'cat'}-${Date.now()}.${fileExt}`
        const filePath = `categories/${fileName}`

        const { error: uploadErr } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadErr) throw uploadErr

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        finalImageUrl = data.publicUrl
      } catch (err) {
        setUploadError("Erreur lors de l'upload de l'image : " + err.message)
        setUploading(false)
        return // Stop the submission
      }
      setUploading(false)
    }

    onSubmit({ ...formData, image_url: finalImageUrl })
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-premium-border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-navy">
          {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nom de la catégorie *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={handleNameChange}
              className="w-full h-10 px-3 rounded-lg border border-premium-border focus:border-navy focus:outline-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug (URL) *</label>
            <input 
              type="text" 
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-premium-border focus:border-navy focus:outline-none bg-gray-50"
            />
          </div>
        </div>

        {uploadError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
            {uploadError}
          </div>
        )}

        <div className="space-y-4 border border-premium-border p-4 rounded-lg bg-gray-50/50">
          <label className="text-sm font-medium text-gray-700 block">Image de la catégorie</label>
          
          {previewImage ? (
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-navy hover:text-navy hover:bg-gray-50 transition-colors cursor-pointer bg-white"
            >
              <UploadCloud size={32} className="mb-2" />
              <span className="text-sm font-medium">Cliquez pour uploader une image</span>
              <span className="text-xs text-gray-400 mt-1">Sera enregistrée dans product-images/categories/</span>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center space-x-2 pt-2">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Ou utiliser une URL :</span>
            <input 
              type="url" 
              value={formData.image_url}
              onChange={(e) => {
                setFormData({ ...formData, image_url: e.target.value })
                if(e.target.value) setPreviewImage(e.target.value)
              }}
              className="flex-1 h-9 px-3 rounded-md border border-premium-border focus:border-navy focus:outline-none text-sm bg-white"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Icône texte (Optionnel)</label>
            <input 
              type="text" 
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-premium-border focus:border-navy focus:outline-none"
              placeholder="Ex: Smartphone"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ordre d'affichage</label>
            <input 
              type="number" 
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full h-10 px-3 rounded-lg border border-premium-border focus:border-navy focus:outline-none"
            />
          </div>

          <div className="flex items-center pt-8">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span className="ml-2 font-medium text-navy">Catégorie active (visible)</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-navy hover:bg-navy-hover text-white" disabled={loading || uploading}>
            {loading || uploading ? 'Traitement...' : (category ? 'Mettre à jour' : 'Ajouter')}
            <Save size={16} className="ml-2" />
          </Button>
        </div>
      </form>
    </div>
  )
}
