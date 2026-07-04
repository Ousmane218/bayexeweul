import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useCategoryProducts(categorySlug) {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      if (!categorySlug) return

      try {
        setLoading(true)
        setError(null)

        // 1. Trouver la catégorie
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', categorySlug)
          .eq('is_active', true)
          .maybeSingle()

        if (catError) throw catError
        if (!catData) {
          setError("Catégorie introuvable")
          setLoading(false)
          return
        }

        setCategory(catData)

        // 2. Trouver les produits
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name,
              slug
            )
          `)
          .eq('category_id', catData.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (prodError) throw prodError
        
        setProducts(prodData || [])
      } catch (err) {
        console.error('Erreur useCategoryProducts:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryAndProducts()
  }, [categorySlug])

  return { category, products, loading, error }
}
