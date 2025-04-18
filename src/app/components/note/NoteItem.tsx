'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Resizable } from 're-resizable';
import { Note } from '@/types/board';
import { useDeleteNoteMutation, useUpdateNoteMutation } from '@/features/notes/notesApi';

interface NoteItemProps {
  note: Note;
  boardId: string;
  isResizing: boolean;
  onResizeStart: (id: string) => void;
  onResizeEnd: () => void;
}

export const NoteItem = ({
  note,
  boardId,
  isResizing,
  onResizeStart,
  onResizeEnd,
}: NoteItemProps) => {
  const [deleteNote] = useDeleteNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [text, setText] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: note.id,
    disabled: isResizing,
  });

  const handleDelete = async () => {
    await deleteNote({ id: note.id, boardId });
  };

  const handleResizeStop = (_e: any, _dir: any, ref: HTMLElement) => {
    const newWidth = ref.offsetWidth;
    const newHeight = ref.offsetHeight;
    updateNote({ id: note.id, boardId, width: newWidth, height: newHeight });
    onResizeEnd();
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && text.trim()) {
      updateNote({ id: note.id, content: text, boardId });
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: note.posX,
        top: note.posY,
        transform: CSS.Translate.toString(transform),
        zIndex: 10,
      }}
      {...attributes}
    >
      <Resizable
        defaultSize={{
          width: note.width || 200,
          height: note.height || 150,
        }}
        onResizeStart={() => onResizeStart(note.id)}
        onResizeStop={handleResizeStop}
        enable={{ bottomRight: true }}
        className="bg-yellow-200 shadow-lg rounded-md relative"
      >
        <div
          {...listeners}
          className="cursor-move w-full h-5  rounded-t-md mb-1"
          onMouseDown={(e) => e.stopPropagation()} // prevent textarea drag conflicts
        />

        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleTextKeyDown}
            onBlur={() => {
              if (text !== note.content) {
                updateNote({ id: note.id, content: text, boardId });
              }
              setIsEditing(false);
            }}
            className="w-full h-full  p-2 rounded resize-none outline-none text-black"
          />
        ) : (
          <p
            onDoubleClick={() => setIsEditing(true)}
            className="text-black break-words whitespace-pre-wrap w-full h-full"
          >
            {note.content}
          </p>
        )}

        <button
          onClick={handleDelete}
          className="absolute cursor-pointer text-2xl top-1 right-1 text-red-600 font-bold"
        >
          ×
        </button>
      </Resizable>
    </div>
  );
};
