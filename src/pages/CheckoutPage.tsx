import { useState, useRef, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart, type CartItem } from '../contexts/CartContext'
import PaymentRoot from '../components/paymentRoot'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupTime: '',
    specialInstructions: '',
  })

  const [showMoreTimeSlots, setShowMoreTimeSlots] = useState(false)
  
  // Track when user first visits checkout page (order start time)
  // Initialize immediately so it's available on first render
  const orderStartTimeRef = useRef<Date>(new Date())
  
  function formatTimeDisplay(hour: number, minute: number): string {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
  }
  
  // Generate time slots starting from order start time + 15 minutes, incrementing by 15 minutes
  const allTimeSlots = useMemo(() => {
    const slots: string[] = []
    
    // Calculate minimum pickup time: order start time + 15 minutes
    const minPickupTime = new Date(orderStartTimeRef.current)
    minPickupTime.setMinutes(minPickupTime.getMinutes() + 15)
    
    // Round up to next 15-minute interval
    let minute = Math.ceil(minPickupTime.getMinutes() / 15) * 15
    let hour = minPickupTime.getHours()
    if (minute >= 60) {
      minute = 0
      hour++
    }
    
    const dayOfWeek = minPickupTime.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Determine store hours based on day of week
    // Monday-Friday (1-5): 7 AM to 7 PM
    // Saturday-Sunday (0, 6): 8 AM to 8 PM
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const openingHour = isWeekend ? 8 : 7
    const openingMinute = isWeekend ? 0 : 0
    const closingHour = isWeekend ? 20 : 19 // 8 PM = 20:00, 7 PM = 19:00
    
    // Ensure we don't start before store opening time
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
  }, []) // Empty dependency array since orderStartTimeRef is initialized once and shouldn't change

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

  async function placeOrder(paymentIntentId?: string) {
    try {
      // Format pickupTime - extract time in HH:MM format to match backend
      // When user selects a time slot, setHours() sets it in local time, then toISOString() converts to UTC
      // We need to extract the original local time that was selected (e.g., 6:15 PM -> "18:15")
      let formattedPickupTime = formData.pickupTime
      if (formData.pickupTime && formData.pickupTime.includes('T')) {
        // Parse the ISO string - JavaScript Date automatically handles UTC to local conversion
        const date = new Date(formData.pickupTime)
        // getHours() and getMinutes() return local time, which is what we want
        // This gives us the time that was originally set with setHours() before toISOString()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        formattedPickupTime = `${hours}:${minutes}`
      }
      
      const requestBody: any = {
        type: "PICKUP",
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        lines: cartItems.map(item => ({
          drinkId: item.drinkId,
          quantity: item.quantity,
          size: item.size,
          milk: item.milk,
          sugarLevel: item.sugarLevel,
          icedLevel: item.icedLevel,
        })),
        tipCents: 0,
        priceCents: calculateTotal(),
        pickupTime: formattedPickupTime,
        specialInstructions: formData.specialInstructions || undefined,
      }
      
      // Include payment intent ID if provided
      if (paymentIntentId) {
        requestBody.paymentIntentId = paymentIntentId
      }
      
      console.log('Placing order with data:', JSON.stringify(requestBody, null, 2))
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to place order'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || `Server error: ${response.status} ${response.statusText}`
          console.error('Order placement error details:', errorData)
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      console.log('Order placed successfully:', data)
      return data.orderId || data.id
    } catch (error) {
      console.error('Error placing order:', error)
      throw error
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Check if all required checkout fields are filled
  const isCheckoutReady = 
    !!(formData.name && formData.email && formData.phone && formData.pickupTime)

  // Generate order ID
  const currentOrderId = useMemo(() => `ORD-${Date.now()}`, [])

  async function handlePaymentSuccess(paymentIntentId: string) {
    try {
      // Place the order in the backend after successful payment
      const orderId = await placeOrder(paymentIntentId)
      
      // Clear cart and navigate to confirmation
      clearCart();
      navigate("/order-confirmation", {
        state: {
          orderNumber: orderId || currentOrderId,
          orderType: "pickup",
          customerName: formData.name,
          pickupTime: formData.pickupTime,
        },
      });
    } catch (error) {
      console.error('Error placing order after payment:', error)
      // Still navigate to confirmation even if order creation fails
      // The payment was successful, so we should still show confirmation
      clearCart();
      navigate("/order-confirmation", {
        state: {
          orderNumber: currentOrderId,
          orderType: "pickup",
          customerName: formData.name,
          pickupTime: formData.pickupTime,
        },
      });
    }
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
                    {/* First 5 Time Slots */}
                    {initialTimeSlots.map((slot, index) => {
                      const [timeValue, displayTime] = slot.split('|')
                      const [hour, minute] = timeValue.split(':').map(Number)
                      
                      // Create date for this slot using order start time's date
                      const slotDate = orderStartTimeRef.current 
                        ? new Date(orderStartTimeRef.current)
                        : new Date()
                      
                      slotDate.setHours(hour, minute, 0, 0)
                      
                      // If the time is earlier than order start time + 15 min, set it to tomorrow
                      if (orderStartTimeRef.current) {
                        const minPickupTime = new Date(orderStartTimeRef.current)
                        minPickupTime.setMinutes(minPickupTime.getMinutes() + 15)
                        if (slotDate.getTime() < minPickupTime.getTime()) {
                          slotDate.setDate(slotDate.getDate() + 1)
                        }
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
                          className={`p-4 rounded-lg border-2 transition-colors h-20 flex flex-col items-center justify-center ${
                            isSelected
                              ? 'border-favorites bg-favorites/10 text-text-light'
                              : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                          }`}
                        >
                          <div className="font-medium">{displayTime}</div>
                          {isSelected && (
                            <svg className="w-4 h-4 text-favorites mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )
                    })}

                    {/* More Button (only show when not expanded) - appears next to 6PM slot */}
                    {hasMoreSlots && !showMoreTimeSlots && (
                      <button
                        type="button"
                        onClick={() => setShowMoreTimeSlots(!showMoreTimeSlots)}
                        className="p-4 rounded-lg border-2 transition-colors h-20 flex flex-col items-center justify-center border-text-light/20 hover:border-favorites text-text-light/60 hover:text-favorites"
                      >
                        <div className="font-medium">More</div>
                        {/* <div className="text-xs mt-1">{remainingTimeSlots.length} more</div> */}
                      </button>
                    )}

                    {/* First remaining slot (6:15PM) - appears in More button's position when expanded */}
                    {showMoreTimeSlots && remainingTimeSlots.length > 0 && (() => {
                      const firstRemainingSlot = remainingTimeSlots[0]
                      const [timeValue, displayTime] = firstRemainingSlot.split('|')
                      const [hour, minute] = timeValue.split(':').map(Number)
                      
                      const slotDate = orderStartTimeRef.current 
                        ? new Date(orderStartTimeRef.current)
                        : new Date()
                      
                      slotDate.setHours(hour, minute, 0, 0)
                      
                      if (orderStartTimeRef.current) {
                        const minPickupTime = new Date(orderStartTimeRef.current)
                        minPickupTime.setMinutes(minPickupTime.getMinutes() + 15)
                        if (slotDate.getTime() < minPickupTime.getTime()) {
                          slotDate.setDate(slotDate.getDate() + 1)
                        }
                      }
                      
                      const slotISOString = slotDate.toISOString()
                      const isSelected = formData.pickupTime === slotISOString

                      return (
                        <button
                          key="first-remaining"
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              pickupTime: slotISOString
                            }))
                          }}
                          className={`p-4 rounded-lg border-2 transition-colors h-20 flex flex-col items-center justify-center ${
                            isSelected
                              ? 'border-favorites bg-favorites/10 text-text-light'
                              : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                          }`}
                        >
                          <div className="font-medium">{displayTime}</div>
                          {isSelected && (
                            <svg className="w-4 h-4 text-favorites mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )
                    })()}
                  </div>

                  {/* More Time Slots (shown when expanded) - remaining slots after the first one */}
                  {showMoreTimeSlots && remainingTimeSlots.length > 1 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {remainingTimeSlots.slice(1).map((slot, index) => {
                        const [timeValue, displayTime] = slot.split('|')
                        const [hour, minute] = timeValue.split(':').map(Number)
                        
                        // Create date for this slot using order start time's date
                        const slotDate = orderStartTimeRef.current 
                          ? new Date(orderStartTimeRef.current)
                          : new Date()
                        
                        slotDate.setHours(hour, minute, 0, 0)
                        
                        // If the time is earlier than order start time + 15 min, set it to tomorrow
                        if (orderStartTimeRef.current) {
                          const minPickupTime = new Date(orderStartTimeRef.current)
                          minPickupTime.setMinutes(minPickupTime.getMinutes() + 15)
                          if (slotDate.getTime() < minPickupTime.getTime()) {
                            slotDate.setDate(slotDate.getDate() + 1)
                          }
                        }
                        
                        const slotISOString = slotDate.toISOString()
                        const isSelected = formData.pickupTime === slotISOString

                        return (
                          <button
                            key={index + 6}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                pickupTime: slotISOString
                              }))
                            }}
                            className={`p-4 rounded-lg border-2 transition-colors h-20 flex flex-col items-center justify-center ${
                              isSelected
                                ? 'border-favorites bg-favorites/10 text-text-light'
                                : 'border-text-light/20 hover:border-text-light/40 text-text-light/60'
                            }`}
                          >
                            <div className="font-medium">{displayTime}</div>
                            {isSelected && (
                              <svg className="w-4 h-4 text-favorites mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        )
                      })}
                      
                      {/* Show Less Button at the end */}
                      <button
                        type="button"
                        onClick={() => setShowMoreTimeSlots(false)}
                        className="p-4 rounded-lg border-2 transition-colors h-20 flex flex-col items-center justify-center border-text-light/20 hover:border-favorites text-text-light/60 hover:text-favorites"
                      >
                        <div className="font-medium">Show Less</div>
                      </button>
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
                <PaymentRoot
                  totalPriceCents={calculateTotal()}
                  currentOrderId={currentOrderId}
                  isCheckoutReady={isCheckoutReady}
                  onPaymentSuccess={handlePaymentSuccess}
                />
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

                <Link
                  to="/cart"
                  className="block text-center text-text-light/60 hover:text-text-light transition-colors"
                >
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

