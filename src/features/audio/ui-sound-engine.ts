export type SoundCue =
  "hover" | "click" | "open" | "back" | "change" | "unlock";

const clips: Record<SoundCue, string> = {
  hover: "button",
  click: "button",
  open: "open",
  back: "change",
  change: "change",
  unlock: "unlock",
};

// Owns browser audio resources; components only describe the action that happened.
export class UiSoundEngine {
  private context?: AudioContext;
  private gain?: GainNode;
  private buffers = new Map<string, AudioBuffer>();
  private voices = new Set<AudioBufferSourceNode>();
  private volume = 0.35;
  private lastSound = -Infinity;
  private disposed = false;
  private abort = new AbortController();

  unlock() {
    if (this.disposed || typeof AudioContext === "undefined") return;
    if (!this.context) {
      const context = new AudioContext();
      this.context = context;
      this.gain = context.createGain();
      this.gain.gain.value = this.volume;
      this.gain.connect(context.destination);
      for (const clip of new Set(Object.values(clips))) {
        void fetch(`/api/local-sounds/${clip}`, { signal: this.abort.signal })
          .then((response) => {
            if (!response.ok) throw new Error("Sound unavailable");
            return response.arrayBuffer();
          })
          .then((bytes) => context.decodeAudioData(bytes))
          .then((buffer) => {
            if (!this.disposed) this.buffers.set(clip, buffer);
          })
          .catch(() => {
            /* Audio is optional; navigation must still work. */
          });
      }
    }
    if (this.context.state === "suspended")
      void this.context.resume().catch(() => {});
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.gain && this.context) {
      this.gain.gain.setTargetAtTime(
        this.volume,
        this.context.currentTime,
        0.015,
      );
    }
  }

  play(cue: SoundCue) {
    const context = this.context;
    const buffer = this.buffers.get(clips[cue]);
    const now = performance.now();
    if (
      !context ||
      context.state !== "running" ||
      !buffer ||
      !this.gain ||
      this.volume === 0 ||
      document.hidden ||
      this.disposed
    )
      return;
    // Drop stale/unloaded cues rather than replaying them after the action.
    if (cue === "hover" && now - this.lastSound < 100) return;
    this.lastSound = now;
    if (this.voices.size >= 4) {
      const oldest = this.voices.values().next().value;
      oldest?.stop();
      if (oldest) this.voices.delete(oldest);
    }
    const source = context.createBufferSource();
    const level = context.createGain();
    source.buffer = buffer;
    level.gain.value = cue === "hover" ? 0.25 : cue === "unlock" ? 0.55 : 0.7;
    source.connect(level).connect(this.gain);
    this.voices.add(source);
    source.onended = () => {
      this.voices.delete(source);
      source.disconnect();
      level.disconnect();
    };
    source.start();
  }

  dispose() {
    this.disposed = true;
    this.abort.abort();
    for (const source of this.voices) source.stop();
    this.voices.clear();
    this.buffers.clear();
    void this.context?.close().catch(() => {});
  }
}
