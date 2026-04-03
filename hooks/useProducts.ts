import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/products";
import type { Product } from "@/types/product";

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};
