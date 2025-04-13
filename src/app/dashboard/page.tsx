'use client';
import { useEffect, useState } from 'react';
import { Board } from '@/types/board';

const Dashboard = () => {
  const [dashboards, setDashboards] = useState<Array<Board>>([]);
  const [newBoardTitle, setNewBoardTitle] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboards');
        }
        const data = await response.json();
        console.log('Fetched dashboards:', data);
        setDashboards(data);
      } catch (error) {
        console.error('Error fetching dashboards:', error);
      }
    };

    fetchData();
  }, [setNewBoardTitle, setDashboards]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle) return;
    try {
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newBoardTitle }),
      });
      if (!response.ok) {
        throw new Error('Failed to create board');
      }
      const newBoard = await response.json();
      console.log('Created new board:', newBoard);
      setNewBoardTitle('');
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleDelete = async ({
    e,
    boardId,
  }: {
    e: React.MouseEvent<HTMLButtonElement>;
    boardId: string;
  }) => {
    console.log('Delete button clicked', boardId);
    e.preventDefault();
    if (!boardId) return;
    try {
      const response = await fetch(`/api/dashboard/${boardId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete board');
      }
      const updatedDashboards = dashboards.filter((dashboard) => dashboard.id !== boardId);
      setDashboards(updatedDashboards);
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboards.map((dashboard) => (
          <div key={dashboard.id} className="border p-4 rounded shadow flex justify-between">
            <h2 className="text-lg font-bold">{dashboard.title}</h2>
            <button onClick={(e) => handleDelete({ e, boardId: dashboard.id })}>X</button>
          </div>
        ))}
      </div>
      <div>
        <h1>Add new Board</h1>
        <form onSubmit={handleFormSubmit} className="flex items-center mt-4">
          <input
            onChange={(e) => setNewBoardTitle(e.target.value)}
            type="text"
            placeholder="Board Title"
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-2">
            Create Board
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
