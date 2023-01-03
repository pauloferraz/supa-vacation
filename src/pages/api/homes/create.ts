import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Create new product
  if (req.method === 'POST') {
    try {
      const { image, title, description, price, size, color, active } =
        req.body;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      const product = await prisma.product.create({
        data: {
          image,
          title,
          description,
          price,
          size,
          color,
          active,
          ownerId: user.id,
          companyId: user.companyId,
        },
      });
      res.status(200).json(product);
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
