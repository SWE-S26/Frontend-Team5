import { useRouter } from "next/navigation";

function CommentBubble({ text, rightOffset, topOffset }: { text: string; rightOffset: number; topOffset: number }) {
  return (
    <div
      className="absolute rounded-full px-5 py-2 text-[14px] font-semibold text-chinese-black shadow-lg"
      style={{ backgroundColor: "#f39f86", right: `${rightOffset}px`, top: `${topOffset}px` }}
    >
      {text}
      <div className="absolute -bottom-2 right-5 h-4 w-4 rotate-45" style={{ backgroundColor: "#f39f86" }} />
    </div>
  );
}

export function CommentsTab() {
  const router = useRouter();
  return (
    <div className="min-h-100 border-[#262626] pt-8">
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-chinese-black px-2 py-0.5 text-[10px] font-bold text-yellow-400">★ ARTIST PRO</span>
          </div>
          <h2 className="mb-6 text-[32px] font-bold text-white-smoke">Every comment in one place</h2>
          <p className="max-w-xl text-[14px] leading-relaxed text-[#aaa]">
            With Artist Pro, you get access to Comments Hub which brings together every comment across all of your tracks,
            so you can easily see what fans are saying about you. Read, moderate and respond to your comments, all in one place.
          </p>
          <button type="button" onClick={() => router.push("/artistpro")} className="mt-6 rounded-full bg-white-smoke px-7 py-2.5 text-[14px] font-bold text-chinese-black hover:bg-upload-select transition-colors">
            Get Artist Pro
          </button>
        </div>
        <div className="relative h-56 w-full">
          <CommentBubble text="Addicted 😍"           rightOffset={0}  topOffset={0} />
          <CommentBubble text="I need a 10hr version" rightOffset={32} topOffset={52} />
          <CommentBubble text="nah this is sick 🔥"   rightOffset={64} topOffset={104} />
        </div>
      </div>
    </div>
  );
}