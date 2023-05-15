import Image from 'next/image';
import formatPrice from '@/util/PriceFormat';
import { ProductType } from '@/types/ProductType';
import Link from 'next/link';

export default function Product({
  name,
  image,
  unit_amount,
  id,
  description,
  metadata
}: ProductType) {
  const features = metadata.features;
  return (
    <div>
      <Link
        href={{
          pathname: `/product/${id}`,
          query: { name, image, unit_amount, id, description, features }
        }}
      >
        <Image
          src={image}
          alt={name}
          width={600}
          height={600}
          className="w-full h-80 object-cover rounded-lg"
          priority
        />
        <div className="font-medium py-2">
          <h1>{name}</h1>
          <h2 className="text-sm text-primary">
            {unit_amount && formatPrice(unit_amount)}
          </h2>
        </div>
      </Link>
    </div>
  );
}
