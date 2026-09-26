export const galleryRegions = {
  mondstadt: { image: "/images/regions/mondstadt.jpg", color: "#56bdb1" },
  liyue: { image: "/images/regions/liyue.jpg", color: "#d8b466" },
  fontaine: { image: "/images/regions/fontaine.jpg", color: "#6abfe5" },
  inazuma: { image: "/images/regions/inazuma.png", color: "#c895de" },
} as const;

export type GalleryRegion = keyof typeof galleryRegions;
