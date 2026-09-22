export type Memory = {
  id: string;
  number: string;
  title: string;
  note: string;
  alt: string;
  position: { x: number; y: number };
};

// Draft editorial text, not invented dates or personal recollections.
// Stable IDs are shared by the scene, viewer, and local media endpoint.
export const memories: readonly Memory[] = [
  {
    id: "year-1-memory-1",
    number: "01",
    title: "The first little spark",
    note: "A place for the story behind this photograph. What do you remember about this day? What small detail still makes you smile?",
    alt: "First photograph selected for our first year together",
    position: { x: 31, y: 62 },
  },
  {
    id: "year-1-memory-2",
    number: "02",
    title: "A moment, kept forever",
    note: "A place for the things a photograph cannot quite capture. The conversation, the feeling, the reason this moment belongs in our sky.",
    alt: "Second photograph selected for our first year together",
    position: { x: 48, y: 31 },
  },
  {
    id: "year-1-memory-3",
    number: "03",
    title: "Somewhere with you",
    note: "A place for your own words about this memory, and what it means to look back on it together.",
    alt: "Third photograph selected for our first year together",
    position: { x: 72, y: 49 },
  },
];
