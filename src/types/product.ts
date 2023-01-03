import { Product } from '@prisma/client';

export type ProductFull = {
  owner: any;
} & Omit<
  Product,
  'companyId' | 'ownerId' | 'createdAt' | 'updatedAt' | 'description'
>;
