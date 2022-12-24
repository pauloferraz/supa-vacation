import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session || session.user.role !== 'SUPERADMIN') {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const id = req.query['id'].toString();
  if (req.method === 'PATCH') {
    try {
      const company = await prisma.company.update({
        where: { id },
        data: req.body,
      });

      res.status(200).json(company);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const company = await prisma.company.delete({
        where: { id },
      });

      res.status(200).json(company);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
