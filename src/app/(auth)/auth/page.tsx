'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isLogin
      ? 'http://localhost:5268/api/Auth/login'
      : 'http://localhost:5268/api/Auth/register';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      if (!data.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', data.token);
      await fetch('/api/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token }),
      });

      setTimeout(() => {
        router.push('/');
      }, 100);

      toast.success(`${isLogin ? 'Logged in' : 'Registered'} successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/cornfield.jpg')` }}
    >
      

      {/* Auth form container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-90 shadow-xl p-8 rounded-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 text-green-700">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded text-green-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded text-green-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-green-700">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              className="text-green-600 underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
