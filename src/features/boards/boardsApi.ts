import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Board } from '@/types/board';

export const boardsApi = createApi({
  reducerPath: 'boardsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Board'],
  endpoints: (builder) => ({
    getBoards: builder.query<Board[], void>({
      query: () => 'dashboard',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Board' as const, id })),
              { type: 'Board', id: 'LIST' },
            ]
          : [{ type: 'Board', id: 'LIST' }],
    }),
    createBoard: builder.mutation<Board, { title: string }>({
      query: (body) => ({
        url: 'dashboard',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Board', id: 'LIST' }],
      //implement optimistic update
      async onQueryStarted(newBoard, { dispatch, queryFulfilled }) {
        // Generate a temporary ID for the new Board
        const tempId = Math.random().toString(36);

        // Optimistically update the cache by adding the new Board
        const patchResult = dispatch(
          boardsApi.util.updateQueryData('getBoards', undefined, (draft: Board[]) => {
            draft.push({
              ...newBoard,
              id: tempId,
            } as Board);
          })
        );

        try {
          // Wait for the mutation to resolve
          const { data: createdBoard } = await queryFulfilled;
          // Replace the temporary Board with the one returned from the server
          dispatch(
            boardsApi.util.updateQueryData('getBoards', undefined, (draft: Board[]) => {
              // Find the temporary Board in the cached array and replace it
              const index = draft.findIndex((board) => board.id === tempId);
              if (index !== -1) {
                draft[index] = createdBoard;
              }
            })
          );
        } catch {
          // Roll back the optimistic update in case of an error
          patchResult.undo();
        }
      },
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({
        url: `dashboard/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Board', id }],
      async onQueryStarted(_id, { dispatch, queryFulfilled }) {
        // Optimistically update the cache by removing Board by id
        const patchResult = dispatch(
          boardsApi.util.updateQueryData('getBoards', undefined, (draft) => {
            const index = draft.findIndex((board) => board.id === _id); //return -1 if not found
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // If the deletion fails, roll back the optimistic update
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetBoardsQuery, useCreateBoardMutation, useDeleteBoardMutation } = boardsApi;
