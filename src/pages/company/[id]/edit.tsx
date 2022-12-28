import { companyAdapter } from '@/adapters';
import { CompanyForm, Layout } from '@/components';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

const Edit = (company = null) => {
  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>Edit your company</h1>
        <p className='text-gray-500'>
          Fill out the form below to update your company.
        </p>
        <div className='mt-8'>
          {company ? (
            <CompanyForm initialValues={company} isNew={false} />
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default Edit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || session.user.role !== 'SUPERADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const id = context.params.id.toString();
  const company = await prisma.company.findUnique({
    where: {
      id,
    },
  });

  return {
    props: companyAdapter(company),
  };
};
