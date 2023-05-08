type params = {
  id: string;
};

type SearchParams = {
  id: string;
  name: string;
  unit_amount: number | null;
  image: string;
  description: string | null;
  features: string | null;
};

export type SearchParamsType = {
  params: params;
  searchParams: SearchParams;
};
