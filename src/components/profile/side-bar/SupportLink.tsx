    'use client'

    import { BiSolidDollarCircle } from "react-icons/bi"
    import Button from "@/components/ui/Button"

    interface SupportLinkProps {
    supportLink: string | null
    displayName: string | null
    }

    const SupportLink = ({ supportLink, displayName }: SupportLinkProps) => {
    if (!supportLink) return null

    return (
        <div className="w-full mb-4 rounded-md overflow-hidden relative bg-[#1e4a8a] px-7 py-5">
        {/* globe SVG bottom-right */}
        <svg
        className="absolute -bottom-83 -right-32 w-[500px] h-[500px] opacity-20"
        style={{ transform: "rotate(150deg)" }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="100" cy="100" r="90"  fill="none" stroke="white" strokeWidth="1" />
            <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="white" strokeWidth="1" />
            <ellipse cx="100" cy="100" rx="90" ry="60" fill="none" stroke="white" strokeWidth="1" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="white" strokeWidth="1" />
            <ellipse cx="100" cy="100" rx="30" ry="90" fill="none" stroke="white" strokeWidth="1" />
            <ellipse cx="100" cy="100" rx="60" ry="90" fill="none" stroke="white" strokeWidth="1" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="white" strokeWidth="1" />
        </svg>

        {/* content */}
        <div className="relative z-10 flex flex-col items-start text-left">
            <p className="text-white text-sm mb-1">Show some love for your favourite artists.</p>
            <p className="text-white text-sm mb-1">Follow this link to their own support page.</p>
            <a
            href="https://www.patreon.com/bePatron?u=12345678"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm underline mb-4"
            >
            Learn more
            </a>

            <a href={supportLink} target="_blank" rel="noopener noreferrer" className="block w-full mt-2">
            <Button
                className="w-full bg-white-smoke text-black font-bold justify-center"
            >
                <span className="flex items-center justify-center gap-2 w-full">
                <BiSolidDollarCircle className="text-lg" />
                Support {displayName}
                </span>
            </Button>
            </a>
        </div>
        </div>
    )
    }

    export default SupportLink