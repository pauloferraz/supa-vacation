import { Company } from '@prisma/client';

export const companyAdapter = (company: Company): Company => {
  return JSON.parse(JSON.stringify(company));
};
