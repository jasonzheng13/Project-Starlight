"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ConstellationExperience } from "../constellations/constellation-experience";
import { introTiming } from "./intro-timing";

type Stage = "waiting" | "entering" | "revealing" | "finished";

export function StartScreen() {
  const phase = useRef<Stage>("waiting");
  const [stage, setStage] = useState<Stage>("waiting");
  const video = useRef<HTMLVideoElement>(null);
  const dissolve = useRef<HTMLCanvasElement>(null);
  const music = useRef<HTMLAudioElement>(null);
  const click = useRef<HTMLAudioElement>(null);
  const doorAudioStarted = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [holding, setHolding] = useState(false);
  const reduced = useRef(false);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dissolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enterConstellation = useCallback(() => {
    if (phase.current === "revealing" || phase.current === "finished") return;
    if (watchdog.current) clearTimeout(watchdog.current);
    video.current?.pause();
    music.current?.pause();
    click.current?.pause();
    phase.current = "revealing";
    setStage("revealing");
    revealTimer.current = setTimeout(
      () => {
        phase.current = "finished";
        setStage("finished");
        requestAnimationFrame(() =>
          document
            .querySelector<HTMLButtonElement>(".chapter-navigation button")
            ?.focus(),
        );
      },
      reduced.current ? 0 : 900,
    );
  }, []);

  // Music has its own clock: rewinding/slowing the scenery must not affect it.
  useEffect(() => {
    const soundtrack = music.current;
    const clickSound = click.current;
    if (!soundtrack) return;
    soundtrack.volume = 0.3;
    if (clickSound) clickSound.volume = 0.35;
    const resume = () => {
      if (phase.current !== "waiting" && phase.current !== "entering") return;
      if (!doorAudioStarted.current) void soundtrack.play().catch(() => {});
    };
    resume();
    document.addEventListener("pointerdown", resume);
    document.addEventListener("keydown", resume);
    return () => {
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("keydown", resume);
      soundtrack.pause();
      clickSound?.pause();
    };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduced.current = preference.matches;
      if (preference.matches) {
        video.current?.pause();
        if (phase.current === "entering") enterConstellation();
      } else if (ready && phase.current === "waiting") {
        void video.current?.play().catch(() => setFailed(true));
      }
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, [enterConstellation, ready]);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    const initialize = () => {
      if (player.duration <= introTiming.reveal) {
        setFailed(true);
        return;
      }
      player.playbackRate = introTiming.idlePlaybackRate;
      player.currentTime = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? introTiming.stillFrame
        : introTiming.loopStart;
    };
    // Fast local loads can deliver metadata before hydration attaches handlers.
    if (player.readyState >= 1) initialize();
    player.addEventListener("loadedmetadata", initialize);
    return () => player.removeEventListener("loadedmetadata", initialize);
  }, []);

  useEffect(
    () => () => {
      if (watchdog.current) clearTimeout(watchdog.current);
      if (revealTimer.current) clearTimeout(revealTimer.current);
      if (dissolveTimer.current) clearTimeout(dissolveTimer.current);
    },
    [],
  );

  const checkFrame = useCallback(() => {
    const player = video.current;
    if (!player || player.seeking) return;
    // The recording owns the door sounds, so buffering cannot desynchronize them.
    if (phase.current === "entering" && player.currentTime >= 12 && !doorAudioStarted.current) {
      doorAudioStarted.current = true;
      music.current?.pause();
      player.volume = 0.5;
      player.muted = false;
    }
    if (
      phase.current === "entering" &&
      player.currentTime >= introTiming.reveal
    ) {
      enterConstellation();
    } else if (
      phase.current === "waiting" &&
      !reduced.current &&
      player.currentTime >= introTiming.loopEnd
    ) {
      const canvas = dissolve.current;
      if (canvas) {
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
        canvas.getContext("2d")?.drawImage(player, 0, 0);
        setHolding(true);
      }
      player.currentTime = introTiming.loopStart;
    }
  }, [enterConstellation]);

  useEffect(() => {
    const player = video.current;
    if (!player || !ready || !player.requestVideoFrameCallback) return;
    let frame = 0;
    const tick = () => {
      checkFrame();
      frame = player.requestVideoFrameCallback(tick);
    };
    frame = player.requestVideoFrameCallback(tick);
    return () => player.cancelVideoFrameCallback(frame);
  }, [checkFrame, ready]);

  function start() {
    if (phase.current !== "waiting") return;
    void click.current?.play().catch(() => {});
    if (reduced.current || !ready || failed || !video.current) {
      enterConstellation();
      return;
    }
    phase.current = "entering";
    video.current.playbackRate = 1;
    setStage("entering");
    setHolding(false);
    watchdog.current = setTimeout(enterConstellation, introTiming.timeoutMs);
    void video.current.play().catch(enterConstellation);
  }

  return (
    <>
      {stage !== "finished" && stage !== "revealing" && (
        <>
          <audio ref={music} data-intro-music src="/api/local-music?constellation=intro" preload="auto" loop />
          <audio ref={click} src="/api/local-sounds/button" preload="auto" />
        </>
      )}
      {(stage === "revealing" || stage === "finished") && (
        <ConstellationExperience />
      )}
      {stage !== "finished" && (
        <section
          className={`start-screen ${stage} ${ready ? "is-ready" : ""}`}
          aria-label="Start screen"
        >
          <div className="intro-frame">
            <div className="intro-scenery" aria-hidden="true">
              <video
                ref={video}
                className="intro-video"
                src="/api/local-intro"
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                onSeeked={() => {
                  setReady(true);
                  if (dissolveTimer.current)
                    clearTimeout(dissolveTimer.current);
                  dissolveTimer.current = setTimeout(
                    () => setHolding(false),
                    40,
                  );
                  if (
                    !reduced.current &&
                    (phase.current === "waiting" ||
                      phase.current === "entering")
                  )
                    void video.current?.play().catch(() => {
                      setFailed(true);
                      if (phase.current === "entering") enterConstellation();
                    });
                }}
                onTimeUpdate={checkFrame}
                onEnded={() => {
                  if (phase.current === "entering") enterConstellation();
                }}
                onError={() => {
                  setFailed(true);
                  if (phase.current === "entering") enterConstellation();
                }}
              />
              <canvas
                ref={dissolve}
                className={`intro-video intro-dissolve ${holding ? "hold" : ""}`}
              />
            </div>
            {stage === "waiting" && (
              <button
                className={`start-game ${ready ? "recorded-label" : ""}`}
                data-sound="none"
                onClick={start}
              >
                <span>Start Game</span>
              </button>
            )}
          </div>
          {stage === "entering" && (
            <span className="intro-status" role="status">
              Opening the constellation
            </span>
          )}
        </section>
      )}
    </>
  );
}
