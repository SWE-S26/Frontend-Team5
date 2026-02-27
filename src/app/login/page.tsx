"use client";
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with API call
    console.log('Login credentials:', { email, password });

    setTimeout(() => {
      setIsLoading(false);
      alert('Login attempt logged to console!');
    }, 1000);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md border border-gray-100"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 flex justify-center items-center"
      >
        {isLoading ? (
          <span className="animate-pulse">Signing in...</span>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}