import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient, Note } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    switch (req.method) {
      case 'PUT':
        return await handlePut(req, res, session.user.id);
      case 'DELETE':
        return await handleDelete(req, res, session.user.id);
      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/// Validate note access and ownership
async function validateNoteAccess(
  req: NextApiRequest,
  userId: string,
  fromBody: boolean = false
): Promise<
  { note: Note | null; boardId: string } | { error: { status: number; message: string } }
> {
  const { id } = req.query;
  const boardId = fromBody ? req.body.boardId : req.query.boardId;

  if (!id || typeof id !== 'string') {
    return { error: { status: 400, message: 'Invalid note ID' } };
  }

  if (!boardId || typeof boardId !== 'string') {
    return { error: { status: 400, message: 'Missing or invalid boardId' } };
  }

  const note = await prisma.note.findUnique({ where: { id } });

  if (!note) {
    return { error: { status: 404, message: 'Note not found' } };
  }

  if (note.createdBy !== userId) {
    return { error: { status: 403, message: 'You are not the owner of this note' } };
  }

  if (note.boardId !== boardId) {
    return { error: { status: 403, message: 'Note does not belong to the specified board' } };
  }

  return { note, boardId };
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, userId: string) {
  // Validate request body
  const validation = await validateNoteAccess(req, userId);

  if ('error' in validation) {
    return res.status(validation.error.status).json({ message: validation.error.message });
  }

  // get the note from the validation result
  // if the note is not found, return 404
  const { note } = validation;

  if (!note) {
    return { error: { status: 404, message: 'Note not found' } };
  }
  await prisma.note.delete({ where: { id: note.id } });
  return res.status(204).end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { content, posX, posY } = req.body;

  // Validate request with boardId from body
  const validation = await validateNoteAccess(req, userId, true);

  if ('error' in validation) {
    return res.status(validation.error.status).json({ message: validation.error.message });
  }

  const { note } = validation;
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const updated = await prisma.note.update({
    where: { id: note.id },
    data: {
      ...(content !== undefined && { content }),
      ...(posX !== undefined && { posX }),
      ...(posY !== undefined && { posY }),
    },
  });

  return res.status(200).json(updated);
}
