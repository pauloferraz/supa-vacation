import { productsAdapter } from '@/adapters';
import { Button, Grid, Layout } from '@/components';

import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/utils/requireAuthentication';
import { Product } from '@prisma/client';
import { GetServerSideProps } from 'next/types';
import { useState } from 'react';

type PageProducts = {
  products: Product[];
};

const Pageproducts = ({ products }: PageProducts) => {
  const [loading, setLoading] = useState(false);
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>Your listings</h1>
      <p className='text-gray-500'>
        Manage your products and update your listings
      </p>
      <Button
        label='Create product'
        href='/products/create'
        toggleLoading={setLoading}
        loading={loading}
      />
      <div className='mt-8'>
        <Grid products={products} />
      </div>
    </Layout>
  );
};

export default Pageproducts;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuthentication(
    context,
    ['PREMIUM', 'ADMIN', 'SUPERADMIN'],
    async ({ session }) => {
      const products = await prisma.product.findMany({
        where: {
          ...(session.user.role !== 'SUPERADMIN'
            ? {
                // owner: { email: session.user.email },
                company: { id: session.user.companyId },
              }
            : {}),
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        props: {
          products: productsAdapter(products),
        },
      };
    }
  );
};
