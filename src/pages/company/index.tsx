import Layout from '@/components/Layout';
import { prisma } from '@/lib/prisma';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import { Company } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';

interface CompanyPage {
  companies?: Company[];
}

const Page = ({ companies }: CompanyPage) => {
  const router = useRouter();

  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>Companies</h1>
      <p className='text-gray-500'>Manage companies</p>
      <div className='mt-8'>
        <div className='flex relative gap-3 flex-wrap'>
          {companies?.map((company) => {
            return (
              <div
                className='flex bg-gray-100 border rounded-sm items-center justify-center py-3 px-4'
                key={company.id}>
                <span
                  className={`h-2 w-2 rounded-md ${
                    company.active ? `bg-green-700` : `bg-red-700`
                  }`}
                />
                <p className='mx-2'>{company.name}</p>
                <button
                  className='text-gray-400 w-5 h-5 ml-4'
                  onClick={() => router.push(`/company/${company.id}/edit`)}>
                  <Cog8ToothIcon />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Page;

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

  const companies = await prisma.company.findMany();

  return {
    props: {
      companies,
    },
  };
};
