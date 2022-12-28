import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext, PreviewData } from 'next/types';
import { ParsedUrlQuery } from 'querystring';

export const requireAuthentication = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  roles: string[],
  callback: any
) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const authorized = roles.find((role) => role === session.user.role);

  return authorized
    ? callback({ session })
    : {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
};
