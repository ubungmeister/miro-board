import React from 'react';
import { useGetNotesQuery } from '@/features/notes/notesApi';
import { NoteItem } from './NoteItem';

type NoteListProps = {
  boardId: string;
};

export const NoteList = ({ boardId }: NoteListProps) => {
  const { data: notes } = useGetNotesQuery(boardId);

  console.log('notes', notes);

  return <>{notes?.map((note) => <NoteItem key={note.id} note={note} boardId={boardId} />)}</>;
};
