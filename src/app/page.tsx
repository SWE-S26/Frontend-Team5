"use client";

import { useState } from 'react';
import AuthModal from '@/modules/auth/components/AuthModal';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-black text-white">
        <div className="font-bold text-xl">BeatZa</div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </nav>

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}