import { productsAdapter } from '@/adapters';
import { Grid, Layout } from '@/components';
import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/utils/requireAuthentication';
import { Product } from '@prisma/client';
import { GetServerSideProps } from 'next/types';

interface DashboardPage {
  products?: Product[];
}

export default function Page({ products }: DashboardPage) {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>
        Top-rated places to stay
      </h1>
      <p className='text-gray-500'>
        Explore some of the best places in the world
      </p>
      <div className='mt-8'>
        <Grid products={products} />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuthentication(
    context,
    ['USER', 'BUYER', 'ADMIN', 'SUPERADMIN'],
    async ({ session }) => {
      const products = await prisma.product.findMany();

      return {
        props: {
          products: productsAdapter(products),
        },
      };
    }
  );
};
