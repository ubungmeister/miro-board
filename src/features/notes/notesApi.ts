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
      //optimistic update
      async onQueryStarted(newNote, { dispatch, queryFulfilled }) {
        // Generate a temporary ID for the new Note
        const tempId = Math.random().toString(36);

        // Optimistically update the cache by adding the new Note

        if (!newNote.boardId) {
          throw new Error('boardId is required to update the cache');
        }

        const patchResult = dispatch(
          notesApi.util.updateQueryData('getNotes', newNote.boardId, (draft: Note[]) => {
            draft.push({
              ...newNote,
              id: tempId,
            } as Note);
          })
        );

        try {
          // Wait for the mutation to resolve
          const { data: createdNote } = await queryFulfilled;
          // Replace the temporary Note with the one returned from the server
          dispatch(
            notesApi.util.updateQueryData('getNotes', newNote.boardId, (draft: Note[]) => {
              // Find the temporary Note in the cached array and replace it
              const index = draft.findIndex((note) => note.id === tempId);
              if (index !== -1) {
                draft[index] = createdNote;
              }
            })
          );
        } catch {
          // Roll back the optimistic update in case of an error
          patchResult.undo();
        }
      },
    }),
    updateNote: builder.mutation<Note, Partial<Note>>({
      query: (note) => ({ url: `notes/${note.id}`, method: 'PUT', body: note }),
      invalidatesTags: (result, error, note) => [{ type: 'Note', id: note.id }],
    }),
    deleteNote: builder.mutation<void, { id: string; boardId: string }>({
      query: ({ id, boardId }) => ({
        url: `notes/${id}?boardId=${boardId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Note', id }],
      //optimistic update

      async onQueryStarted({ id, boardId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notesApi.util.updateQueryData('getNotes', boardId, (draft) => {
            const index = draft.findIndex((note) => note.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useCreateNoteMutation, useDeleteNoteMutation, useGetNotesQuery } = notesApi;
