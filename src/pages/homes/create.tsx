import HomeForm from '@/components/HomeForm';
import Layout from '@/components/Layout';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

const Create = () => {
  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>List your home</h1>
        <p className='text-gray-500'>
          Fill out the HomeForm below to list a new home.
        </p>
        <div className='mt-8'>
          <HomeForm />
        </div>
      </div>
    </Layout>
  );
};

export default Create;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session || session?.user.role !== 'SUPERADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
