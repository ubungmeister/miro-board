import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.query;
  const user = session.user.id;

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.createdBy !== user) return res.status(403).json({ message: 'Forbidden' });

    await prisma.board.delete({ where: { id } });
    return res.status(204).end();
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
