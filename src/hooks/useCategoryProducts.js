import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useCategoryProducts(categorySlug, page = 1, pageSize = 24) {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
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

        // 2. Trouver les produits avec pagination
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data: prodData, error: prodError, count } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name,
              slug
            )
          `, { count: 'exact' })
          .eq('category_id', catData.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .range(from, to)

        if (prodError) throw prodError
        
        setProducts(prodData || [])
        setTotalCount(count || 0)
      } catch (err) {
        console.error('Erreur useCategoryProducts:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryAndProducts()
  }, [categorySlug, page, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)

  return { category, products, totalCount, totalPages, loading, error }
}
