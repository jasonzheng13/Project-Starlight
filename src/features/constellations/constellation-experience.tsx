"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChapterTransition,
  CHAPTER_TRANSITION_MS,
  CHAPTER_REVEAL_MS,
} from "./chapter-transition";
import { MascotBrand } from "./mascot-brand";
import { MemoryEmblem } from "./memory-emblem";
import { MemoryViewer } from "../memories/memory-viewer";
import { StarIcon } from "./star-icon";
import { SpaceScene } from "./space-scene";
import { chapters } from "./chapters";
import { useUiSounds } from "../audio/ui-sounds";

export function ConstellationExperience() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const transitionLock = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const chapter = chapters[chapterIndex];
  const chapterId = chapter.id;
  const memories = chapter.memories;
  const { play } = useUiSounds();
  const illuminated = useRef(new Set<string>());
  const [selected, setSelected] = useState<string | null>(null);
  const [allViewed, setViewed] = useState<string[]>([]);
  const viewed = allViewed.filter((id) => id.startsWith(`${chapterId}-`));
  const [overview, setOverview] = useState(false);
  const [motion, setMotion] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");
  const opener = useRef<HTMLElement | null>(null);
  const activeMemory = memories.find((memory) => memory.id === selected);
  const markViewed = useCallback(
    (id: string) => {
      if (!illuminated.current.has(id)) {
        illuminated.current.add(id);
        play("unlock");
      }
      setViewed((previous) =>
        previous.includes(id) ? previous : [...previous, id],
      );
    },
    [play],
  );

  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function changeChapter(index: number) {
    if (transitionLock.current || index >= chapters.length) return;
    const reveal = () => {
      setSelected(null);
      setChapterIndex(index);
      setOverview(false);
      if (overview)
        requestAnimationFrame(() => {
          document
            .querySelector<HTMLButtonElement>(
              `.chapter-navigation button:nth-child(${index + 1})`,
            )
            ?.focus();
        });
    };
    if (
      (index === chapterIndex && !overview) ||
      !motion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      reveal();
      return;
    }
    transitionLock.current = true;
    setTransitioning(true);
    timers.current = [
      setTimeout(reveal, CHAPTER_REVEAL_MS),
      setTimeout(() => {
        transitionLock.current = false;
        setTransitioning(false);
      }, CHAPTER_TRANSITION_MS),
    ];
  }

  function openMemory(id: string) {
    if (transitionLock.current) return;
    opener.current = document.activeElement as HTMLElement | null;
    setSelected(id);
  }

  function closeMemory() {
    play("back");
    setSelected(null);
    requestAnimationFrame(() => opener.current?.focus());
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setFullscreen(false);
      } else {
        await document.documentElement.requestFullscreen();
        setFullscreen(true);
      }
    } catch {
      setNotice(
        "Fullscreen is unavailable in this browser. You can still explore here.",
      );
    }
  }

  function moveMemory(direction: number) {
    const index = memories.findIndex((memory) => memory.id === selected);
    setSelected(
      memories[(index + direction + memories.length) % memories.length].id,
    );
  }

  return (
    <main className={`universe ${chapter.theme} ${motion ? "" : "still-sky"}`}>
      <SpaceScene motion={motion} viewed={viewed} />
      <ChapterTransition active={transitioning} />
      <header className="site-header">
        <MascotBrand soundtrack={overview ? null : chapter.soundtrack} />
        <nav className="chapter-navigation" aria-label="Years together">
          {chapters.map((chapter, index) => (
            <button
              data-sound="change"
              key={chapter.id}
              aria-disabled={transitioning}
              aria-current={
                index === chapterIndex && !overview ? "page" : undefined
              }
              className={
                index === chapterIndex && !overview
                  ? "chapter active"
                  : "chapter"
              }
              onClick={() => changeChapter(index)}
              aria-label={`Year ${chapter.year}`}
            >
              <span>{chapter.year}</span>
              <i />
            </button>
          ))}
        </nav>
        <div className="header-tools">
          <button
            className="round-button motion-button"
            aria-label={motion ? "Pause sky motion" : "Enable sky motion"}
            aria-pressed={!motion}
            onClick={() => setMotion(!motion)}
          >
            {motion ? "Ⅱ" : "▷"}
          </button>
          <button
            className="round-button"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={toggleFullscreen}
          >
            ⛶
          </button>
        </div>
      </header>

      {overview ? (
        <section className="overview">
          <p className="eyebrow">FIVE CHAPTERS · ONE LITTLE UNIVERSE</p>
          <h1>Written in the stars.</h1>
          <p>Every year, another constellation. Every star, a moment of us.</p>
          <div className="overview-chapters">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                aria-disabled={transitioning}
                onClick={() => changeChapter(index)}
              >
                <StarIcon />
                <span>YEAR {chapter.year}</span>
                <strong>
                  {`${chapter.name} · ${chapter.heading} ${chapter.accent}`}
                </strong>
                <small>
                  {index === 0
                    ? `Explore ${chapter.memories.length} memories →`
                    : `Explore ${chapter.memories.length} waiting stars →`}
                </small>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <>
          <aside className="chapter-intro">
            <button
              data-sound="back"
              className="back-button"
              onClick={() => {
                if (!transitionLock.current) setOverview(true);
              }}
            >
              ← <span>Our universe</span>
            </button>
            <div className="chapter-heading">
              <p className="eyebrow">
                YEAR {chapter.year} · {chapter.name.toUpperCase()}
              </p>
              <h1>
                {chapter.heading}
                <br />
                <em>{chapter.accent}</em>
              </h1>
              <div className="chapter-rule">
                <span />✧<span />
              </div>
              <p className="chapter-description">{chapter.quote}</p>
              <span className="year-label">
                YEAR {chapter.year} <span>·</span> {chapter.name.toUpperCase()}
              </span>
            </div>
            <div className="chapter-progress">
              <p>
                <span>{String(viewed.length).padStart(2, "0")}</span> /{" "}
                {String(memories.length).padStart(2, "0")}{" "}
                <small>MEMORIES ILLUMINATED</small>
              </p>
              <div className="progress-track">
                <span
                  style={{
                    width: `${(viewed.length / memories.length) * 100}%`,
                  }}
                />
              </div>
              <p className="progress-caption" aria-live="polite">
                {viewed.length === memories.length
                  ? `Our ${chapter.name} constellation, shining together.`
                  : "A little brighter with every memory."}
              </p>
            </div>
          </aside>

          <section
            className="constellation-stage"
            aria-label={`Year ${chapter.year} constellation`}
          >
            <div className="constellation-map">
              <SpaceScene
                constellation
                art={chapter.art}
                chapterId={chapterId}
                motion={motion && !activeMemory}
                viewed={viewed}
              />
              {memories.map((memory, index) => (
                <button
                  key={memory.id}
                  data-memory-index={index}
                  data-sound="open"
                  className={`memory-star ${viewed.includes(memory.id) ? "is-viewed" : ""}`}
                  style={{
                    left: `${(chapter.art.nodes[chapter.art.memoryNodes[index]][0] / 600) * 100}%`,
                    top: `${(chapter.art.nodes[chapter.art.memoryNodes[index]][1] / 700) * 100}%`,
                  }}
                  onClick={() => openMemory(memory.id)}
                  aria-label={`Open memory ${memory.number}: ${memory.title}`}
                >
                  <span className="star-focus-ring" />
                  <span className="star-label">
                    <span>{memory.number}</span>
                    {memory.title}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <aside className="memory-index" aria-label="Memory list">
            <p className="eyebrow">THE STARS WE KEEP</p>
            <h2>Six moments to remember.</h2>
            <div className="memory-list">
              <svg
                className="memory-list-arc"
                viewBox="0 0 300 504"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M28 42 C94 152 94 352 28 462" />
              </svg>
              {memories.map((memory, index) => (
                <button
                  key={memory.id}
                  className={
                    viewed.includes(memory.id)
                      ? "memory-row visited"
                      : "memory-row"
                  }
                  onClick={() => openMemory(memory.id)}
                  aria-label={`Memory ${memory.number}: ${chapter.emblems[index]}. ${viewed.includes(memory.id) ? "Illuminated; revisit memory" : "Open memory"}`}
                  data-sound="open"
                >
                  <span className="memory-medallion">
                    <MemoryEmblem index={index} chapter={chapter.id} />
                  </span>
                  <span className="memory-row-copy">
                    <strong>{chapter.emblems[index]}</strong>
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </>
      )}

      {notice && (
        <p className="browser-notice" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            ×
          </button>
        </p>
      )}
      {activeMemory && (
        <MemoryViewer
          key={activeMemory.id}
          memory={activeMemory}
          year={chapter.year}
          placeholderOnly={chapterId !== "year-1"}
          total={memories.length}
          onClose={closeMemory}
          onNext={() => moveMemory(1)}
          onPrevious={() => moveMemory(-1)}
          onViewed={markViewed}
        />
      )}
    </main>
  );
}
