import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/api/products";
import type { Product } from "@/types/product";

export const useProduct = (productId: string) => {
  return useQuery<Product[], Error>({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });
};
