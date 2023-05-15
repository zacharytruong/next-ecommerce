import { SearchParamsType } from '@/types/SearchParamsType';
import formatPrice from '@/util/PriceFormat';
import Image from 'next/image';
import AddCart from './AddCart';

export default async function Product({ searchParams }: SearchParamsType) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
      <Image
        src={searchParams.image}
        alt={searchParams.name}
        width={600}
        height={600}
        className="w-full rounded-lg"
        priority
      />
      <div className="font-medium">
        <h1 className="text-2xl py-2">{searchParams.name}</h1>
        <p className="py-2">{searchParams.description}</p>
        <div className="flex gap-2">
          <p className="font-bold text-primary">
            {searchParams.unit_amount && formatPrice(searchParams.unit_amount)}
          </p>
        </div>
        <AddCart {...searchParams} />
      </div>
    </div>
  );
}
