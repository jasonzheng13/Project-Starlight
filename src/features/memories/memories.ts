export type Memory = {
  id: string;
  number: string;
  title: string;
  note: string;
  alt: string;
  awaitingPhoto?: boolean;
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
  },
  {
    id: "year-1-memory-2",
    number: "02",
    title: "A moment, kept forever",
    note: "A place for the things a photograph cannot quite capture. The conversation, the feeling, the reason this moment belongs in our sky.",
    alt: "Second photograph selected for our first year together",
  },
  {
    id: "year-1-memory-3",
    number: "03",
    title: "Somewhere with you",
    note: "A place for your own words about this memory, and what it means to look back on it together.",
    alt: "Third photograph selected for our first year together",
  },
  ...[4, 5, 6].map((number): Memory => ({
    id: `year-1-memory-${number}`,
    number: String(number).padStart(2, "0"),
    title: `Memory ${String(number).padStart(2, "0")}`,
    note: "A place for another moment from our first year. Your photo and personal words will go here.",
    alt: `Photograph for first-year memory ${number}`,
    awaitingPhoto: true,
  })),
];

export const zhongliEmblemNames = [
  "Rock, the Backbone of Earth",
  "Stone, the Cradle of Jade",
  "Jade, Shimmering through Darkness",
  "Topaz, Unbreakable and Fearless",
  "Lazuli, Herald of the Order",
  "Chrysos, Bounty of Dominator",
];

export const secondYearMemories: readonly Memory[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: `year-2-memory-${index + 1}`,
    number: String(index + 1).padStart(2, "0"),
    title: `Memory ${String(index + 1).padStart(2, "0")}`,
    note: "A place for a moment from our second year. Your photo and words will go here.",
    alt: `Photograph for second-year memory ${index + 1}`,
    awaitingPhoto: true,
  }),
);
