'use client';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {useCreateNoteMutation} from '@/features/notes/notesApi';

const schema = z.object({
  text: z.string().nonempty('This field is required'),
});
type DashboardDataType = z.infer<typeof schema>;

type NoteFormProps = {
    boardId: string;
}

export const NoteForm = ({boardId}:NoteFormProps) => {
    const [createNote] = useCreateNoteMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DashboardDataType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<DashboardDataType> = async (data) => {
    try {
      const response = await createNote({ content: data.text, boardId:boardId }).unwrap();
      console.log('Created new board:', response);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center mt-4">
        <input
          {...register('text')}
          type="text"
          placeholder="Note Text"
          className="border p-2 rounded"
        />
        {errors.text && <span className="text-red-500 ml-2">{errors.text.message}</span>}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-2">
          Create Board
        </button>
      </form>
    </div>
  );
};
