import { Checkbox } from "../ArtistStudioContent";
import { FiEdit2, FiPlusSquare } from "react-icons/fi";

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
      className="grid items-center border-b border-[#2a2a2a] px-3 pb-2 pt-2"
      style={{ gridTemplateColumns: "32px 1fr 80px 120px 220px 80px 130px 30px" }}
    >
      <div className="flex items-center">
        <Checkbox
          checked={allSelected}
          indeterminate={selectedCount > 0 && !allSelected}
          onChange={(v) => (v ? onSelectAll() : onDeselectAll())}
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-bold text-white">{selectedCount} SELECTED</span>
        <button
          type="button"
          onClick={onEditSelected}
          title="Edit selected"
          className="flex items-center justify-center rounded p-1 text-[#888] hover:text-white transition-colors"
        >
          <FiEdit2 className="text-[15px]" />
        </button>
        <button
          type="button"
          onClick={onAddSelectedToPlaylist}
          title="Add to playlist"
          className="flex items-center justify-center rounded p-1 text-[#888] hover:text-white transition-colors"
        >
          <FiPlusSquare className="text-[15px]" />
        </button>
      </div>
      <div /><div /><div /><div /><div /><div />
    </div>
  );
}