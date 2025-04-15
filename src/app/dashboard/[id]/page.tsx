'use client';
import { useParams } from 'next/navigation';
import { NoteForm } from '@/app/components/note/NoteForm';
import { NoteList } from '@/app/components/note/NoteList';

export default function BoardPage() {
  const params = useParams();
  const boardId = params?.id as string;

  return (
    <div>
      <NoteList boardId={boardId} />
      <h2 className="text-lg font-bold">Add new note</h2>
      <NoteForm boardId={boardId} />
    </div>
  );
}
