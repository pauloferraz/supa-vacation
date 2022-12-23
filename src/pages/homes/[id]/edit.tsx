import { homeAdapter } from '@/adapters/home-adapter';
import CreateForm from '@/components/CreateForm';
import Layout from '@/components/Layout';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

const Edit = (home = null) => {
  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>Edit your home</h1>
        <p className='text-gray-500'>
          Fill out the form below to update your home.
        </p>
        <div className='mt-8'>
          {home ? <CreateForm initialValues={home} isNew={false} /> : null}
        </div>
      </div>
    </Layout>
  );
};

export default Edit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const redirect = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  // Check if the user is authenticated
  if (!session) {
    return redirect;
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedHomes: true },
  });

  // Check if authenticated user is the owner of this home
  const id = context.params.id;
  const home = user?.listedHomes?.find((home) => home.id === id);
  if (!home) {
    return redirect;
  }

  return {
    props: homeAdapter(home),
  };
};
