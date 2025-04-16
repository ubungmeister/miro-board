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
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
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
  const user = session.user.id;
  const dashboards = await prisma.board.findMany({
    where: { user: { id: user } },
  });
  return res.status(200).json(dashboards);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = session.user.id;
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const newBoard = await prisma.board.create({
    data: {
      title,
      user: { connect: { id: user } },
    },
  });
  return res.status(201).json(newBoard);
};
