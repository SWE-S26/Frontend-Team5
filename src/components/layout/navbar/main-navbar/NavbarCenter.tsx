import { CiSearch } from "react-icons/ci";

export default function NavbarCenter() {
  return (
    <div className="relative w-full">
      <input
        data-testid="search_bar"
        type="text"
        placeholder="Search"
        className="w-full h-9 bg-off-black text-white-smoke placeholder-silver rounded-sm pl-4 pr-9 mb-0.75 text-sm outline-none caret-anger ring-1 ring-transparent focus:ring-silver transition-all duration-300"
      />
      <CiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-silver text-2xl" />
    </div>
  );
}