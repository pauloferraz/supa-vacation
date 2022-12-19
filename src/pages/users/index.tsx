import { getSession } from "next-auth/react";
import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Get all homes from the authenticated user
  const users = await prisma.user.findMany();
  // Pass the data to the Homes component
  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}

const Users = ({ users = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your listings</h1>
      <p className="text-gray-500">
        Manage your users and update your listings
      </p>
      <div className="mt-8">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="py-3 px-6">
                  E-mail
                </th>
                <th scope="col" className="py-3 px-6">
                  Nome
                </th>
                <th scope="col" className="py-3 px-6">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr className="bg-white border-b" key={user.id}>
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap ">
                      {user.email}
                    </th>
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">Ícone</td>
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
