import { Card } from '@/components';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Home } from '@prisma/client';

export type GridProps = {
	homes?: Home[];
};

const Grid = ({ homes }: GridProps) => {
	const isEmpty = homes?.length === 0;

	return isEmpty ? (
		<p className='text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1'>
			<ExclamationCircleIcon className='shrink-0 w-5 h-5 mt-px' />
			<span>Unfortunately, there is nothing to display yet.</span>
		</p>
	) : (
		<div className='grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6'>
			{homes?.map((home) => (
				<Card key={home.id} {...home} />
			))}
		</div>
	);
};

export default Grid;
