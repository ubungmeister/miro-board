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
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({
        url: `dashboard/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Board', id }],
    }),
  }),
});

export const { useGetBoardsQuery, useCreateBoardMutation, useDeleteBoardMutation } = boardsApi;
