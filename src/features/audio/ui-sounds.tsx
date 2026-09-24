"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UiSoundEngine, type SoundCue } from "./ui-sound-engine";

const SoundContext = createContext<{
  volume: number;
  setVolume: (value: number) => void;
  play: (cue: SoundCue) => void;
}>({
  volume: 35,
  setVolume: () => {},
  play: () => {},
});

export const useUiSounds = () => useContext(SoundContext);

export function UiSounds({ children }: { children: React.ReactNode }) {
  const engine = useRef<UiSoundEngine | null>(null);
  const [volume, updateVolume] = useState(35);
  const play = useCallback((cue: SoundCue) => engine.current?.play(cue), []);
  const setVolume = useCallback((value: number) => {
    updateVolume(value);
    engine.current?.setVolume(value / 100);
  }, []);

  useEffect(() => {
    const audio = new UiSoundEngine();
    engine.current = audio;
    let keyboard = false;
    const control = (target: EventTarget | null) => {
      const element =
        target instanceof Element
          ? target.closest<HTMLElement>("button, a[href], input[type=range]")
          : null;
      return element &&
        !element.matches(":disabled, [aria-disabled=true], [data-sound=none]")
        ? element
        : null;
    };
    const pointer = () => {
      keyboard = false;
      audio.unlock();
    };
    const key = (event: KeyboardEvent) => {
      keyboard = true;
      if (!event.repeat) audio.unlock();
    };
    const hover = (event: PointerEvent) => {
      const element = control(event.target);
      if (
        event.pointerType !== "mouse" ||
        !element ||
        (event.relatedTarget instanceof Node &&
          element.contains(event.relatedTarget))
      )
        return;
      audio.play("hover");
    };
    const focus = (event: FocusEvent) => {
      if (keyboard && control(event.target)) audio.play("hover");
    };
    const click = (event: MouseEvent) => {
      const element = control(event.target);
      if (!element || element.matches("input")) return;
      const cue = element.dataset.sound;
      audio.play(
        cue === "open" || cue === "back" || cue === "change" ? cue : "click",
      );
    };
    document.addEventListener("pointerdown", pointer, true);
    document.addEventListener("keydown", key, true);
    document.addEventListener("pointerover", hover, true);
    document.addEventListener("focusin", focus, true);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerdown", pointer, true);
      document.removeEventListener("keydown", key, true);
      document.removeEventListener("pointerover", hover, true);
      document.removeEventListener("focusin", focus, true);
      document.removeEventListener("click", click, true);
      audio.dispose();
      engine.current = null;
    };
  }, []);

  return (
    <SoundContext.Provider value={{ volume, setVolume, play }}>
      {children}
    </SoundContext.Provider>
  );
}
