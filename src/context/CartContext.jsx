import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useToast } from './ToastContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('bayexeweul_cart')
    if (savedCart) {
      try {
        return JSON.parse(savedCart)
      } catch (err) {
        console.error("Erreur de parsing du panier:", err)
        return []
      }
    }
    return []
  })

  const { addToast } = useToast()

  // Sauvegarde dans le localStorage à chaque changement du panier
  useEffect(() => {
    localStorage.setItem('bayexeweul_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      addToast("Ce produit est actuellement en rupture de stock.", "error")
      return
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        // Vérifier si la nouvelle quantité dépasse le stock
        if (existingItem.quantity >= product.stock) {
          addToast(`Désolé, il ne reste que ${product.stock} article(s) en stock pour ce produit.`, "warning")
          return prev
        }
        
        const newQuantity = existingItem.quantity + quantity
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: Math.min(newQuantity, product.stock) } : item
        )
      }
      
      // Nouveau produit
      const addedQuantity = Math.min(quantity, product.stock)
      return [...prev, { ...product, quantity: addedQuantity }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        // Ne pas dépasser le stock et ne pas descendre en dessous de 1
        if (quantity > item.stock) {
           addToast(`Désolé, il ne reste que ${item.stock} article(s) en stock.`, "warning")
           return item
        }
        const validQuantity = Math.max(1, quantity)
        return { ...item, quantity: validQuantity }
      }
      return item
    }))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cartItems])

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider')
  }
  return context
}
