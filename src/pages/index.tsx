import { homesAdapter } from '@/adapters/home-adapter';
import Grid from '@/components/Grid';
import Layout from '@/components/Layout';
import { prisma } from '@/lib/prisma';
import { Home } from '@prisma/client';
import { GetServerSideProps } from 'next/types';

interface HomePage {
  homes?: Home[];
}

export default function Page({ homes }: HomePage) {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>
        Top-rated places to stay
      </h1>
      <p className='text-gray-500'>
        Explore some of the best places in the world
      </p>
      <div className='mt-8'>
        <Grid homes={homes} />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Get all homes
  const homes = await prisma.home.findMany();
  // Pass the data to the Home page
  return {
    props: {
      homes: homesAdapter(homes),
    },
  };
};
