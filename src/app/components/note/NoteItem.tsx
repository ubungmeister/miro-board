'use client';

import React, { useRef, useState } from 'react';
import Draggable, { DraggableEvent } from 'react-draggable';
import { Note } from '@/types/board';
import { useDeleteNoteMutation, useUpdateNoteMutation } from '@/features/notes/notesApi';
import { DraggableWrapper } from './DraggableWrapper';

type NoteItemProps = {
  note: Note;
  boardId: string;
};

export const NoteItem = ({ note, boardId }: NoteItemProps) => {
  const [deleteNote] = useDeleteNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [text, setText] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await deleteNote({ id: note.id, boardId }).unwrap();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleToggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

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

  const handleDragStop = (e: DraggableEvent, data: { x: number; y: number }) => {
    updateNote({
      id: note.id,
      boardId,
      posX: data.x,
      posY: data.y,
    });
  };

  return (
    <Draggable
      defaultPosition={{ x: note.posX, y: note.posY }}
      onStop={handleDragStop}
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
    >
      <DraggableWrapper
        ref={nodeRef}
        className="absolute border p-4 rounded shadow bg-white w-64 cursor-move z-40"
        // style={{ zIndex: 100 }}
      >
        <div key={note.id} className="border p-4 rounded shadow mb-4 flex justify-between ">
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
          <button onClick={(e) => handleDelete(e)} className="text-red-500 font-bold ml-2">
            ×
          </button>
        </div>
      </DraggableWrapper>
    </Draggable>
  );
};
