import { homesAdapter } from '@/adapters';
import { Button, Grid, Layout } from '@/components';

import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/utils/requireAuthentication';
import { Home } from '@prisma/client';
import { GetServerSideProps } from 'next/types';
import { useState } from 'react';

type PageHomes = {
	homes: Home[];
};

const PageHomes = ({ homes }: PageHomes) => {
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

export default PageHomes;

export const getServerSideProps: GetServerSideProps = async (context) => {
	return requireAuthentication(
		context,
		['PREMIUM', 'ADMIN', 'SUPERADMIN'],
		async ({ session }) => {
			const homes = await prisma.home.findMany({
				where: {
					...(session.user.role !== 'SUPERADMIN'
						? {
								// owner: { email: session.user.email },
								company: { id: session.user.companyId }
						  }
						: {})
				},
				orderBy: { createdAt: 'desc' }
			});

			return {
				props: {
					homes: homesAdapter(homes)
				}
			};
		}
	);
};
