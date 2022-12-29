import { Layout } from '@/components';
import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/utils/requireAuthentication';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import { User } from '@prisma/client';
import Link from 'next/link';
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
                  Nível
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
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'>
                      <div className='flex items-center justify-start'>
                        <span
                          className={`h-2 w-2 rounded-md mr-2 ${
                            user.active ? `bg-green-700` : `bg-red-700`
                          }`}
                        />
                        {user.email}
                      </div>
                    </th>
                    <td className='py-4 px-6'>{user.name}</td>
                    <td className='py-4 px-6'>{user.role}</td>
                    <td className='py-4 px-6'>
                      <Link href={`/users/${user.id}/edit`}>
                        <Cog8ToothIcon className='text-gray-400 w-5 h-5' />
                      </Link>
                    </td>
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
  return requireAuthentication(
    context,
    ['ADMIN', 'SUPERADMIN'],
    async ({ session }) => {
      const users = await prisma.user.findMany();

      return {
        props: {
          users,
        },
      };
    }
  );
};
