import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AddCartType } from './types/AddCartType';

type CartState = {
  isOpen: boolean;
  cart: AddCartType[];
  toggleCart: () => void;
  addProduct: (product: AddCartType) => void;
  clearCart: () => void;
  removeProduct: (product: AddCartType) => void;
  paymentIntent: string;
  setPaymentIntent: (val: string) => void;
  onCheckout: string;
  setCheckout: (val: string) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      onCheckout: 'cart',
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addProduct: (product) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === product.id
          );
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.id === product.id) {
                return { ...cartItem, quantity: cartItem.quantity! + 1 };
              }
              return cartItem;
            });
            return { cart: updatedCart };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...product,
                  quantity: 1
                }
              ]
            };
          }
        }),
      clearCart: () => set((state) => ({ cart: [] })),
      removeProduct: (product) =>
        set((state) => {
          // Check if the item exists and remove quantity -1
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === product.id
          );
          if (existingItem && existingItem.quantity! > 1) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.id === product.id) {
                return { ...cartItem, quantity: cartItem.quantity! - 1 };
              }
              return cartItem;
            });
            return { cart: updatedCart };
          } else {
            // Remove item from cart
            const filteredCart = state.cart.filter(
              (cartItem) => cartItem.id !== product.id
            );
            return { cart: filteredCart };
          }
        }),
      paymentIntent: '',
      setPaymentIntent: (val) => set((state) => ({ paymentIntent: val })),
      setCheckout: (val) => set((state) => ({ onCheckout: val }))
    }),
    { name: 'cart-store' }
  )
);

type ThemeState = {
  mode: 'light' | 'dark';
  toggleMode: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleMode: (theme: 'light' | 'dark') => set((state) => ({ mode: theme }))
    }),
    { name: 'theme-store' }
  )
);
