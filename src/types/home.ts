import { Home } from '@prisma/client';

export type HomeFull = {
  owner: any;
} & Omit<
  Home,
  'companyId' | 'ownerId' | 'createdAt' | 'updatedAt' | 'description'
>;
