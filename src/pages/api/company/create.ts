import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session || session.user.role !== 'SUPERADMIN') {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  if (req.method === 'POST') {
    try {
      const { name } = req.body;

      const company = await prisma.company.create({
        data: {
          name,
        },
      });
      res.status(200).json(company);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['POST']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
