import api from "@/lib/axios";

export type OrderItem = {
  product_id: string;
  name: string;
  quantity: number;
  price: string;
  shipping_amount: number;
};

export type CreateOrderPayload = {
  first_name: string;
  last_name: string;
  email: string;
  shopping_address: {
    street_address: string;
    country: string;
    province: string;
    city: string;
    area: string;
    zip_code: string;
  };
  mobile_number: string;
  mode_of_payment: "cash";
  amount: number;
  items: OrderItem[];
};

export async function createOrder(payload: CreateOrderPayload): Promise<void> {
  await api.post("/orders", payload);
}
