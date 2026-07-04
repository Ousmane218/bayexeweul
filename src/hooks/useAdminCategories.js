import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error: supaError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (supaError) throw supaError
      setCategories(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const addCategory = async (categoryData) => {
    try {
      const { error } = await supabase
        .from('categories')
        .insert([categoryData])

      if (error) throw error
      await fetchCategories()
      return { success: true }
    } catch (err) {
      console.error('Error adding category:', err)
      return { success: false, error: err.message }
    }
  }

  const updateCategory = async (id, categoryData) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)

      if (error) throw error
      await fetchCategories()
      return { success: true }
    } catch (err) {
      console.error('Error updating category:', err)
      return { success: false, error: err.message }
    }
  }

  const deleteCategory = async (id) => {
    try {
      // 1. Check if category is used in products
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id)

      if (countError) throw countError

      if (count > 0) {
        return { success: false, error: "Impossible de supprimer cette catégorie car elle contient des produits." }
      }

      // 2. Delete if safe
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchCategories()
      return { success: true }
    } catch (err) {
      console.error('Error deleting category:', err)
      return { success: false, error: err.message }
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    return await updateCategory(id, { is_active: !currentStatus })
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleStatus
  }
}
