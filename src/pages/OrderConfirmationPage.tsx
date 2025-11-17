import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function OrderConfirmationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { orderNumber, orderType, customerName } = location.state || {}

  useEffect(() => {
    // If no order data, redirect to menu
    if (!orderNumber) {
      navigate('/menu')
    }
  }, [orderNumber, navigate])

  if (!orderNumber) {
    return null
  }

  return (
    <div className="min-h-screen py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-favorites/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-favorites" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Order Confirmation Message */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-4">
          Order Confirmed!
        </h1>
        <p className="text-xl text-text-light/80 mb-2">
          Thank you, {customerName || 'Customer'}!
        </p>
        <p className="text-text-light/60 mb-8">
          Your order has been received and is being prepared.
        </p>

        {/* Order Details */}
        <div className="bg-background-dark/50 rounded-lg p-6 md:p-8 border border-text-light/10 mb-8">
          <div className="space-y-4">
            <div>
              <p className="text-text-light/60 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-favorites">{orderNumber}</p>
            </div>
            <div className="border-t border-text-light/20 pt-4">
              <p className="text-text-light/60 text-sm mb-1">Order Type</p>
              <p className="text-lg font-semibold text-text-light capitalize">
                {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
              </p>
            </div>
            {orderType === 'pickup' && (
              <div className="bg-favorites/10 rounded-lg p-4 border border-favorites/30">
                <p className="text-text-light font-medium mb-2">Pickup Information</p>
                <p className="text-text-light/80 text-sm">
                  Your order will be ready for pickup in approximately 15-20 minutes.
                </p>
                <p className="text-text-light/80 text-sm mt-2">
                  Location: 123 Coffee Street, San Francisco, CA 94102
                </p>
              </div>
            )}
            {orderType === 'delivery' && (
              <div className="bg-favorites/10 rounded-lg p-4 border border-favorites/30">
                <p className="text-text-light font-medium mb-2">Delivery Information</p>
                <p className="text-text-light/80 text-sm">
                  Your order will be delivered within 30-45 minutes.
                </p>
                <p className="text-text-light/80 text-sm mt-2">
                  You will receive a confirmation email shortly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/menu"
            className="bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            Order Again
          </Link>
          <Link
            to="/"
            className="bg-background-dark/50 hover:bg-background-dark/70 border border-text-light/20 text-text-light font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

