import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        // On récupère les catégories actives et on les trie par sort_order
        // Note: On suppose qu'il y a une colonne 'is_active' dans la base de données.
        // Si ce n'est pas le cas, on peut l'enlever.
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (error) throw error
        
        setCategories(data || [])
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
