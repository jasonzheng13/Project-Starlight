import Image from "next/image";

// Jean's C1–C6 artwork, in game order. Provenance: doc/13-jean-icons.md.
const icons = [1, 2, 3, 4, 5, 6].map(
  (number) => `/constellations/jean/constellation-${number}.png`,
);

export function MemoryEmblem({ index }: { index: number }) {
  return (
    <Image
      className="memory-emblem"
      src={icons[index % icons.length]}
      width={100}
      height={100}
      alt=""
      aria-hidden="true"
      unoptimized
    />
  );
}
