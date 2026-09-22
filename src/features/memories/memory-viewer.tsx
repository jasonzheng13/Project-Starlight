"use client";

import { useEffect, useRef, useState } from "react";
import type { Memory } from "./memories";
import { StarIcon } from "../constellations/sky";

export function MemoryViewer({
  memory,
  onClose,
  onNext,
  onPrevious,
  onViewed,
}: {
  memory: Memory;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onViewed: (id: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  const [enlarged, setEnlarged] = useState(false);

  useEffect(() => {
    if (status !== "loading") return;
    const timeout = setTimeout(() => setStatus("error"), 15_000);
    return () => clearTimeout(timeout);
  }, [status, attempt]);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    element?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className={`memory-dialog ${enlarged ? "is-enlarged" : ""}`}
      aria-labelledby="memory-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="memory-sheet">
        <button
          className="dialog-close round-button"
          aria-label="Close memory"
          onClick={onClose}
        >
          ×
        </button>
        <div className="photo-area">
          {status === "loading" && (
            <div className="photo-state" role="status">
              <StarIcon className="loading-star" />
              <p>Opening this memory…</p>
            </div>
          )}
          {status === "error" && (
            <div className="photo-state" role="alert">
              <StarIcon />
              <h3>This star is still here.</h3>
              <p>
                The photo couldn’t open. You can try again or keep exploring.
              </p>
              <button
                className="outline-button"
                onClick={() => {
                  setStatus("loading");
                  setAttempt(attempt + 1);
                }}
              >
                Try again
              </button>
            </div>
          )}
          {/* Original proportions are intentional; these local photos are not public image assets. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={attempt}
            src={`/api/local-media/${memory.id}?attempt=${attempt}`}
            alt={memory.alt}
            className={
              status === "ready" ? "memory-photo ready" : "memory-photo"
            }
            onLoad={() => {
              setStatus("ready");
              onViewed(memory.id);
            }}
            onError={() => setStatus("error")}
          />
          {status === "ready" && (
            <button
              className="enlarge-button"
              onClick={() => setEnlarged(!enlarged)}
              aria-pressed={enlarged}
            >
              {enlarged ? "↙ Reduce photo" : "↗ Enlarge photo"}
            </button>
          )}
        </div>
        <div className="memory-copy">
          <p className="eyebrow">
            YEAR I <span> / </span> MEMORY {memory.number}
          </p>
          <StarIcon className="memory-ornament" />
          <h2 id="memory-title">{memory.title}</h2>
          <div className="fine-rule" />
          <p className="draft-label">DRAFT CAPTION</p>
          <p className="personal-note">{memory.note}</p>
          <p className="memory-footnote">
            One small moment. A place in our universe.
          </p>
          <nav className="viewer-navigation" aria-label="Memory navigation">
            <button onClick={onPrevious}>← Previous</button>
            <span>{memory.number} / 03</span>
            <button onClick={onNext}>Next →</button>
          </nav>
        </div>
      </div>
    </dialog>
  );
}
