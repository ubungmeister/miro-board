import React from 'react';
import { useGetNotesQuery, useDeleteNoteMutation } from '@/features/notes/notesApi';

type NoteListProps = {
  boardId: string;
};
export const NoteList = ({ boardId }: NoteListProps) => {
  const { data: notes, isLoading } = useGetNotesQuery(boardId);
  const [deleteNote] = useDeleteNoteMutation();
  if (isLoading) return <div>Loading...</div>;

  const handleDelete = async ({
    e,
    id,
  }: {
    e: React.MouseEvent<HTMLButtonElement>;
    id: string;
  }) => {
    e.preventDefault();
    try {
      await deleteNote({ id, boardId }).unwrap();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div>
      {notes?.map((note) => {
        return (
          <div key={note.id} className="border p-4 rounded shadow mb-4 flex justify-between">
            <div>
              <h2 className="text-lg font-bold">{note.content}</h2>
              <p>
                Position: ({note.posX}, {note.posY})
              </p>
              <p>Color: {note.color}</p>
              <p>Created At: {new Date(note.createdAt).toLocaleString()}</p>
            </div>
            <button
              onClick={(e) => {
                handleDelete({ e, id: note.id });
              }}
            >
              X
            </button>
          </div>
        );
      })}
    </div>
  );
};
