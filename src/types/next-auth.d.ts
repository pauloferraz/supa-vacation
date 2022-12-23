import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      id: string;
      role: string;
      companyId?: string;
      active: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    name?: string;
    email?: string;
    image?: string;
    companyId?: string;
    role: string;
    active: true;
  }
}
