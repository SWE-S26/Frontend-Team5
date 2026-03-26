// app/(artist)/upload/page.tsx
"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CloseOutlined } from '@ant-design/icons';


export default function UploadPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-chinese-black text-white-smoke font-sans antialiased">
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-chinese-black/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/home")} className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity shrink-0 cursor-pointer">
            <Image src="/app-logo/whitelogo.png" alt="BeatZa" width={48} height={48} className="object-contain" priority />
          </button>
          <span className="font-semibold text-base tracking-tight">Upload</span>
        </div>
        <button onClick={()=>router.push("/home")} className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors shrink-0">
          <CloseOutlined className="text-[#b3b3b3] text-sm" />
        </button>
      </div>
    </div>
  );
}