'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    fetch('/api/set-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: '' }),
    }).then(() => router.push('/auth'));
  };


  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/cornfield.jpg')` }}
    >
    <div className="z-1 flex justify-end items-center p-20">
  <button
    onClick={handleLogout}
    className="bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded transition"
  >
    Logout
  </button>
</div>

      {/* Page content layered above background */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-6xl text-green-700 font-bold mb-2" >
  🌽 FAWCheck
</h1>

          
        
        <p className="text-200 mb-8 max-w-md drop-shadow-sm" style={{ color: '#0a8107' }} >
          This application is exclusively made for Institute of Plant Breeding- Entomology Laboratory.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => router.replace('/assessment')}
            className="bg-green-500 hover:bg-green-400 text-white py-3 px-6 rounded font-semibold transition shadow-md"
          >
            Start New Assessment
          </button>

          <button
            onClick={() => router.push('/saved')}
            className="bg-yellow-500 hover:bg-yellow-400 text-white py-3 px-6 rounded font-semibold transition shadow-md"
          >
            View Saved Records
          </button>

        </div>
      </div>
    </main>
  );
}
