

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Next.js with Supabase</h1>
        <p className="text-xl mb-4">Your application is ready with:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Next.js 14 with App Router</li>
          <li>TypeScript for type safety</li>
          <li>Tailwind CSS for styling</li>
          <li>Supabase for backend services</li>
        </ul>
      </div>
    </main>
  );
}
