'use client'

import { useState, useRef, useEffect } from "react"

interface BioSectionProps {
    bio: string | null
}

const urlRegex = /(https?:\/\/[^\s]+)/g

const renderBioWithLinks = (text: string) => {
    const parts = text.split(urlRegex)
    return parts.map(
        (part, i) => urlRegex.test(part) ? (
            <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4a90d9] hover:underline"
            >
                {part}
            </a>
        ) : (
            part
        )
    )
}

export default function BioSection({ bio }: BioSectionProps) {
    const [expanded, setExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const textRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const el = textRef.current
        if (el) {
        setIsOverflowing(el.scrollHeight > el.clientHeight)
        }
    }, [bio])

    if (!bio) return null

    return (
        <div className="w-full mb-4">
        <div className="relative">
            <p
            ref={textRef}
            style={{ textAlign: "left", maxHeight: expanded ? "none" : "4.5em", overflow: "hidden" }}
            className="text-[14px] text-white-smoke"
            >
            {renderBioWithLinks(bio)}
            </p>

            {!expanded && isOverflowing && (
            <div className="absolute bottom-0 left-0 w-full h-6 bg-linear-to-t from-chinese-black to-transparent" />
            )}
        </div>

        {(isOverflowing || expanded) && (
            <button
            onClick={() => setExpanded(!expanded)}
            className="text-[14px] font-bold text-white-smoke mt-1 hover:text-silver cursor-pointer"
            >
            {expanded ? "Show less" : "Show more"}
            </button>
        )}
        </div>
    )
}