import { getServerSession, DefaultSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Extend session to include user.id
interface Session extends DefaultSession {
  user: {
    id: string;
  } & DefaultSession['user'];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    console.log('session', session);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('Method', req.method);
    switch (req.method) {
      case 'POST':
        return await handlePost(req, res, session);
      case 'GET':
        return await handleGet(req, res, session);
      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
const handleGet = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // gettting boardId from query params
  const { boardId } = req.query;

  const user = session.user.id;

  //firt check if boardId belongs to the user
  const board = await prisma.board.findUnique({
    where: { id: boardId as string },
  });

  if (!board) return res.status(404).json({ message: 'Board not found' });
  if (board.createdBy !== user) return res.status(403).json({ message: 'Forbidden' });
  // found notes that belong to the boardId
  const notes = await prisma.note.findMany({
    where: { boardId: boardId as string },
  });
  return res.status(200).json(notes);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = session.user.id;
  const { content, boardId } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Title is required' });
  }
  // crete a new note
  const newNote = await prisma.note.create({
    data: {
      content,
      posX: 0,
      posY: 0,
      color: 'yellow',
      createdBy: user,
      boardId,
    },
  });

  return res.status(201).json(newNote);
};
