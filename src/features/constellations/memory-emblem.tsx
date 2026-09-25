import Image from "next/image";

const chapterFolders: Record<string, string> = {
  "year-1": "jean",
  "year-2": "zhongli",
  "year-3": "neuvillette",
  "year-4": "baizhu",
  "year-5": "yae-miko",
};

export function MemoryEmblem({
  index,
  chapter,
}: {
  index: number;
  chapter: string;
}) {
  return (
    <Image
      className="memory-emblem"
      src={`/constellations/${chapterFolders[chapter]}/constellation-${index + 1}.png`}
      width={100}
      height={100}
      alt=""
      aria-hidden="true"
      unoptimized
    />
  );
}
