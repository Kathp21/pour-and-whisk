import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart, type CartItem } from '../contexts/CartContext'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    specialInstructions: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function calculateSubtotal(): number {
    return cartItems.reduce((sum, item) => sum + item.totalPriceCents, 0)
  }

  function calculateTax(): number {
    // Assuming 8.5% tax rate
    return Math.round(calculateSubtotal() * 0.12)
  }

  function calculateDeliveryFee(): number {
    return orderType === 'delivery' ? 300 : 0 // $3.00 delivery fee
  }

  function calculateTotal(): number {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee()
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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }

    if (orderType === 'delivery' && (!formData.address || !formData.city || !formData.postalCode)) {
      alert('Please fill in delivery address information')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Clear cart after successful order
      clearCart()
      setIsSubmitting(false)
      // Navigate to order confirmation page (or show success message)
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: `ORD-${Date.now()}`,
          orderType,
          customerName: formData.name
        } 
      })
    }, 1500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-4">
            Your cart is empty
          </h1>
          <p className="text-text-light/60 mb-8">
            Please add items to your cart before checkout.
          </p>
          <Link
            to="/menu"
            className="inline-block bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="text-favorites hover:text-white mb-4 flex items-center gap-2 inline-block"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Order Details & Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type Selection */}
              <div className="bg-background-dark/50 rounded-lg p-6 border border-text-light/10">
                <h2 className="text-xl font-bold text-text-light mb-4">Order Type</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      orderType === 'pickup'
                        ? 'border-favorites bg-favorites/10 text-text-light'
                        : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                    }`}
                  >
                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="font-semibold">Pickup</div>
                    <div className="text-sm mt-1">Pick up at store</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      orderType === 'delivery'
                        ? 'border-favorites bg-favorites/10 text-text-light'
                        : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                    }`}
                  >
                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div className="font-semibold">Delivery</div>
                    <div className="text-sm mt-1">Delivered to you</div>
                  </button>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-background-dark/50 rounded-lg p-6 border border-text-light/10">
                <h2 className="text-xl font-bold text-text-light mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-text-light font-medium mb-2">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-text-light font-medium mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-text-light font-medium mb-2">
                        Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address (only show if delivery selected) */}
              {orderType === 'delivery' && (
                <div className="bg-background-dark/50 rounded-lg p-6 border border-text-light/10">
                  <h2 className="text-xl font-bold text-text-light mb-4">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-text-light font-medium mb-2">
                        Street Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required={orderType === 'delivery'}
                        className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-text-light font-medium mb-2">
                          City <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required={orderType === 'delivery'}
                          className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                          placeholder="Vancouver"
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-text-light font-medium mb-2">
                          Postal Code <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required={orderType === 'delivery'}
                          className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                          placeholder="V5K 1R4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="bg-background-dark/50 rounded-lg p-6 border border-text-light/10">
                <h2 className="text-xl font-bold text-text-light mb-4">Special Instructions</h2>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors resize-none"
                  placeholder="Any special instructions for your order..."
                />
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-background-dark/50 rounded-lg p-6 border border-text-light/10 sticky top-24">
                <h2 className="text-xl font-bold text-text-light mb-6">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-text-light/10 last:border-0">
                      {item.imageUrl && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
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
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-text-light mb-1 truncate">
                          {item.drinkName}
                        </h3>
                        <p className="text-xs text-text-light/60 mb-1 line-clamp-2">
                          {formatCustomization(item)}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-favorites">
                            {formatPrice(item.totalPriceCents)}
                          </p>
                          <span className=" bg-favorites text-background-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-8">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-text-light/20 pt-4 mb-6">
                  <div className="flex justify-between text-text-light/80">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-text-light/80">
                    <span>Tax (12%)</span>
                    <span>{formatPrice(calculateTax())}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-text-light/80">
                      <span>Delivery Fee</span>
                      <span>{formatPrice(calculateDeliveryFee())}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold text-favorites mb-6 border-t border-text-light/20 pt-4">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-button-primary hover:bg-button-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-text-light font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-200 mb-4"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>

                <Link
                  to="/cart"
                  className="block text-center text-text-light/60 hover:text-text-light transition-colors"
                >
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

