import { User } from '@prisma/client';

export const userAdapter = (user: User) => {
  const { id, name, email, companyId, active } = user;
  return JSON.parse(
    JSON.stringify({
      id,
      name,
      email,
      companyId,
      active,
    })
  );
};

export const usersAdapter = (users: User[]) => {
  return JSON.parse(JSON.stringify(users));
};
