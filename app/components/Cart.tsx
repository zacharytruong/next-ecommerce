'use client';

import Image from 'next/image';
import { useCartStore } from '@/store';
import formatPrice from '@/util/PriceFormat';
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5';
import { BsFillBasket3Fill } from 'react-icons/bs';
import { AnimatePresence, motion } from 'framer-motion';
import Checkout from './Checkout';
import OrderConfirmed from './OrderConfirmed';

export default function Cart() {
  const cartStore = useCartStore();

  // Total Price
  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => cartStore.toggleCart()}
      className="fixed w-full h-screen left-0 top-0 bg-black/25"
    >
      {/* Cart */}
      <motion.div
        layout
        onClick={(e) => e.stopPropagation()}
        className="bg-base-200 absolute right-0 top-0 h-screen p-12 overflow-y-scroll w-full lg:w-2/5"
      >
        {cartStore.onCheckout === 'cart' && (
          <button
            onClick={() => cartStore.toggleCart()}
            className="text-sm font-bold pb-12"
          >
            Back to Store 🏃🏻‍♂️
          </button>
        )}
        {cartStore.onCheckout === 'checkout' && (
          <button
            onClick={() => cartStore.setCheckout('cart')}
            className="text-sm font-bold pb-12"
          >
            Check your cart 🛒
          </button>
        )}
        {/* Cart Items */}
        {cartStore.onCheckout === 'cart' && (
          <>
            {cartStore.cart.map((item) => (
              <motion.div layout key={item.id} className="flex my-4 rounded-lg p-4 gap-4 bg-base-100">
                <Image
                  className="rounded-md h-24"
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={120}
                  priority
                />
                <motion.div layout>
                  <h2>{item.name}</h2>
                  {/* Update quantity of a product */}
                  <div className="flex gap-2">
                    <h2>
                      Quantity:
                      <button
                        onClick={() =>
                          cartStore.removeProduct({
                            id: item.id,
                            image: item.image,
                            name: item.name,
                            unit_amount: item.unit_amount,
                            quantity: item.quantity
                          })
                        }
                      >
                        {<IoRemoveCircle />}
                      </button>
                      {item.quantity}
                      <button
                        onClick={() =>
                          cartStore.addProduct({
                            id: item.id,
                            image: item.image,
                            name: item.name,
                            unit_amount: item.unit_amount,
                            quantity: item.quantity
                          })
                        }
                      >
                        {<IoAddCircle />}
                      </button>
                    </h2>
                  </div>
                  <p className="text-sm">
                    {item.unit_amount && formatPrice(item.unit_amount)}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </>
        )}

        {/* Checkout and total */}
        {cartStore.cart.length > 0 && cartStore.onCheckout === 'cart' ? (
          <motion.div layout>
            <p>Total price: {totalPrice && formatPrice(totalPrice)}</p>
            <button
              onClick={() => cartStore.setCheckout('checkout')}
              className="py-2 mt-4 bg-primary w-full rounded-md"
            >
              Checkout
            </button>
          </motion.div>
        ) : null}

        {/* Checkout form */}
        {cartStore.onCheckout === 'checkout' && <Checkout />}
        {cartStore.onCheckout === 'success' && <OrderConfirmed />}
        <AnimatePresence>
          {!cartStore.cart.length && cartStore.onCheckout === 'cart' && (
            <motion.div
              animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
              initial={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75"
            >
              <h1>Your cart is empty. 😭</h1>
              <BsFillBasket3Fill />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
