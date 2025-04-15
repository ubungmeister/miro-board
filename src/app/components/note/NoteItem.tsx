import React from 'react';
import { Note } from '@/types/board';
import { useDeleteNoteMutation, useUpdateNoteMutation } from '@/features/notes/notesApi';
import { useState } from 'react';

type NoteItemProps = {
  note: Note;
  boardId: string;
};

export const NoteItem = ({ note, boardId }: NoteItemProps) => {
  console.log('single note', note);

  const [deleteNote] = useDeleteNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [text, setText] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleToggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  // Update Note text onEnter, onBlur
  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim()) {
      updateNote({ id: note.id, content: text, boardId });
      setIsEditing(false);
    }
  };
  const handleOnBlur = () => {
    if (text !== note.content && text.trim()) {
      updateNote({ id: note.id, content: text, boardId });
    } else {
      setText(note.content);
    }
    setIsEditing(false);
  };

  return (
    <div>
      <div key={note.id} className="border p-4 rounded shadow mb-4 flex justify-between">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleOnBlur}
              autoFocus
              onKeyDown={handleTextKeyDown}
              className="border p-2 rounded"
            />
          ) : (
            <p onDoubleClick={handleToggleEditing} className="text-lg font-bold">
              {note.content}
            </p>
          )}
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
    </div>
  );
};
