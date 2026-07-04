import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useProducts(options = {}) {
  const { limit = 12 } = options
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name,
              slug
            )
          `)
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) throw error
        
        setProducts(data || [])
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [limit])

  return { products, loading, error }
}
