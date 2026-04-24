import { useRef, useEffect } from "react";
import { FiEdit2, FiPlusSquare, FiDollarSign, FiSliders, FiGlobe, FiBarChart2, FiDownload, FiLink, FiTrash2 } from "react-icons/fi";

export function TrackContextMenu({
  trackId,
  position,
  onClose,
  onEdit,
  onAddToPlaylist,
  onDelete,
}: {
  trackId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: (id: string) => void;
  onAddToPlaylist: (id: string) => void;
  onDelete: (id: string) => void;
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
    { icon: FiEdit2,      label: "Edit",            action: () => { onEdit(trackId); onClose(); } },
    { icon: FiPlusSquare, label: "Add to playlist", action: () => { onAddToPlaylist(trackId); onClose(); } },
    { icon: FiDollarSign, label: "Monetize",        action: onClose },
    { icon: FiSliders,    label: "Master",           action: onClose },
    { icon: FiGlobe,      label: "Distribute",       action: onClose },
    { icon: FiBarChart2,  label: "Track insights",   action: onClose },
    { icon: FiDownload,   label: "Download file",    action: onClose },
    { icon: FiLink,       label: "Copy link",        action: onClose },
    { icon: FiTrash2,     label: "Delete track",     action: () => { onDelete(trackId); onClose(); }, danger: true },
  ];

  // Adjust position if menu would overflow viewport bottom
  const menuHeight = menuItems.length * 44;
  const adjustedY = position.y + menuHeight > window.innerHeight ? position.y - menuHeight : position.y;
  const adjustedX = position.x + 208 > window.innerWidth ? position.x - 208 : position.x;

  return (
    <div
      ref={ref}
      className="fixed z-150 w-52 rounded-xl border border-[#2a2a2a] bg-[#161616] py-1.5 shadow-2xl"
      style={{ top: adjustedY, left: adjustedX }}
    >
      {menuItems.map(({ icon: Icon, label, action, danger }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          className={`flex w-full items-center gap-3 px-4 py-2.5 text-[13px] transition-colors hover:bg-[#222] cursor-pointer ${
            danger ? "text-red-400 hover:text-red-300" : "text-[#ccc] hover:text-white"
          }`}
        >
          <Icon className="shrink-0 text-[15px]" />
          {label}
        </button>
      ))}
    </div>
  );
}