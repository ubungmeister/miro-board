import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const userId = session.user.id;
  const { id, boardId } = req.query;

  if (req.method === 'DELETE') {
    // Validate the id and boardId parameters
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    if (!boardId || typeof boardId !== 'string') {
      return res.status(400).json({ message: 'Missing boardId' });
    }

    const note = await prisma.note.findUnique({
      where: { id },
    });
    // Check if the note exists and belongs to the user
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.boardId !== boardId)
      return res.status(403).json({ message: 'Note does not belong to board' });
    if (note.createdBy !== userId)
      return res.status(403).json({ message: 'You are not the owner of this note' });

    await prisma.note.delete({
      where: { id },
    });

    return res.status(204).end();
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
