"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { memories } from "../memories/memories";
import { MemoryViewer } from "../memories/memory-viewer";
import { ConstellationArt, Sky, StarIcon } from "./sky";

const chapters = ["I", "II", "III", "IV", "V"];

export function ConstellationExperience() {
  const [selected, setSelected] = useState<string | null>(null);
  const [viewed, setViewed] = useState<string[]>([]);
  const [overview, setOverview] = useState(false);
  const [motion, setMotion] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");
  const opener = useRef<HTMLElement | null>(null);
  const activeMemory = memories.find((memory) => memory.id === selected);
  const markViewed = useCallback((id: string) => {
    setViewed((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    );
  }, []);

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
      <Sky />
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Starlight home">
          <StarIcon />
          <span>
            STARLIGHT<small>A UNIVERSE OF US</small>
          </span>
        </Link>
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
                  {index === 0 ? "Explore 3 memories →" : "Coming later"}
                </small>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <>
          <aside className="chapter-intro">
            <button className="back-button" onClick={() => setOverview(true)}>
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
                Before a universe of memories,
                <br />
                there was a little spark.
              </p>
              <span className="year-label">
                YEAR I <span>·</span> OUR FIRST CHAPTER
              </span>
            </div>
            <div className="chapter-progress">
              <p>
                <span>{String(viewed.length).padStart(2, "0")}</span> / 03{" "}
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
              <ConstellationArt viewed={viewed} />
              {memories.map((memory) => (
                <button
                  key={memory.id}
                  className={`memory-star ${viewed.includes(memory.id) ? "is-viewed" : ""}`}
                  style={{
                    left: `${memory.position.x}%`,
                    top: `${memory.position.y}%`,
                  }}
                  onClick={() => openMemory(memory.id)}
                  aria-label={`Open memory ${memory.number}: ${memory.title}`}
                >
                  <span className="star-halo" />
                  <span className="star-orbit" />
                  <StarIcon />
                  <span className="star-label">
                    <span>{memory.number}</span>
                    {memory.title}
                  </span>
                </button>
              ))}
              <div className="map-coordinate coordinate-top">
                CHAPTER I <span>✧</span> THE BEGINNING
              </div>
              <p className="map-caption">
                <span>✧</span> Every little moment has a place in our sky.
              </p>
            </div>
          </section>

          <aside className="memory-index" aria-label="Memory list">
            <p className="eyebrow">THE STARS WE KEEP</p>
            <h2>Three little infinities.</h2>
            <div className="memory-list">
              {memories.map((memory) => (
                <button
                  key={memory.id}
                  className={
                    viewed.includes(memory.id)
                      ? "memory-row visited"
                      : "memory-row"
                  }
                  onClick={() => openMemory(memory.id)}
                >
                  <span className="memory-medallion">
                    <StarIcon />
                  </span>
                  <span className="memory-row-copy">
                    <small>MEMORY {memory.number}</small>
                    <strong>{memory.title}</strong>
                    <span>
                      {viewed.includes(memory.id)
                        ? "Illuminated · revisit"
                        : "Open this memory"}
                    </span>
                  </span>
                  <span className="row-arrow">›</span>
                </button>
              ))}
            </div>
            <p className="index-note">
              Some things are too lovely
              <br />
              to leave as just a memory.
            </p>
          </aside>
        </>
      )}

      <footer className="site-footer">
        <span>
          <i /> OUR STORY, AMONG THE STARS
        </span>
        <p>
          {overview
            ? "Choose a chapter to begin"
            : "Choose a glowing star to open a memory"}
        </p>
        <span>
          MADE OF LITTLE MOMENTS <StarIcon />
        </span>
      </footer>
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
