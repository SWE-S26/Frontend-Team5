"use client";

import React from "react";

import Script from "next/script";

export default function SausageWaveform() {
  return (
    <>
      <Script src="/scripts/waveform.js" strategy="beforeInteractive" />
    </>
  );
}
