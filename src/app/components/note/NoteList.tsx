import React from 'react';
import { useGetNotesQuery } from '@/features/notes/notesApi';
import { NoteItem } from './NoteItem';

type NoteListProps = {
  boardId: string;
};

export const NoteList = ({ boardId }: NoteListProps) => {
  const { data: notes, isLoading } = useGetNotesQuery(boardId);
  if (isLoading) return <div>Loading...</div>;

  console.log('notes', notes);

  return (
    <>
      {notes?.map((note) => {
        return <NoteItem key={note.id} note={note} boardId={boardId} />;
      })}
    </>
  );
};
