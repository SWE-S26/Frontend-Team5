import { useRef, useEffect } from "react";
import { FiEdit2, FiPlusSquare, FiDollarSign, FiSliders, FiGlobe, FiBarChart2, FiDownload, FiLink, FiTrash2 } from "react-icons/fi";
import { PiPencilSimple } from "react-icons/pi";

export function TrackContextMenu({
  trackId,
  position,
  onClose,
  onEdit,
  onAddToPlaylist,
  onDelete,
  isArtistPro,
}: {
  trackId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: (id: string) => void;
  onAddToPlaylist: (id: string) => void;
  onDelete: (id: string) => void;
  isArtistPro: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const menuItems = [
    { icon: PiPencilSimple,      label: "Edit",            action: () => { onEdit(trackId); onClose(); } },
    { icon: FiPlusSquare, label: "Add to playlist", action: () => { onAddToPlaylist(trackId); onClose(); } },
    { icon: FiDownload,   label: "Download file",    action: onClose },
    { icon: FiLink,       label: "Copy link",        action: onClose },
    { icon: FiTrash2,     label: "Delete track",     action: () => { onDelete(trackId); onClose(); }, danger: true },
  ].filter((item) => {
    if (!isArtistPro) return true;
    return !["Monetize", "Master", "Distribute", "Track insights"].includes(item.label);
  });

  // Adjust position if menu would overflow viewport bottom
  const menuHeight = menuItems.length * 44;
  const adjustedY = position.y + menuHeight > window.innerHeight ? position.y - menuHeight : position.y;
  const adjustedX = position.x + 208 > window.innerWidth ? position.x - 208 : position.x;

  return (
    <div
      ref={ref}
      className="fixed z-150 w-52 rounded-xl border border-[#2a2a2a] bg-chinese-black py-1.5 shadow-2xl"
      style={{ top: adjustedY, left: adjustedX }}
    >
      {menuItems.map(({ icon: Icon, label, action, danger }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          className={`flex w-full items-center gap-3 px-4 py-2.5 text-[13px] transition-colors hover:bg-chinese-black cursor-pointer ${
            danger ? "text-red-400 hover:text-red-300" : "text-[#ccc] hover:text-white-smoke"
          }`}
        >
          <Icon className="shrink-0 text-[15px]" />
          {label}
        </button>
      ))}
    </div>
  );
}