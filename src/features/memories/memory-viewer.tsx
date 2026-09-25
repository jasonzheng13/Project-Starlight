"use client";

import { useEffect, useRef, useState } from "react";
import { type Memory } from "./memories";
import { StarIcon } from "../constellations/star-icon";

export function MemoryViewer({
  memory,
  year = "I",
  total = 6,
  placeholderOnly = false,
  onClose,
  onNext,
  onPrevious,
  onViewed,
}: {
  memory: Memory;
  year?: string;
  total?: number;
  placeholderOnly?: boolean;
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
    if (placeholderOnly || status !== "loading") return;
    const timeout = setTimeout(() => setStatus("error"), 15_000);
    return () => clearTimeout(timeout);
  }, [status, attempt, placeholderOnly]);

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
          data-sound="none"
          aria-label="Close memory"
          onClick={onClose}
        >
          ×
        </button>
        <div className="photo-area">
          {placeholderOnly && (
            <div className="photo-state">
              <StarIcon />
              <h3>A memory waiting to be added.</h3>
              <p>Your Year {year} photo belongs here.</p>
            </div>
          )}
          {!placeholderOnly && status === "loading" && (
            <div className="photo-state" role="status">
              <StarIcon className="loading-star" />
              <p>Opening this memory…</p>
            </div>
          )}
          {status === "error" && (
            <div className="photo-state" role="alert">
              <StarIcon />
              <h3>
                {memory.awaitingPhoto
                  ? "A memory waiting to be added."
                  : "This star is still here."}
              </h3>
              <p>
                {memory.awaitingPhoto
                  ? "Your next first-year photo belongs here. You can keep exploring and return once it has been added."
                  : "The photo couldn’t open. You can try again or keep exploring."}
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
          {!placeholderOnly && (
            // eslint-disable-next-line @next/next/no-img-element
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
          )}
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
            YEAR {year} <span> / </span> MEMORY {memory.number}
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
            <button data-sound="change" onClick={onPrevious}>
              ← Previous
            </button>
            <span>
              {memory.number} / {String(total).padStart(2, "0")}
            </span>
            <button data-sound="change" onClick={onNext}>
              Next →
            </button>
          </nav>
        </div>
      </div>
    </dialog>
  );
}
