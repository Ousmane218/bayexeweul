import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useProduct(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return

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
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle()

        if (error) throw error
        
        if (!data) {
           setError("Produit introuvable")
        } else {
           setProduct(data)
        }
        
      } catch (err) {
        console.error('Erreur useProduct:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return { product, loading, error }
}
