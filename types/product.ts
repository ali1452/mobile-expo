export type Product = {
  _id: string;
  product_id: string;
  name: string;
  price: string;
  category: string;
  brand: string;
  description: string;
  url: string;
  discount_price: string;
  sku: string[];
  qty: number;
  edit: boolean;
  favourite: boolean;
};
