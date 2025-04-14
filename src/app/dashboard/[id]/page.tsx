'use client';
import { useParams } from 'next/navigation';
import { useGetNotesQuery } from '@/features/notes/notesApi';
import { NoteForm } from '@/app/components/note/NoteForm';

export default function BoardPage() {
  console.log('BoardPage rendered');
  const params = useParams();
  const boardId = params?.id as string;

  const { data: notes, isLoading } = useGetNotesQuery(boardId);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {notes?.map((note) => {
        return (
          <div key={note.id} className="border p-4 rounded shadow mb-4">
            <h2 className="text-lg font-bold">{note.content}</h2>
            <p>
              Position: ({note.posX}, {note.posY})
            </p>
            <p>Color: {note.color}</p>
            <p>Created At: {new Date(note.createdAt).toLocaleString()}</p>
          </div>
        );
      })}
      <h2 className="text-lg font-bold">Add new note</h2>
      <NoteForm boardId={boardId} />
    </div>
  );
}
