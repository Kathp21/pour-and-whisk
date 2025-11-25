import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useState, useEffect } from "react"
import CheckoutForm from "./checkoutForm"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

interface PaymentRootProps {
    totalPriceCents: number
    currentOrderId: string
    isCheckoutReady: boolean
    onPaymentSuccess: (paymentIntentId: string) => void
}

export default function PaymentRoot({ totalPriceCents, currentOrderId, isCheckoutReady, onPaymentSuccess }: PaymentRootProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setError(null);
        setClientSecret(null);
    
        const url = API_BASE_URL ? `${API_BASE_URL}/payments/create-payment-intent` : '/payments/create-payment-intent'
        console.log('Creating payment intent at:', url)
    
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amountCents: totalPriceCents,
            orderId: currentOrderId,
          }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.error || `API error: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            setClientSecret(data.clientSecret);
          })
          .catch((err) => {
            console.error(err);
            setError(err.message || "Failed to initialize payment");
          });
      }, [totalPriceCents, currentOrderId]);
    
      if (error) {
        return (
          <div className="text-red-400">
            Failed to start payment: {error}
          </div>
        );
      }
    if (!clientSecret) {
        return <div>Loading...</div>
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
                totalPriceCents={totalPriceCents} 
                currentOrderId={currentOrderId} 
                clientSecret={clientSecret}
                isCheckoutReady={isCheckoutReady}
                onPaymentSuccess={onPaymentSuccess}
            />
        </Elements>
    )
}