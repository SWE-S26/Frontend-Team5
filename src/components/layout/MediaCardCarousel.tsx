import Card from "@/components/ui/Card";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
export default function MediaCardCarousel() {
  const cardData = [
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* Title */}
      <h2 className="text-[22px] font-bold pb-4 text-white">Featured Tracks</h2>

      <div className="relative group/carousel">
        <button className="flex snap-start items-center justify-center absolute left-0 top-5/12 -translate-y-1/2 w-10 h-10 bg-[#303030] rounded-full z-10">
          <FaAngleLeft className="text-white text-2xl" />
        </button>
        {/* Carousel */}
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x">
          {cardData.map((card, index) => (
            <div key={index} className="snap-start">
              <Card img={card.img} title={card.title} artist={card.artist} />
            </div>
          ))}
        </div>
        <button className="flex snap-end items-center justify-center absolute right-0 top-5/12 -translate-y-1/2 w-10 h-10 bg-[#303030] rounded-full z-10">
          <FaAngleRight className="text-white text-2xl" />
        </button>
      </div>
    </div>
  );
}
