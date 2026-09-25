import {
  baizhuArt,
  jeanArt,
  neuvilletteArt,
  yaeMikoArt,
  zhongliArt,
  type ChapterArt,
} from "./chapter-art";
import {
  memories as yearOneMemories,
  secondYearMemories,
  zhongliEmblemNames,
  type Memory,
} from "../memories/memories";

export type Chapter = {
  id: string;
  year: string;
  name: string;
  heading: string;
  accent: string;
  quote: string;
  theme: string;
  art: ChapterArt;
  memories: readonly Memory[];
  emblems: readonly string[];
  soundtrack: { title: string; src: string } | null;
};

const blankMemories = (year: number, emblems: readonly string[]): Memory[] =>
  emblems.map((title, index) => ({
    id: `year-${year}-memory-${index + 1}`,
    number: String(index + 1).padStart(2, "0"),
    title,
    note: `A place for a memory from year ${year}. Your photo and words will go here.`,
    alt: `Photograph for year ${year}, memory ${index + 1}`,
    awaitingPhoto: true,
  }));

const neuvilletteEmblems = [
  "Venerable Institution",
  "Juridical Exhortation",
  "Ancient Postulation",
  "Crown of Commiseration",
  "Axiomatic Judgment",
  "Wrathful Recompense",
];
const baizhuEmblems = [
  "Attentive Observation",
  "Incisive Discernment",
  "All Aspects Stabilized",
  "Ancient Art of Perception",
  "The Hidden Ebb and Flow",
  "Elimination of Malicious Qi",
];
const yaeMikoEmblems = [
  "Yakan Offering",
  "Fox's Mooncall",
  "The Seven Glamours",
  "Sakura Channeling",
  "Mischievous Teasing",
  "Forbidden Art: Daisesshou",
];

export const chapters: readonly Chapter[] = [
  {
    id: "year-1",
    year: "I",
    name: "Jean",
    heading: "Where we",
    accent: "began.",
    quote:
      "I am Jean, the Dandelion Knight, requesting approval to join your party. From this day onwards, my honor and loyalty lie with you.",
    theme: "jean-theme",
    art: jeanArt,
    memories: yearOneMemories,
    emblems: yearOneMemories.map((memory) => memory.title),
    soundtrack: {
      title: "Mondstadt",
      src: "/api/local-music?constellation=year-1",
    },
  },
  {
    id: "year-2",
    year: "II",
    name: "Zhongli",
    heading: "Where memories",
    accent: "endure.",
    quote:
      "Osmanthus wine tastes the same as I remember... But where are those who share the memory?",
    theme: "zhongli-theme",
    art: zhongliArt,
    memories: secondYearMemories,
    emblems: zhongliEmblemNames,
    soundtrack: {
      title: "Liyue",
      src: "/api/local-music?constellation=year-2",
    },
  },
  {
    id: "year-3",
    year: "III",
    name: "Neuvillette",
    heading: "The tide",
    accent: "remembers.",
    quote:
      "I, Iudex Neuvillette, hereby declare, people of Fontaine, your sins are forgiven.",
    theme: "neuvillette-theme",
    art: neuvilletteArt,
    memories: blankMemories(3, neuvilletteEmblems),
    emblems: neuvilletteEmblems,
    soundtrack: null,
  },
  {
    id: "year-4",
    year: "IV",
    name: "Baizhu",
    heading: "A gentler",
    accent: "remedy.",
    quote:
      "A poison to one may be a boon to another. What may be considered to be a universally harmful substance to one group of people may prove to be the perfect medicine needed to save another room of patients.",
    theme: "baizhu-theme",
    art: baizhuArt,
    memories: blankMemories(4, baizhuEmblems),
    emblems: baizhuEmblems,
    soundtrack: null,
  },
  {
    id: "year-5",
    year: "V",
    name: "Yae Miko",
    heading: "A little",
    accent: "mischief.",
    quote: "People show you whatever side of themselves they want you to see.",
    theme: "yae-miko-theme",
    art: yaeMikoArt,
    memories: blankMemories(5, yaeMikoEmblems),
    emblems: yaeMikoEmblems,
    soundtrack: null,
  },
];
