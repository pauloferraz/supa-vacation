import { Product } from '@prisma/client';

export const productsAdapter = (products: Product[]): Product[] => {
  return JSON.parse(JSON.stringify(products));
};

export const productAdapter = (product: Product): Product => {
  return JSON.parse(JSON.stringify(product));
};
