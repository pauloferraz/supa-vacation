import { Layout } from '@/components';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ListedProduct = (product = null) => {
  const router = useRouter();

  const { data: session } = useSession();

  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      if (session?.user) {
        try {
          const owner: User = await axios.get(
            `/api/products/${product.id}/owner`
          );
          setIsOwner(owner?.id === session.user.id);
        } catch (e) {
          setIsOwner(false);
        }
      }
    })();
  }, [product, session]);

  const deleteProduct = async () => {
    let toastId;
    try {
      toastId = toast.loading('Deleting...');
      setDeleting(true);
      // Delete product from DB
      await axios.delete(`/api/products/${product.id}`);
      // Redirect user
      toast.success('Successfully deleted', { id: toastId });
      router.push('/products');
    } catch (e) {
      console.log(e);
      toast.error('Unable to delete product', { id: toastId });
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4'>
          <div>
            <h1 className='text-2xl font-semibold truncate'>
              {product?.title ?? ''}
            </h1>
            <ol className='inline-flex items-center space-x-1 text-gray-500'>
              <li>
                <span>{product?.size ?? 0} size</span>
                <span aria-hidden='true'> · </span>
              </li>
              <li>
                <span>{product?.color ?? 0} color</span>
                <span aria-hidden='true'> · </span>
              </li>
              <li>
                <span>{product?.active ?? 0} active</span>
              </li>
            </ol>
          </div>

          {isOwner ? (
            <div className='flex items-center space-x-2'>
              <button
                type='button'
                disabled={deleting}
                onClick={() => router.push(`/products/${product.id}/edit`)}
                className='px-4 py-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition rounded-md disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'>
                Edit
              </button>

              <button
                type='button'
                disabled={deleting}
                onClick={deleteProduct}
                className='rounded-md border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none transition disabled:bg-rose-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1'>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ) : null}
        </div>

        <div className='mt-6 relative aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg shadow-md overflow-hidden'>
          {product?.image ? (
            <Image
              src={product.image}
              alt={product.title}
              width={300}
              height={300}
            />
          ) : null}
        </div>

        <p className='mt-8 text-lg'>{product?.description ?? ''}</p>
      </div>
    </Layout>
  );
};

export async function getStaticPaths() {
  // Get all products IDs from the database
  const products = await prisma.product.findMany({
    select: { id: true },
  });

  return {
    paths: products.map((product) => ({
      params: { id: product.id },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Get the current product from the database
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (product) {
    return {
      props: JSON.parse(JSON.stringify(product)),
    };
  }

  // return {
  //   notFound: true,
  // };

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}

export default ListedProduct;
