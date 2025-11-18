import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart, type CartItem } from '../contexts/CartContext'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupTime: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    specialInstructions: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMoreTimeSlots, setShowMoreTimeSlots] = useState(false)

  // Generate time slots starting from current time, incrementing by 15 minutes
  function generateTimeSlots(): string[] {
    const slots: string[] = []
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Determine store hours based on day of week
    // Monday-Friday (1-5): 7 AM to 7 PM
    // Saturday-Sunday (0, 6): 8 AM to 8 PM
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const openingHour = isWeekend ? 8 : 7
    const openingMinute = isWeekend ? 0 : 0
    const closingHour = isWeekend ? 20 : 19 // 8 PM = 20:00, 7 PM = 19:00
    
    // Round up to next 15-minute interval
    let minute = Math.ceil(currentMinute / 15) * 15
    let hour = currentHour
    if (minute >= 60) {
      minute = 0
      hour++
    }
    
    // Start from opening time minimum
    if (hour < openingHour || (hour === openingHour && minute < openingMinute)) {
      hour = openingHour
      minute = openingMinute
    }
    
    // Generate slots until closing time
    while (hour < closingHour || (hour === closingHour && minute === 0)) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const displayTime = formatTimeDisplay(hour, minute)
      slots.push(`${timeString}|${displayTime}`)
      
      minute += 15
      if (minute >= 60) {
        minute = 0
        hour++
      }
    }
    
    return slots
  }

  function formatTimeDisplay(hour: number, minute: number): string {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  const allTimeSlots = generateTimeSlots()
  const initialTimeSlots = allTimeSlots.slice(0, 5)
  const remainingTimeSlots = allTimeSlots.slice(5)
  const hasMoreSlots = remainingTimeSlots.length > 0

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

    if (!formData.pickupTime) {
      alert('Please select a pickup time')
      return
    }

    if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
      alert('Please fill in all payment information')
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
          orderType: 'pickup',
          customerName: formData.name,
          pickupTime: formData.pickupTime
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

              {/* Pickup Time */}
              <div className="bg-background-dark/50 rounded-lg p-6 border border-text-light/10">
                <h2 className="text-xl font-bold text-text-light mb-4">Pickup Time</h2>
                <div>
                  <label className="block text-text-light font-medium mb-3">
                    Select Pickup Time <span className="text-red-400">*</span>
                  </label>
                  
                  {/* Time Slot Options - 3 Column Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Now Option */}
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date()
                        const roundedMinute = Math.ceil(now.getMinutes() / 15) * 15
                        const pickupTime = new Date(now)
                        pickupTime.setMinutes(roundedMinute, 0, 0)
                        if (roundedMinute >= 60) {
                          pickupTime.setHours(pickupTime.getHours() + 1)
                          pickupTime.setMinutes(0)
                        }
                        setFormData(prev => ({
                          ...prev,
                          pickupTime: pickupTime.toISOString()
                        }))
                      }}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        formData.pickupTime && new Date(formData.pickupTime).getTime() <= new Date().getTime() + 10 * 60000
                          ? 'border-favorites bg-favorites/10 text-text-light'
                          : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                      }`}
                    >
                      <div className="font-semibold mb-1">Now</div>
                      <div className="text-xs">5-10 min</div>
                      {formData.pickupTime && new Date(formData.pickupTime).getTime() <= new Date().getTime() + 10 * 60000 && (
                        <svg className="w-4 h-4 text-favorites mx-auto mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* First 4 Time Slots */}
                    {initialTimeSlots.slice(0, 4).map((slot, index) => {
                      const [timeValue, displayTime] = slot.split('|')
                      const [hour, minute] = timeValue.split(':').map(Number)
                      const slotDate = new Date()
                      slotDate.setHours(hour, minute, 0, 0)
                      // If the time is earlier than current time, set it to tomorrow
                      if (slotDate.getTime() < new Date().getTime()) {
                        slotDate.setDate(slotDate.getDate() + 1)
                      }
                      const slotISOString = slotDate.toISOString()
                      const isSelected = formData.pickupTime === slotISOString

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              pickupTime: slotISOString
                            }))
                          }}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            isSelected
                              ? 'border-favorites bg-favorites/10 text-text-light'
                              : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                          }`}
                        >
                          <div className="font-medium">{displayTime}</div>
                          {isSelected && (
                            <svg className="w-4 h-4 text-favorites mx-auto mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )
                    })}

                    {/* More Button */}
                    {hasMoreSlots && (
                      <button
                        type="button"
                        onClick={() => setShowMoreTimeSlots(!showMoreTimeSlots)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          showMoreTimeSlots
                            ? 'border-favorites bg-favorites/10 text-text-light'
                            : 'border-text-light/20 hover:border-favorites text-text-light/60 hover:text-favorites'
                        }`}
                      >
                        <div className="font-medium">{showMoreTimeSlots ? 'Show Less' : 'More'}</div>
                        {!showMoreTimeSlots && (
                          <div className="text-xs mt-1">{remainingTimeSlots.length} more</div>
                        )}
                      </button>
                    )}
                  </div>

                  {/* More Time Slots (shown when expanded) */}
                  {showMoreTimeSlots && remainingTimeSlots.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {remainingTimeSlots.map((slot, index) => {
                        const [timeValue, displayTime] = slot.split('|')
                        const [hour, minute] = timeValue.split(':').map(Number)
                        const slotDate = new Date()
                        slotDate.setHours(hour, minute, 0, 0)
                        // If the time is earlier than current time, set it to tomorrow
                        if (slotDate.getTime() < new Date().getTime()) {
                          slotDate.setDate(slotDate.getDate() + 1)
                        }
                        const slotISOString = slotDate.toISOString()
                        const isSelected = formData.pickupTime === slotISOString

                        return (
                          <button
                            key={index + 4}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                pickupTime: slotISOString
                              }))
                            }}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              isSelected
                                ? 'border-favorites bg-favorites/10 text-text-light'
                                : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                            }`}
                          >
                            <div className="font-medium">{displayTime}</div>
                            {isSelected && (
                              <svg className="w-4 h-4 text-favorites mx-auto mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  
                  <p className="text-sm text-text-light/60 mt-4">
                    Orders are typically ready in 15-20 minutes. Please select a time that works for you.
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-background-dark/50 rounded-lg p-6 border border-text-light/10">
                <h2 className="text-xl font-bold text-text-light mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-text-light font-medium mb-2">
                      Card Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="cardName" className="block text-text-light font-medium mb-2">
                      Cardholder Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-text-light font-medium mb-2">
                        Expiry Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-text-light font-medium mb-2">
                        CVV <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        maxLength={4}
                        placeholder="123"
                        className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

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

