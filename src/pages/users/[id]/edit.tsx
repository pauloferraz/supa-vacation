import { userAdapter } from '@/adapters';
import { Layout } from '@/components';
import UserForm from '@/components/UserForm';
import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/utils/requireAuthentication';
import { User } from '@prisma/client';
import { GetServerSideProps } from 'next/types';

type EditUserPageProps = {
  user: User;
  companyId: string;
};

const EditUserPage = ({ user, companyId }: EditUserPageProps) => {
  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>Edit user</h1>
        <p className='text-gray-500'>
          Fill out the form below to update your company.
        </p>
        <div className='mt-8'>
          <UserForm initialValues={user} companyId={companyId} />
        </div>
      </div>
    </Layout>
  );
};

export default EditUserPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuthentication(
    context,
    ['SUPERADMIN', 'ADMIN'],
    async ({ session }) => {
      const id = context.params.id.toString();
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      return {
        props: {
          user: userAdapter(user),
          companyId: session.user.companyId,
        },
      };
    }
  );
};
