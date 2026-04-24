        "use client"

        import { useState, useRef, useEffect } from "react"
        import { FaChevronDown, FaChevronUp } from "react-icons/fa"
    
        import {
        type NotificationFilterType,
        FILTER_LABELS,
        } from "@/types/notification.types"

        // ─── Props ────────────────────────────────────────────────────────────────────

    interface NotificationFilterDropdownProps {
        selected: NotificationFilterType
        onChange: (filter: NotificationFilterType) => void
    }
    
    const OPTIONS: NotificationFilterType[] = [
        "all",
        "likes",
        "reposts",
        "follows",
        "comments",
    ]
    
    export default function NotificationFilterDropdown({
        selected,
        onChange,
    }: NotificationFilterDropdownProps) {
        const [isOpen, setIsOpen] = useState(false)
        const ref = useRef<HTMLDivElement>(null)
    
        useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
            setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
        }, [])
    
        return (
        <div className="relative" ref={ref}>
    
            {/* Trigger */}
            <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-off-black border border-silver/30 rounded text-white-smoke text-sm font-bold hover:border-silver/60 transition-colors cursor-pointer"
            >
            <span>{FILTER_LABELS[selected]}</span>
            {isOpen ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
            </button>
    
            {/* Options */}
            {isOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-chinese-black border border-silver/30 rounded shadow-xl w-48 py-1">
                {OPTIONS.map((opt) => (
                <button
                    key={opt}
                    onClick={() => { onChange(opt); setIsOpen(false) }}
                    className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
                    opt === selected
                        ? "text-white-smoke"   // chosen → white
                        : "text-silver"        // rest   → silver
                    }`}
                >
                    {FILTER_LABELS[opt]}
                </button>
                ))}
            </div>
            )}
    
        </div>
        )
    }
    