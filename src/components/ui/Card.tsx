type CardProps = {
  img?: string;
  subtitle?: string;
  artist?: string;
};

export default function Card({
  img = "/Graduation.jpg",
  subtitle = "Gradution",
  artist = "Kanye West",
}: CardProps) {
  return (
    <>
      <div className="relative w-30 aspect-square rounded overflow-hidden group cursor-pointer bg-[#303030]">
        {img && (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
          />
        )}
        {img && (
          <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100" />
        )}
      </div>
      {/* <br /> */}
      <p> {subtitle}</p>
      <p> {artist}</p>
    </>
  );
}
