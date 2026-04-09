import WaveformTest from "@/components/ui/SausageWaveform"

interface Item { id: string; title: string; artist: string; img: string }
interface Props { items: Item[] }

export default function All({ items }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <WaveformTest key={item.id} />
      ))}
    </div>
  )
}