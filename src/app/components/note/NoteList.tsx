'use client';

import React, { useState } from 'react';
import { useGetNotesQuery, useUpdateNoteMutation } from '@/features/notes/notesApi';
import { NoteItem } from './NoteItem';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

interface NoteListProps {
  boardId: string;
}

export const NoteList = ({ boardId }: NoteListProps) => {
  const { data: notes } = useGetNotesQuery(boardId);
  const [updateNote] = useUpdateNoteMutation();
  const [resizingNoteId, setResizingNoteId] = useState<string | null>(null);

  const handleResizeStart = (id: string) => {
    setResizingNoteId(id);
  };

  const handleResizeEnd = () => {
    setResizingNoteId(null);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { delta, active } = event;
    const note = notes?.find((n) => n.id === active.id);
    if (!note) return;

    const newX = note.posX + delta.x;
    const newY = note.posY + delta.y;

    updateNote({ id: note.id, boardId, posX: newX, posY: newY });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {notes?.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          boardId={boardId}
          isResizing={resizingNoteId === note.id}
          onResizeStart={handleResizeStart}
          onResizeEnd={handleResizeEnd}
        />
      ))}
    </DndContext>
  );
};
