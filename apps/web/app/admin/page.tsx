import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect('/');

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold'>Admin Dashboard (Stub)</h1>
      <p className='mt-4'>Multi-vendor ingestion and graph management tools will be here.</p>
    </div>
  );
}
