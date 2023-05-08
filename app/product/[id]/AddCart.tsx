'use client';

import { useCartStore } from '@/store';
import { AddCartType } from '@/types/AddCartType';

export default function AddCart({
  name,
  id,
  image,
  unit_amount,
  quantity
}: AddCartType) {
  const cartStore = useCartStore();
  return (
    <>
      <button
        onClick={() =>
          cartStore.addProduct({ name, id, image, unit_amount, quantity })
        }
        className=" bg-teal-700 my-12 text-white py-2 px-6 font-medium rounded-md"
      >
        Add to cart
      </button>
    </>
  );
}
