// src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { boardsApi } from '@/features/boards/boardsApi';
import { notesApi } from '@/features/notes/notesApi';
export const store = configureStore({
  reducer: {
    [boardsApi.reducerPath]: boardsApi.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(boardsApi.middleware, notesApi.middleware),
});

// Types for usage in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
