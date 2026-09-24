"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUiSounds } from "../audio/ui-sounds";

type Playback = "loading" | "playing" | "paused" | "blocked" | "unavailable";

export function MascotBrand({
  soundtrack,
}: {
  soundtrack: { title: string; src: string } | null;
}) {
  const effects = useUiSounds();
  const playEffect = effects.play;
  const lastEffectsVolume = useRef(35);
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(30);
  const [playback, setPlayback] = useState<Playback>("loading");
  const audio = useRef<HTMLAudioElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const lastVolume = useRef(30);
  const currentVolume = useRef(30);

  useEffect(() => {
    const player = audio.current!;
    if (!soundtrack) return;
    let active = true;
    player.volume = currentVolume.current / 100;
    void player.play().catch((error: DOMException) => {
      if (!active || error.name === "AbortError") return;
      setPlayback(error.name === "NotAllowedError" ? "blocked" : "unavailable");
    });
    return () => {
      active = false;
      player.pause();
      player.currentTime = 0;
    };
  }, [soundtrack]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        playEffect("back");
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open, playEffect]);

  async function play() {
    if (!soundtrack) return;
    const player = audio.current!;
    const source = player.getAttribute("src");
    if (player.error) player.load();
    setPlayback("loading");
    try {
      await player.play();
    } catch (error) {
      if (player.getAttribute("src") !== source) return;
      if (error instanceof DOMException && error.name === "AbortError") return;
      setPlayback(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "blocked"
          : "unavailable",
      );
    }
  }

  function changeVolume(value: number) {
    currentVolume.current = value;
    setVolume(value);
    if (value > 0) lastVolume.current = value;
    if (audio.current) {
      audio.current.volume = value / 100;
      audio.current.muted = value === 0;
    }
  }

  const status = {
    loading: "Loading music…",
    playing: "Now playing",
    paused: "Paused",
    blocked: "Press play to begin",
    unavailable: "Soundtrack not available yet",
  }[playback];

  return (
    <div className="mascot-brand" ref={root}>
      <audio
        ref={audio}
        src={soundtrack?.src}
        loop
        preload="auto"
        onLoadStart={() => {
          if (soundtrack) setPlayback("loading");
        }}
        onPlaying={() => {
          if (soundtrack) setPlayback("playing");
        }}
        onPause={() =>
          setPlayback((previous) =>
            previous === "playing" ? "paused" : previous,
          )
        }
        onError={() => {
          if (soundtrack) setPlayback("unavailable");
        }}
      />
      <button
        ref={trigger}
        className="mascot-music-button"
        aria-label="Music volume controls"
        aria-expanded={open}
        aria-controls="music-controls"
        title="Music & volume"
        onClick={() => {
          setOpen(!open);
          if (!open && playback === "blocked") void play();
        }}
      >
        <Image
          className="cat-mascot"
          src="/mascots/cat-b.png"
          alt="Charcoal cat mascot with a gold forehead star"
          width={80}
          height={80}
          priority
        />
        <span className="music-indicator" aria-hidden="true">
          {playback === "playing" && volume > 0 ? "♫" : "♪"}
        </span>
      </button>
      <Link className="wordmark" href="/" aria-label="Starlight home">
        <span>STARLIGHT</span>
      </Link>
      {open && (
        <section
          id="music-controls"
          className="music-popover"
          aria-label="Music controls"
        >
          <div className="music-heading">
            <span>{soundtrack?.title ?? "Music"}</span>
            <button
              className="music-play"
              aria-label={playback === "playing" ? "Pause music" : "Play music"}
              disabled={!soundtrack || playback === "loading"}
              onClick={() =>
                playback === "playing" ? audio.current?.pause() : void play()
              }
            >
              {playback === "playing" ? "Ⅱ" : "▷"}
            </button>
          </div>
          <div className="music-volume-row">
            <button
              className="music-mute"
              aria-label={volume === 0 ? "Unmute music" : "Mute music"}
              aria-pressed={volume === 0}
              onClick={() =>
                changeVolume(volume === 0 ? lastVolume.current : 0)
              }
            >
              {volume === 0 ? "○" : "♪"}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume}
              aria-label="Music volume"
              aria-valuetext={`${volume} percent`}
              onChange={(event) => changeVolume(Number(event.target.value))}
            />
            <output aria-hidden="true">{volume}%</output>
          </div>
          <p role="status">
            {soundtrack ? status : "Choose a constellation to hear its music"}
          </p>
          <div className="music-heading effects-heading">
            <span>Effects</span>
          </div>
          <div className="music-volume-row">
            <button
              className="music-mute"
              data-sound="none"
              aria-label={
                effects.volume === 0 ? "Unmute effects" : "Mute effects"
              }
              aria-pressed={effects.volume === 0}
              onClick={() =>
                effects.setVolume(
                  effects.volume === 0 ? lastEffectsVolume.current : 0,
                )
              }
            >
              {effects.volume === 0 ? "○" : "♪"}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={effects.volume}
              aria-label="Effects volume"
              aria-valuetext={`${effects.volume} percent`}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (value > 0) lastEffectsVolume.current = value;
                effects.setVolume(value);
              }}
              onPointerUp={() => playEffect("click")}
              onKeyUp={(event) => {
                if (
                  [
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                    "Home",
                    "End",
                  ].includes(event.key)
                )
                  playEffect("click");
              }}
            />
            <output aria-hidden="true">{effects.volume}%</output>
          </div>
        </section>
      )}
    </div>
  );
}
