import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session || !session.user.role.includes('ADMIN' || 'SUPERADMIN')) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const id = req.query['id'].toString();
  if (req.method === 'PATCH') {
    const userToSave = {
      ...req.body,
      companyId: req.body.isBuyer ? req.body.companyId : null,
      role: req.body.isBuyer ? 'PREMIUM' : 'USER',
    };

    delete userToSave.isBuyer;

    try {
      const user = await prisma.user.update({
        where: { id },
        data: userToSave,
      });

      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
