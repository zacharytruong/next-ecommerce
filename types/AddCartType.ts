export type AddCartType = {
  id: string;
  name: string;
  unit_amount: number | null;
  image: string;
  quantity?: number | 1;
};
