import { PrettyCheckbox } from "@/app/(artist)/upload/components/TrackInfoForm";
import { FiPlusSquare } from "react-icons/fi";
import { PiPencilSimple } from "react-icons/pi";

const GRID = "32px minmax(200px, 1fr) 80px 120px 220px 80px 130px 30px";

export function BulkSelectionHeader({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onEditSelected,
  onAddSelectedToPlaylist,
}: {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onEditSelected: () => void;
  onAddSelectedToPlaylist: () => void;
}) {
  const allSelected = selectedCount === totalCount;

  return (
    <div
      className="grid items-center border-b border-[#2a2a2a] px-3 py-2"
      style={{ gridTemplateColumns: GRID }}
    >
      <div className="flex items-center">
        <PrettyCheckbox
          checked={allSelected}
          onChange={(v) => (v ? onSelectAll() : onDeselectAll())}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[13px] font-bold text-white-smoke">
          {selectedCount} SELECTED
        </span>

        <button onClick={onEditSelected}>
          <PiPencilSimple className="text-[15px] text-white-smoke cursor-pointer" />
        </button>

        <button onClick={onAddSelectedToPlaylist}>
          <FiPlusSquare className="text-[15px] text-white-smoke cursor-pointer" />
        </button>
      </div>

      <div className="text-[11px] font-bold tracking-[0.8px] text-white-smoke text-center">
        DURATION
      </div>

      <div className="text-[11px] font-bold tracking-[0.8px] text-white-smoke text-center">
        DATE
      </div>

      <div className="text-[11px] font-bold tracking-[0.8px] text-white-smoke text-center">
        ENGAGEMENTS
      </div>

      <div className="text-[11px] font-bold tracking-[0.8px] text-white-smoke text-right">
        PLAYS
      </div>
    </div>
  );
}