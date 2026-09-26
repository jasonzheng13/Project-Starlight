"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { galleryRegions, type GalleryRegion } from "./gallery-regions";
import { type Memory } from "./memories";
import { galleryPhotos, type GalleryPhoto } from "./gallery-photos";
import { useUiSounds } from "../audio/ui-sounds";
import { StarIcon } from "../constellations/star-icon";

function Photo({
  photo,
  onReady,
}: {
  photo: GalleryPhoto;
  onReady?: () => void;
}) {
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (status !== "loading") return;
    const timeout = setTimeout(() => setStatus("error"), 15000);
    return () => clearTimeout(timeout);
  }, [status, attempt]);
  return (
    <>
      {/* Private images must continue through the gated local endpoint. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={attempt}
        src={`/api/local-media/${photo.id}?attempt=${attempt}`}
        alt={photo.alt}
        className={`gallery-photo ${status}`}
        onLoad={() => {
          setStatus("ready");
          onReady?.();
        }}
        onError={() => setStatus("error")}
      />
      {status === "loading" && (
        <span
          className="gallery-loading"
          role="status"
          aria-label="Loading photo"
        >
          <StarIcon />
        </span>
      )}
      {status === "error" && (
        <span
          className="gallery-error"
          role="alert"
          aria-label="Photo unavailable"
        >
          <StarIcon />
        </span>
      )}
      {status === "error" && onReady && (
        <button
          className="gallery-retry"
          aria-label="Retry photo"
          onClick={() => {
            setStatus("loading");
            setAttempt(attempt + 1);
          }}
        >
          ↻
        </button>
      )}
    </>
  );
}

export function MemoryViewer({
  memory,
  year = "I",
  region = "mondstadt",
  jadeTint = false,
  total = 6,
  onClose,
  onNext,
  onPrevious,
  onViewed,
}: {
  memory: Memory;
  year?: string;
  region?: GalleryRegion;
  jadeTint?: boolean;
  total?: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onViewed: (id: string) => void;
}) {
  const { play } = useUiSounds();
  const dialog = useRef<HTMLDialogElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const photos = galleryPhotos[memory.id] ?? [];
  const slots = Array.from(
    { length: Math.max(6, photos.length) },
    (_, index) => photos[index],
  );
  const returnToGallery = () => {
    const index = focused;
    setFocused(null);
    requestAnimationFrame(() => {
      if (index !== null) tiles.current[index]?.focus();
    });
  };
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);
  useEffect(() => {
    if (focused !== null) back.current?.focus();
  }, [focused]);
  const movePhoto = (direction: number) =>
    setFocused((index) =>
      index === null ? null : (index + direction + slots.length) % slots.length,
    );
  return (
    <dialog
      ref={dialog}
      className={`gallery-dialog ${focused !== null ? "photo-focused" : ""}`}
      data-region={region}
      style={
        {
          "--region-image": `url("${galleryRegions[region].image}")`,
          "--region-color": jadeTint ? "#83bf96" : galleryRegions[region].color,
        } as CSSProperties
      }
      aria-label={`Year ${year}, memory ${memory.number} gallery`}
      onCancel={(event) => {
        event.preventDefault();
        if (focused !== null) {
          play("back");
          returnToGallery();
        } else onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (focused === null) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          play("change");
          movePhoto(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      {focused === null ? (
        <section className="gallery-shell">
          <header className="gallery-header">
            <h2 className="gallery-banner">
              <span aria-hidden="true">✦</span> Memory {Number(memory.number)}{" "}
              <span aria-hidden="true">✦</span>
            </h2>
            <button
              className="gallery-control gallery-close"
              aria-label="Close memory"
              data-sound="none"
              onClick={onClose}
            >
              ×
            </button>
          </header>
          <div className="gallery-grid">
            {slots.map((photo, index) => (
              <button
                key={photo?.id ?? index}
                ref={(element) => {
                  tiles.current[index] = element;
                }}
                className="gallery-tile"
                style={{ "--tile-index": index } as CSSProperties}
                aria-label={
                  photo
                    ? `Enlarge photo ${index + 1}`
                    : `Preview empty photo slot ${index + 1}`
                }
                data-sound="open"
                onClick={() => setFocused(index)}
              >
                {photo ? (
                  <Photo photo={photo} />
                ) : (
                  <span className="gallery-empty" aria-hidden="true">
                    <span className="empty-orbit" />
                    <StarIcon />
                  </span>
                )}
                <span className="tile-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <nav className="gallery-footer" aria-label="Memory navigation">
            <button
              className="gallery-control"
              aria-label="Previous memory"
              data-sound="change"
              onClick={onPrevious}
            >
              ‹
            </button>
            <span>
              {memory.number} <i>/</i> {String(total).padStart(2, "0")}
            </span>
            <button
              className="gallery-control"
              aria-label="Next memory"
              data-sound="change"
              onClick={onNext}
            >
              ›
            </button>
          </nav>
        </section>
      ) : (
        <section className="gallery-focus" aria-label="Focused photo">
          <button
            ref={back}
            className="gallery-control focus-back"
            aria-label="Back to gallery"
            data-sound="back"
            onClick={returnToGallery}
          >
            ↙
          </button>
          <button
            className="gallery-control focus-close"
            aria-label="Close memory"
            data-sound="none"
            onClick={onClose}
          >
            ×
          </button>
          <div className="focused-image" key={focused}>
            {slots[focused] ? (
              <Photo
                photo={slots[focused]}
                onReady={() => onViewed(memory.id)}
              />
            ) : (
              <span
                className="gallery-empty focused-empty"
                role="img"
                aria-label="Empty photo preview"
              >
                <span className="empty-orbit" />
                <StarIcon />
              </span>
            )}
          </div>
          <nav className="focus-navigation" aria-label="Photo navigation">
            <button
              className="gallery-control"
              aria-label="Previous photo"
              data-sound="change"
              onClick={() => movePhoto(-1)}
            >
              ‹
            </button>
            <span>
              {String(focused + 1).padStart(2, "0")} /{" "}
              {String(slots.length).padStart(2, "0")}
            </span>
            <button
              className="gallery-control"
              aria-label="Next photo"
              data-sound="change"
              onClick={() => movePhoto(1)}
            >
              ›
            </button>
          </nav>
        </section>
      )}
    </dialog>
  );
}
