import React from "react";

interface IPhoneMockupProps {
  className?: string;
}

export default function IPhoneMockup({ className = "" }: IPhoneMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer shell */}
      <div className="relative w-40 h-75 rounded-4xl border-[3px] border-[#FF5500] bg-white shadow-md">

        {/* Left side buttons */}
        <div className="absolute -left-1.25 top-15 w-1 h-7 rounded-l-sm bg-[#FF5500]" />
        <div className="absolute -left-1.25 top-24.5 w-1 h-7 rounded-l-sm bg-[#FF5500]" />

        {/* Right side button */}
        <div className="absolute -right-1.25 top-18 w-1 h-10 rounded-r-sm bg-[#FF5500]" />

        {/* Top-right button */}
        <div className="absolute -top-1.25 right-7.5 w-7 h-1 rounded-t-sm bg-[#FF5500]" />

        {/* Camera dot */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border-[1.5px] border-[#FF5500]" />

        {/* Speaker bar */}
        <div className="absolute top-6.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[#FF5500]/25" />

        {/* Screen with thick dark inner border */}
        <div className="absolute inset-2 top-11 bottom-3 border border-[#1a1a1a]/80 rounded-xs bg-white" />
      </div>
    </div>
  );
}