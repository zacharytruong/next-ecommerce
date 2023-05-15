'use client';

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCartStore, useThemeStore } from '@/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import OrderAnimation from './OrderAnimation';
import { motion } from 'framer-motion';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const router = useRouter();
  const cartStore = useCartStore();
  const themeStore = useThemeStore();
  const [clientSecret, setClientSecret] = useState('');
  const [stripeTheme, setStripeTheme] = useState<'flat' | 'stripe' | 'night'>(
    'stripe'
  );

  useEffect(() => {
    // Set Stripe theme based on the user's preference
    if (themeStore.mode === 'dark') {
      setStripeTheme('night');
    } else {
      setStripeTheme('stripe');
    }
    // Create a payment intent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIntent
      })
    })
      .then((res) => {
        if (res.status === 403) {
          return router.push('/api/auth/signin');
        }
        return res.json();
      })
      .then((data) => {
        // Set client secret and the payment intent associated with it
        setClientSecret(data.paymentIntent.client_secret);
        cartStore.setPaymentIntent(data.paymentIntent.id);
      });
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: stripeTheme,
      labels: 'floating'
    }
  };
  return (
    <div>
      {!clientSecret && <OrderAnimation />}
      {clientSecret && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </motion.div>
      )}
    </div>
  );
}
