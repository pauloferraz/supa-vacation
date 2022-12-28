import { Layout } from '@/components';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

interface UsersPage {
  users?: User[];
}

const Users = ({ users }: UsersPage) => {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>Your listings</h1>
      <p className='text-gray-500'>
        Manage your users and update your listings
      </p>
      <div className='mt-8'>
        <div className='overflow-x-auto relative'>
          <table className='w-full text-sm text-left text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
              <tr>
                <th scope='col' className='py-3 px-6'>
                  E-mail
                </th>
                <th scope='col' className='py-3 px-6'>
                  Nome
                </th>
                <th scope='col' className='py-3 px-6'>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => {
                return (
                  <tr className='bg-white border-b' key={user.id}>
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap '>
                      {user.email}
                    </th>
                    <td className='py-4 px-6'>{user.name}</td>
                    <td className='py-4 px-6'>Ícone</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Users;

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

  const users = await prisma.user.findMany();

  return {
    props: {
      users,
    },
  };
};
