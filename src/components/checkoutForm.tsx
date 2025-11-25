import {CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements} from "@stripe/react-stripe-js"
import { useState, type FormEvent, useEffect } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

interface CheckoutFormProps {
    totalPriceCents: number
    currentOrderId: string
    clientSecret: string
    isCheckoutReady: boolean
    onPaymentSuccess: (paymentIntentId: string) => void
}

export default function CheckoutForm({ totalPriceCents, currentOrderId, clientSecret, isCheckoutReady, onPaymentSuccess }: CheckoutFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState<string | null>(null)
    const [isPaying, setIsPaying] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [cardholderName, setCardholderName] = useState<string>('')

    
    useEffect(() => {
        console.log("CheckoutForm mounted", {
            totalPriceCents,
            currentOrderId,
            stripeReady: !!stripe,
            elementsReady: !!elements,
            clientSecret: !!clientSecret,
            isPaying,
            isSuccess,
        })
    }, [totalPriceCents, currentOrderId, stripe, elements, clientSecret, isPaying, isSuccess])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSuccess(false)
        setError(null)

        if (!stripe || !elements) {
            console.warn('Stripe or Elements not ready, skipping payment')
            return
        } 

        const cardNumberElement = elements.getElement(CardNumberElement)
        const cardExpiryElement = elements.getElement(CardExpiryElement)
        const cardCvcElement = elements.getElement(CardCvcElement)
        
        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
            setError('Card elements not found')
            return
        }

        setIsPaying(true)
        console.log('Attempting to confirm card payment...')

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumberElement,
                billing_details: {
                    name: cardholderName || 'Test User',
                },
            },
        })

        console.log("Stripe payment result:", {
            error: result.error,
            status: result.paymentIntent?.status,
            paymentIntentId: result.paymentIntent?.id,
        });

        if (result.error) {
            setError(result.error.message || 'Payment failed')
            setIsPaying(false)
            return
        }

        if (result.paymentIntent?.status === 'succeeded') {
            setIsSuccess(true)
            setIsPaying(false)
            
            // Call the success callback
            if (result.paymentIntent.id) {
                onPaymentSuccess(result.paymentIntent.id)
            }
            
            try {
                const url = API_BASE_URL ? `${API_BASE_URL}/payments/confirm-payment` : '/payments/confirm-payment'
                console.log('Confirming payment at:', url)
                
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentIntentId: result.paymentIntent.id,
                        orderId: currentOrderId,
                        amountCents: totalPriceCents,
                    }),
                })
            } catch (error) {
                console.error('Error confirming payment:', error)
            }
        }
    }

    if (isSuccess) {
        return (
          <div className="space-y-4 text-text-light">
            <h2 className="text-2xl font-semibold">Payment successful 🎉</h2>
            <p>Your order has been paid. Thank you!</p>
          </div>
        );
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-4">
            <div>
              <label className="block text-text-light font-medium mb-2">
                Name on Card <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-text-light font-medium mb-2">
                Card Number <span className="text-red-400">*</span>
              </label>
              <div 
                className="px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg min-h-[50px] relative"
                style={{ 
                  minHeight: '50px',
                  zIndex: 1,
                }}
              >
                <CardNumberElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#f5f5f5',
                        fontFamily: 'system-ui, sans-serif',
                        '::placeholder': {
                          color: '#a0a0a0',
                        },
                      },
                      invalid: {
                        color: '#ef4444',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text-light font-medium mb-2">
                  Expiry Date <span className="text-red-400">*</span>
                </label>
                <div 
                  className="px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg min-h-[50px] relative"
                  style={{ 
                    minHeight: '50px',
                    zIndex: 1,
                  }}
                >
                  <CardExpiryElement 
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#f5f5f5',
                          fontFamily: 'system-ui, sans-serif',
                          '::placeholder': {
                            color: '#a0a0a0',
                          },
                        },
                        invalid: {
                          color: '#ef4444',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-light font-medium mb-2">
                  CVV <span className="text-red-400">*</span>
                </label>
                <div 
                  className="px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg min-h-[50px] relative"
                  style={{ 
                    minHeight: '50px',
                    zIndex: 1,
                  }}
                >
                  <CardCvcElement 
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#f5f5f5',
                          fontFamily: 'system-ui, sans-serif',
                          '::placeholder': {
                            color: '#a0a0a0',
                          },
                        },
                        invalid: {
                          color: '#ef4444',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
    
          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}
    
          {!isCheckoutReady && (
            <p className="text-xs text-text-light/60">
              Fill in your name, email, phone, and pickup time before paying.
            </p>
          )}
    
          <button
            type="submit"
            disabled={!stripe || isPaying || !isCheckoutReady}
            className="w-full bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPaying
              ? "Processing..."
              : `Pay ${(totalPriceCents / 100).toFixed(2)} CAD`}
          </button>
    
          <p className="text-xs text-text-light/60 mt-1">
            Use Stripe test card: 4242 4242 4242 4242, any future expiry, any CVC.
          </p>
        </form>
      );
    }