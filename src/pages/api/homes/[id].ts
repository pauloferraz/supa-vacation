import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedProducts: true },
  });

  // Check if authenticated user is the owner of this product
  const id = req.query['id'].toString();
  if (!user?.listedProducts?.find((product) => product.id === id)) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  if (req.method === 'PATCH') {
    try {
      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(product);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const product = await prisma.product.delete({
        where: { id },
      });
      // Remove image from Supabase storage
      if (product.image) {
        const path = product.image.split(
          `${process.env.SUPABASE_BUCKET}/`
        )?.[1];
        await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([path]);
      }
      res.status(200).json(product);
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
