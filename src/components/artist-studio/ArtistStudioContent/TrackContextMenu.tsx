"use client";

import { useState, useEffect } from "react";
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  useRole,
  FloatingPortal,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { FiPlusSquare, FiDownload, FiLink, FiTrash2 } from "react-icons/fi";
import { PiPencilSimple } from "react-icons/pi";
import { BsThreeDots } from "react-icons/bs";
import { useAppSelector } from "@/store/hooks";
import { getBaseUrl } from "@/utilities/getBaseUrl";
import { interactiveToastBus } from "@/lib/interactive-toasts/interactiveToastBus";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

export function TrackContextMenu({
  trackId,
  onEdit,
  onAddToPlaylist,
  onDownload,
  canDownload = false,
  onDelete,
  isArtistPro,
  permalink,
}: {
  trackId: string;
  onEdit: (id: string) => void;
  onAddToPlaylist: (id: string) => void;
  onDownload: (id: string) => void;
  canDownload?: boolean;
  onDelete: (id: string) => void;
  isArtistPro?: boolean;
  permalink?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const profileLink = useAppSelector((state) => state.auth.profileLink);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { outsidePressEvent: 'click' });
  const role = useRole(context, { role: "menu" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const handleCopyLink = () => {
    if (!permalink || !profileLink) return;
    const url = `${getBaseUrl()}/${profileLink}/${permalink}`;
    navigator.clipboard.writeText(url);
    interactiveToastBus.emit({
      type: "copied",
    });
    setIsOpen(false);
  };

  const menuItems = [
    { icon: PiPencilSimple, label: "Edit", action: () => { onEdit(trackId); setIsOpen(false); } },
    { icon: FiPlusSquare, label: "Add to playlist", action: () => { onAddToPlaylist(trackId); setIsOpen(false); } },
    ...(isArtistPro
      ? [{ icon: FiDownload, label: "Download file", action: () => { if (canDownload) onDownload(trackId); setIsOpen(false); }, disabled: !canDownload }]
      : []),
    { icon: FiLink, label: "Copy link", action: handleCopyLink, disabled: !permalink || !profileLink },
    { icon: FiTrash2, label: "Delete track", action: () => { onDelete(trackId); setIsOpen(false); }, danger: true },
  ];

  const menuContent = menuItems.map(({ icon: Icon, label, action, danger, disabled }) => (
    <button
      key={label}
      type="button"
      onClick={action}
      disabled={disabled}
      data-testid={`artist-track-menu-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-[13px] transition-colors hover:bg-chinese-black cursor-pointer ${
        disabled
          ? "cursor-not-allowed text-[#555]"
          : danger
            ? "text-red-400 hover:text-red-300"
            : "text-white-smoke hover:text-upload-select"
      }`}
    >
      <Icon className="shrink-0 text-[15px]" />
      {label}
    </button>
  ));

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        type="button"
        className="shrink-0 text-white-smoke hover:text-upload-select transition-colors"
        data-testid={`artist-track-row-menu-${trackId}`}
      >
        <BsThreeDots className="text-[16px]" />
      </button>

      <FloatingPortal>
        {isOpen && isMobile ? (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-1099 bg-chinese-black/50"
              onClick={() => setIsOpen(false)}
            />
            {/* Bottom sheet */}
            <div
              ref={refs.setFloating}
              onPointerDown={(e) => e.stopPropagation()}
              className="fixed inset-x-0 bottom-0 z-1100 rounded-t-2xl border-t border-[#2a2a2a] bg-chinese-black pb-[env(safe-area-inset-bottom)] shadow-2xl"
              role="menu"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-[#444]" />
              </div>
              {menuContent}
              <div className="h-2" />
            </div>
          </>
        ) : isOpen ? (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-1100 w-52 rounded-xl border border-[#2a2a2a] bg-chinese-black py-1.5 shadow-2xl"
          >
            {menuContent}
          </div>
        ) : null}
      </FloatingPortal>
    </>
  );
}