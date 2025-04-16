'use client';
import { CiStickyNote } from 'react-icons/ci';

type SidebarProps = {
  onCreate: () => void;
};

export const Sidebar = ({ onCreate }: SidebarProps) => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 min-h-100 bg-white shadow-md rounded-2xl">
      <div className="p-2 flex flex-col items-center space-y-4 w-auto">
        <button title="Sticky Note" onClick={onCreate}>
          <CiStickyNote className="w-12 h-12 text-gray-700 hover:text-yellow-500" />
        </button>
      </div>
    </div>
  );
};
