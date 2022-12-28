import { CompanyForm, Layout } from '@/components';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

const Create = () => {
  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>List your company</h1>
        <p className='text-gray-500'>
          Fill out the HomeForm below to list a new company.
        </p>
        <div className='mt-8'>
          <CompanyForm />
        </div>
      </div>
    </Layout>
  );
};

export default Create;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

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
