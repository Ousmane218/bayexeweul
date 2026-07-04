import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      // Jointure simple sur categories pour récupérer le nom de la catégorie
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error("Erreur fetchProducts:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Helper pour uploader l'image
  const uploadImage = async (file) => {
    if (!file) return null
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}` // Stockage à la racine du bucket

    const { error: uploadError, data } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  // Helper pour extraire le chemin de l'image depuis l'URL publique
  const getStoragePathFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/storage/v1/object/public/product-images/')
    if (parts.length > 1) {
      return parts[1]
    }
    return null;
  }

  const addProduct = async (productData, imageFile) => {
    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ ...productData, image_url: imageUrl }])
        .select()

      if (error) throw error
      
      await fetchProducts()
      return { success: true, data }
    } catch (err) {
      console.error("Erreur addProduct:", err)
      return { success: false, error: err.message }
    }
  }

  const updateProduct = async (id, productData, imageFile) => {
    try {
      let imageUrl = productData.image_url
      if (imageFile) {
        // Upload nouvelle image
        imageUrl = await uploadImage(imageFile)
        
        // Supprimer l'ancienne image si elle existait (optionnel, on garde ça simple et robuste)
        if (productData.image_url) {
          const oldPath = getStoragePathFromUrl(productData.image_url)
          if (oldPath) {
             supabase.storage.from('product-images').remove([oldPath])
          }
        }
      }

      // Nettoyer category de l'objet pour l'update sinon Supabase va râler sur la jointure (si on la passe)
      const dataToUpdate = { ...productData, image_url: imageUrl }
      delete dataToUpdate.categories

      const { data, error } = await supabase
        .from('products')
        .update(dataToUpdate)
        .eq('id', id)
        .select()

      if (error) throw error
      
      await fetchProducts()
      return { success: true, data }
    } catch (err) {
      console.error("Erreur updateProduct:", err)
      return { success: false, error: err.message }
    }
  }

  const deleteProduct = async (id, imageUrl) => {
    try {
      // 1. Supprimer l'image du bucket si elle existe
      if (imageUrl) {
        const path = getStoragePathFromUrl(imageUrl)
        if (path) {
          const { error: storageError } = await supabase.storage
            .from('product-images')
            .remove([path])
          
          if (storageError) {
            console.warn("Avertissement: Impossible de supprimer l'image associée:", storageError.message)
            // Ne pas bloquer la suppression du produit
          }
        }
      }

      // 2. Supprimer le produit
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchProducts()
      return { success: true }
    } catch (err) {
      console.error("Erreur deleteProduct:", err)
      return { success: false, error: err.message }
    }
  }

  const toggleProductStatus = async (id, field, value) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ [field]: value })
        .eq('id', id)

      if (error) throw error
      
      // Mise à jour optimiste du state local
      setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p))
      return { success: true }
    } catch (err) {
      console.error("Erreur toggleStatus:", err)
      return { success: false, error: err.message }
    }
  }

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus
  }
}
