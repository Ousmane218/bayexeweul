import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

export function useSearchProducts(searchParams) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const min = searchParams.get('min') || ''
  const max = searchParams.get('max') || ''
  const stock = searchParams.get('stock') === 'true'
  const featured = searchParams.get('featured') === 'true'
  const sort = searchParams.get('sort') || 'recent'

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true)
        setError(null)

        // 1. Construction de la requête Supabase
        // On utilise un inner join si une catégorie est spécifiée pour filtrer directement dessus
        const selectQuery = category 
          ? '*, categories!inner(id, name, slug)' 
          : '*, categories(id, name, slug)'

        let queryBuilder = supabase
          .from('products')
          .select(selectQuery)
          .eq('is_active', true)

        // Filtre de catégorie exacte (via inner join)
        if (category) {
          queryBuilder = queryBuilder.eq('categories.slug', category)
        }

        // Filtres de prix
        if (min && !isNaN(min)) {
          queryBuilder = queryBuilder.gte('price', parseInt(min))
        }
        if (max && !isNaN(max)) {
          queryBuilder = queryBuilder.lte('price', parseInt(max))
        }

        // Filtres booléens
        if (stock) {
          queryBuilder = queryBuilder.gt('stock', 0)
        }
        if (featured) {
          queryBuilder = queryBuilder.eq('is_featured', true)
        }

        // Tri
        switch (sort) {
          case 'price_asc':
            queryBuilder = queryBuilder.order('price', { ascending: true })
            break
          case 'price_desc':
            queryBuilder = queryBuilder.order('price', { ascending: false })
            break
          case 'name_asc':
            queryBuilder = queryBuilder.order('name', { ascending: true })
            break
          case 'name_desc':
            queryBuilder = queryBuilder.order('name', { ascending: false })
            break
          case 'recent':
          default:
            queryBuilder = queryBuilder.order('created_at', { ascending: false })
            break
        }

        const { data: results, error: supaError } = await queryBuilder

        if (supaError) throw supaError

        // 2. Filtrage Frontend pour le texte libre (Nom, Description, Nom de Catégorie)
        // car faire un OR entre la table principale et une jointure est limitant sur Supabase
        let finalResults = results || []
        
        if (q) {
          const lowerQ = q.toLowerCase().trim()
          finalResults = finalResults.filter(product => {
            const matchName = product.name?.toLowerCase().includes(lowerQ)
            const matchDesc = product.description?.toLowerCase().includes(lowerQ)
            const matchCat = product.categories?.name?.toLowerCase().includes(lowerQ)
            return matchName || matchDesc || matchCat
          })
        }

        setData(finalResults)
      } catch (err) {
        console.error('Search error:', err)
        setError('Une erreur est survenue lors de la recherche.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [q, category, min, max, stock, featured, sort])

  // Memoize active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (category) count++
    if (min) count++
    if (max) count++
    if (stock) count++
    if (featured) count++
    return count
  }, [category, min, max, stock, featured])

  return { 
    products: data, 
    loading, 
    error,
    activeFiltersCount
  }
}
