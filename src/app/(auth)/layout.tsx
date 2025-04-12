import React, { Suspense } from 'react';
import '../globals.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="flex flex-row">
        <main className="flex h-full min-h-screen w-full flex-col items-center justify-center bg-gradient-to-r from-[#0b1314] to-[#50164b] px-4 pb-10">
          <div className="h-auto flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 border rounded-lg">
            <div className="max-w-md w-full space-y-8">{children}</div>
          </div>
        </main>
      </div>
    </Suspense>
  );
}
