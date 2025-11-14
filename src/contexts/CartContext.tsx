import { createContext, useContext, useState, type ReactNode } from 'react'

export interface CartItem {
  id: string
  drinkId: string
  drinkName: string
  imageUrl?: string
  size: string
  milk: string
  sugarLevel: number
  icedLevel: string
  quantity: number
  totalPriceCents: number
  note?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'id'>) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  function addToCart(item: Omit<CartItem, 'id'>) {
    // Generate a unique ID for the cart item
    const newItem: CartItem = {
      ...item,
      id: `${item.drinkId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    setCartItems(prevItems => [...prevItems, newItem])
  }

  function removeFromCart(itemId: string) {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) {
      removeFromCart(itemId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              // Recalculate price based on unit price
              totalPriceCents: Math.round((item.totalPriceCents / item.quantity) * quantity)
            }
          : item
      )
    )
  }

  function clearCart() {
    setCartItems([])
  }

  function getCartItemCount(): number {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

