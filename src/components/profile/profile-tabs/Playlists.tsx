import Card from "@/components/ui/Card"

interface Item { id: string; title: string; artist: string; img: string }
interface Props { items: Item[] }

export default function Playlists({ items }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <Card key={item.id} title={item.title} artist={item.artist} img={item.img} type="interactive" />
      ))}
    </div>
  )
}