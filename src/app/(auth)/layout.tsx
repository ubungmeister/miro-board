import React, { Suspense } from "react";
import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="flex flex-row">
        <main className="flex h-full min-h-screen w-full flex-col items-center justify-center bg-gradient-to-r from-[#0b1314] to-[#50164b] px-4 pb-10">
          {children}
        </main>
      </div>
    </Suspense>
  );
}
