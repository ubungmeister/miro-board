import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Note } from '@/types/board';

export const notesApi = createApi({
  reducerPath: 'notesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Note'],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], string>({
      // boardId
      query: (boardId) => `notes?boardId=${boardId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Note' as const, id })),
              { type: 'Note', id: 'LIST' },
            ]
          : [{ type: 'Note', id: 'LIST' }],
    }),
    createNote: builder.mutation<Note, Partial<Note>>({
      query: (note) => ({ url: 'notes', method: 'POST', body: note }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),
    updateNote: builder.mutation<Note, Partial<Note>>({
      query: (note) => ({ url: `notes/${note.id}`, method: 'PUT', body: note }),
      invalidatesTags: (result, error, note) => [{ type: 'Note', id: note.id }],
    }),
    deleteNote: builder.mutation<void, string>({
      query: (id) => ({ url: `notes/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Note', id }],
    }),
  }),
});

export const { useCreateNoteMutation, useDeleteNoteMutation, useGetNotesQuery } = notesApi;
