'use client';
import { useParams } from 'next/navigation';
import { NoteList } from '@/app/components/note/NoteList';
import { Sidebar } from '@/app/components/note/SideBar';
import { useCreateNoteMutation } from '@/features/notes/notesApi';

export default function BoardPage() {
  const params = useParams();
  const boardId = params?.id as string;
  const [createNote] = useCreateNoteMutation();

  const handleCreateNote = async () => {
    try {
      await createNote({
        content: 'New Note',
        boardId,
        // posX: 20,
        // posY: 20,
        color: 'yellow',
      }).unwrap();
    } catch (error) {
      console.error('Error creating note', error);
    }
  };

  return (
    <div className="flex h-screen">
      <div
        className="relative flex-1 overflow-hidden"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #e5e7eb 0, #e5e7eb 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #e5e7eb 0, #e5e7eb 1px, transparent 1px, transparent 20px)',
        }}
      >
        <Sidebar onCreate={handleCreateNote} />
        <NoteList boardId={boardId} />
      </div>
    </div>
  );
}
