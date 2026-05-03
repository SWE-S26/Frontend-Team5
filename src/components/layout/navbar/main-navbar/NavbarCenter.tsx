import React, { useState, useEffect, useRef, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import useSearch from "@/hooks/useSearch";

export default function NavbarCenter() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 250);
  const { getSuggestions, addToHistory } = useSearch();
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!debouncedQ.trim()) {
        setSuggestions(null);
        setShowDropdown(false);
        return;
      }
      const res = await getSuggestions(debouncedQ);
      if (!cancelled) {
        const list = Array.isArray(res) ? res : null;
        setSuggestions(list);
        setShowDropdown(!!list && list.length > 0);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedQ, getSuggestions]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = q.trim();
      if (!trimmed) return;
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [q, router]
  );

  const sanitize = (value: string) => value.replace(/[()\[\]{}]/g, "");

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = sanitize(e.target.value);

    setQ(cleaned);
    if (cleaned.trim()) setShowDropdown(true);
  }, []);

  const handleSuggestionClick = useCallback(
    (item: any) => {
      const title = item.title || item.id || "";
      setQ(title);
      setShowDropdown(false);
      if (item.id && item.type) addToHistory({ id: item.id, type: item.type });
      router.push(`/search?q=${encodeURIComponent(title)}`);
    },
    [addToHistory, router]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setShowDropdown(false);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          data-testid="search_bar"
          type="text"
          value={q}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions && suggestions.length > 0 && setShowDropdown(true)}
          placeholder="Search"
          autoComplete="off"
          className="w-full h-9 bg-off-black text-white-smoke placeholder-silver rounded-sm pl-4 pr-9 mb-0.75 text-sm outline-none caret-anger ring-1 ring-transparent focus:ring-silver transition-all duration-300"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-silver text-2xl"
        >
          <CiSearch />
        </button>
      </form>

      {showDropdown && suggestions && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 bg-chinese-black border border-off-black mt-1 rounded-sm z-50 max-h-72 overflow-auto"
        >
          {suggestions.map((s: any) => (
            <li key={`${s.type}-${s.id ?? s.title}`} role="option">
              <button
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-left px-3 py-2 hover:bg-off-black transition"
              >
                <div className="text-sm text-white-smoke">{s.title ?? s.id}</div>
                <div className="text-xs text-silver">{s.type}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
