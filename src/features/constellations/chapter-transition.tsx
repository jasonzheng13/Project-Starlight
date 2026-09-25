import type { CSSProperties } from "react";

export const CHAPTER_TRANSITION_MS = 2400;
export const CHAPTER_REVEAL_MS = 1100;
const elements = ["Pyro", "Hydro", "Anemo", "Electro", "Dendro", "Cryo", "Geo"];

export function ChapterTransition({ active }: { active: boolean }) {
  return (
    <>
      <link rel="preload" as="image" href="/transitions/elements.webp" />
      {active && (
        <div
          className="chapter-transition"
          aria-hidden="true"
          style={
            {
              "--transition-duration": `${CHAPTER_TRANSITION_MS}ms`,
            } as CSSProperties
          }
        >
          <div className="loading-elements">
            {elements.map((element, index) => (
              <span
                key={element}
                className="loading-element"
                data-element={element}
                style={{
                  maskPosition: `${(index / 6) * 100}% center`,
                  animationDelay: `${360 + index * 90}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
