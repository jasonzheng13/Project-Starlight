"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MascotBrand } from "./mascot-brand";
import { MemoryEmblem } from "./memory-emblem";
import { memories } from "../memories/memories";
import { MemoryViewer } from "../memories/memory-viewer";
import { StarIcon } from "./star-icon";
import { SpaceScene } from "./space-scene";
import { jeanNodes, memoryNodeIndices } from "./jean-art";
import { useUiSounds } from "../audio/ui-sounds";

const chapters = ["I", "II", "III", "IV", "V"];
const firstYearSoundtrack = {
  title: "Mondstadt",
  src: "/api/local-music?constellation=year-1",
};

export function ConstellationExperience() {
  const { play } = useUiSounds();
  const illuminated = useRef(new Set<string>());
  const [selected, setSelected] = useState<string | null>(null);
  const [viewed, setViewed] = useState<string[]>([]);
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

  function openMemory(id: string) {
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
    <main className={`universe ${motion ? "" : "still-sky"}`}>
      <SpaceScene motion={motion} viewed={viewed} />
      <header className="site-header">
        <MascotBrand soundtrack={overview ? null : firstYearSoundtrack} />
        <nav className="chapter-navigation" aria-label="Years together">
          {chapters.map((chapter, index) => (
            <button
              key={chapter}
              disabled={index !== 0}
              aria-current={index === 0 && !overview ? "page" : undefined}
              className={
                index === 0 && !overview ? "chapter active" : "chapter"
              }
              onClick={() => setOverview(false)}
              aria-label={`Year ${chapter}${index !== 0 ? ", coming later" : ""}`}
            >
              <span>{chapter}</span>
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
                key={chapter}
                disabled={index !== 0}
                onClick={() => setOverview(false)}
              >
                <StarIcon />
                <span>YEAR {chapter}</span>
                <strong>
                  {index === 0 ? "Where we began" : "Still to be written"}
                </strong>
                <small>
                  {index === 0
                    ? `Explore ${memories.length} memories →`
                    : "Coming later"}
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
              onClick={() => setOverview(true)}
            >
              ← <span>Our universe</span>
            </button>
            <div className="chapter-heading">
              <p className="eyebrow">THE FIRST CONSTELLATION</p>
              <h1>
                Where we
                <br />
                <em>began.</em>
              </h1>
              <div className="chapter-rule">
                <span />✧<span />
              </div>
              <p className="chapter-description">
                I am Jean, the Dandelion Knight, requesting approval to join
                your party. From this day onwards, my honor and loyalty lie with
                you.
              </p>
              <span className="year-label">
                YEAR I <span>·</span> OUR FIRST CHAPTER
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
                  ? "Our first constellation, shining together."
                  : "A little brighter with every memory."}
              </p>
            </div>
          </aside>

          <section
            className="constellation-stage"
            aria-label="First-year constellation"
          >
            <div className="constellation-map">
              <SpaceScene
                constellation
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
                    left: `${(jeanNodes[memoryNodeIndices[index]][0] / 600) * 100}%`,
                    top: `${(jeanNodes[memoryNodeIndices[index]][1] / 700) * 100}%`,
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
            <h2>Three little infinities.</h2>
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
                  aria-label={`Memory ${memory.number}: ${memory.title}. ${viewed.includes(memory.id) ? "Illuminated; revisit memory" : "Open memory"}`}
                  data-sound="open"
                >
                  <span className="memory-medallion">
                    <MemoryEmblem index={index} />
                  </span>
                  <span className="memory-row-copy">
                    <strong>{memory.title}</strong>
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
          onClose={closeMemory}
          onNext={() => moveMemory(1)}
          onPrevious={() => moveMemory(-1)}
          onViewed={markViewed}
        />
      )}
    </main>
  );
}
