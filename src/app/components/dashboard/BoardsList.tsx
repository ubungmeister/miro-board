'use client';
import React from 'react';
import Link from 'next/link';

import { useGetBoardsQuery, useDeleteBoardMutation } from '@/features/boards/boardsApi';
export const BoardsList = () => {
  const { data: dashboards, isLoading, error } = useGetBoardsQuery();
  const [deleteBoard] = useDeleteBoardMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboards</div>;

  const handleDelete = async ({
    e,
    boardId,
  }: {
    e: React.MouseEvent<HTMLButtonElement>;
    boardId: string;
  }) => {
    e.preventDefault();
    console.log('Deleting board with ID:', boardId);
    try {
      await deleteBoard(boardId).unwrap();
      console.log('Deleted board with ID:', boardId);
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {dashboards?.map((dashboard) => (
        <Link key={dashboard.id} href={`/dashboard/${dashboard.id}`}>
          <div className="border p-4 rounded shadow flex justify-between cursor-pointer hover:bg-gray-100">
            <h2 className="text-lg font-bold">{dashboard.title}</h2>
            <button
              onClick={(e) => {
                handleDelete({ e, boardId: dashboard.id });
              }}
            >
              X
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};
