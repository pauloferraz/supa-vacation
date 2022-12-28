import { Button, Grid, Layout } from '@/components';

import { prisma } from '@/lib/prisma';
import { Home } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';
import { useState } from 'react';

const Homes = ({ homes = [] }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>Your listings</h1>
      <p className='text-gray-500'>
        Manage your homes and update your listings
      </p>
      <Button
        label='Create Home'
        href='/homes/create'
        toggleLoading={setLoading}
        loading={loading}
      />
      <div className='mt-8'>
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export default Homes;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session || session.user.role === 'USER') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  let homes: Home[];

  if (session.user.role === 'SUPERADMIN') {
    homes = await prisma.home.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } else {
    homes = await prisma.home.findMany({
      where: {
        owner: { email: session.user.email },
        company: { id: session.user.companyId },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Pass the data to the Homes component
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
};
