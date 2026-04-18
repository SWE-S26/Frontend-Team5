"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ALLOWED_EXTENSIONS, getExtension } from "@/types/upload.types";
import { setPendingUploadAudioFile } from "@/lib/pendingUploadAudio";

function isAudioFile(file: File) {
  const ext = getExtension(file.name);
  return file.type.startsWith("audio/") || ALLOWED_EXTENSIONS.includes(ext);
}

export default function GlobalAudioDropOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const dragDepthRef = useRef(0);
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);

  const isArtistPage = pathname === "/artists";
  const isUploadPage = pathname === "/upload";
  const isOverlayExcludedPage = isArtistPage || isUploadPage;

  useEffect(() => {
    if (isOverlayExcludedPage) {
      setIsDraggingAudio(false);
      dragDepthRef.current = 0;
      return;
    }

    const hasFiles = (event: DragEvent) => {
      const types = Array.from(event.dataTransfer?.types ?? []);
      return types.includes("Files");
    };

    const onDragEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepthRef.current += 1;
      setIsDraggingAudio(true);
    };

    const onDragOver = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
      setIsDraggingAudio(true);
    };

    const onDragLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (dragDepthRef.current === 0) {
        setIsDraggingAudio(false);
      }
    };

    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepthRef.current = 0;
      setIsDraggingAudio(false);

      const files = Array.from(event.dataTransfer?.files ?? []);
      const firstAudio = files.find((file) => isAudioFile(file));
      if (!firstAudio) return;

      setPendingUploadAudioFile(firstAudio);
      router.push("/upload");
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);

    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [isOverlayExcludedPage, router]);

  if (!isDraggingAudio || isOverlayExcludedPage) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-1200 flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px] sm:px-6">
      <div className="w-full max-w-5xl rounded-xl border-2 border-dashed border-white-smoke bg-chinese-black/92 px-6 py-16 text-center shadow-2xl sm:px-10 sm:py-20">
        <p className="text-[22px] font-semibold leading-tight text-white-smoke sm:text-[28px]">Drop audio file to upload</p>
        <p className="mt-3 text-[13px] text-white/80 sm:text-[14px]">You&apos;ll be taken to Track Info automatically.</p>
      </div>
    </div>
  );
}
