import { Link } from 'react-router-dom'
import { useCart, type CartItem } from '../contexts/CartContext'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart()

  function calculateSubtotal(): number {
    return cartItems.reduce((sum, item) => sum + item.totalPriceCents, 0)
  }

  function calculateTax(): number {
    // Assuming 8.5% tax rate
    return Math.round(calculateSubtotal() * 0.12)
  }

  function calculateTotal(): number {
    return calculateSubtotal() + calculateTax()
  }

  function handleRemoveItem(itemId: string) {
    removeFromCart(itemId)
  }

  function handleUpdateQuantity(itemId: string, newQuantity: number) {
    updateQuantity(itemId, newQuantity)
  }

  function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`
  }

  function formatCustomization(item: CartItem): string {
    const parts: string[] = []
    
    // Size
    parts.push(item.size.charAt(0).toUpperCase() + item.size.slice(1))
    
    // Milk
    const milkLabel = item.milk === 'none' ? 'No Milk' : item.milk.charAt(0).toUpperCase() + item.milk.slice(1).replace(/([A-Z])/g, ' $1')
    parts.push(milkLabel)
    
    // Sugar
    if (item.sugarLevel === 0) {
      parts.push('No Sugar')
    } else {
      parts.push(`${item.sugarLevel}% Sugar`)
    }
    
    // Ice
    const iceLabel = item.icedLevel === 'regular' ? 'Regular Ice' : item.icedLevel === 'less' ? 'Less Ice' : 'No Ice'
    parts.push(iceLabel)
    
    return parts.join(' • ')
  }

  return (
    <div className="min-h-screen py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">
            Your Cart
          </h1>
          {cartItems.length === 0 && (
            <p className="text-text-light/60">Your cart is empty</p>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-24 h-24 text-text-light/20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-text-light mb-4">Your cart is empty</h2>
            <p className="text-text-light/60 mb-8 text-center max-w-md">
              Looks like you haven't added anything to your cart yet. Start exploring our menu!
            </p>
            <Link
              to="/menu"
              className="bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-background-dark/50 rounded-lg p-4 md:p-6 border border-text-light/10"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    {item.imageUrl && (
                      <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                        <img
                          src={item.imageUrl}
                          alt={item.drinkName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-text-light mb-1">
                            {item.drinkName}
                          </h3>
                          <p className="text-sm text-text-light/60 mb-2">
                            {formatCustomization(item)}
                          </p>
                          {item.note && (
                            <p className="text-sm text-text-light/40 italic">
                              Note: {item.note}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-text-light/40 hover:text-red-400 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border-2 border-text-light/30 hover:border-favorites text-text-light hover:text-favorites transition-colors flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-text-light font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border-2 border-text-light/30 hover:border-favorites text-text-light hover:text-favorites transition-colors flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-xl font-bold text-favorites">
                          {formatPrice(item.totalPriceCents)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-background-dark/50 rounded-lg p-4 md:p-6 border border-text-light/10 sticky top-24">
                <h2 className="text-2xl font-bold text-text-light mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-text-light/60">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-text-light/60">
                    <span>Tax</span>
                    <span>{formatPrice(calculateTax())}</span>
                  </div>
                  <div className="border-t border-text-light/20 pt-4 flex justify-between">
                    <span className="text-xl font-semibold text-text-light">Total</span>
                    <span className="text-2xl font-bold text-favorites">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-200 mb-4 text-center"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/menu"
                  className="block text-center text-text-light/60 hover:text-text-light transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

