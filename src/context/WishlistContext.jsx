/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('wishlists')
        .select('*, products(*)')
        .eq('user_id', user.id)
      
      if (error) throw error
      setWishlistItems(data || [])
    } catch (error) {
      console.error('Erreur chargement wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchWishlist()
    } else {
      setWishlistItems([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId)
  }

  const addToWishlist = async (productId) => {
    if (!user) return false

    try {
      // Optimistic UI
      const newItem = { id: 'temp-' + Date.now(), product_id: productId, user_id: user.id, products: { id: productId } }
      setWishlistItems(prev => [...prev, newItem])

      const { data, error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: productId })
        .select('*, products(*)')
        .single()
        
      if (error) throw error
      
      // Update with real data
      setWishlistItems(prev => prev.map(item => item.id === newItem.id ? data : item))
      return true
    } catch (error) {
      console.error('Erreur ajout wishlist:', error)
      // Revert Optimistic UI
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId))
      return false
    }
  }

  const removeFromWishlist = async (productId) => {
    if (!user) return false

    try {
      // Optimistic UI
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId))

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        
      if (error) throw error
      return true
    } catch (error) {
      console.error('Erreur suppression wishlist:', error)
      // Revert Optimistic UI
      fetchWishlist()
      return false
    }
  }

  const toggleWishlist = async (productId) => {
    if (!user) return false
    
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId)
    } else {
      return await addToWishlist(productId)
    }
  }

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      loading, 
      isInWishlist, 
      addToWishlist, 
      removeFromWishlist, 
      toggleWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
