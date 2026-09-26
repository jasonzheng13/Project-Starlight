export type GalleryPhoto = { id: string; alt: string };

// Each key is one moment. Add photo IDs here and allowlist their files in the media route.
export const galleryPhotos: Readonly<Record<string, readonly GalleryPhoto[]>> =
  {
    "year-1-memory-1": [
      { id: "year-1-memory-1", alt: "First selected photograph" },
    ],
    "year-1-memory-2": [
      { id: "year-1-memory-2", alt: "Second selected photograph" },
    ],
    "year-1-memory-3": [
      { id: "year-1-memory-3", alt: "Third selected photograph" },
    ],
  };
