import { productAdapter } from '@/adapters';
import { Layout, ProductForm } from '@/components';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

const Edit = (product = null) => {
  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>Edit your product</h1>
        <p className='text-gray-500'>
          Fill out the form below to update your product.
        </p>
        <div className='mt-8'>
          {product ? (
            <ProductForm initialValues={product} isNew={false} />
          ) : null}
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
    select: { listedproducts: true },
  });

  // Check if authenticated user is the owner of this product
  const id = context.params.id;
  const product = user?.listedproducts?.find((product) => product.id === id);
  if (!product) {
    return redirect;
  }

  return {
    props: productAdapter(product),
  };
};
