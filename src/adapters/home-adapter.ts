import { Home } from '@prisma/client';

export const homesAdapter = (homes: Home[]): Home[] => {
  return JSON.parse(JSON.stringify(homes));
};

export const homeAdapter = (home: Home): Home => {
  return JSON.parse(JSON.stringify(home));
};
