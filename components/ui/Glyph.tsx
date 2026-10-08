type GlyphName =
  | "plan"
  | "check"
  | "bag"
  | "ticket"
  | "plane"
  | "plus"
  | "bell"
  | "refresh"
  | "home"
  | "arrow";

export function Glyph({ name }: { name: GlyphName }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {name === "plan" ? (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3.5v3M16 3.5v3M4 10h16" />
          <path d="M9 15l2 2 4-4" />
        </>
      ) : null}
      {name === "check" ? <path d="M5 12.5l4.2 4.2L19 7" /> : null}
      {name === "bag" ? (
        <>
          <path d="M6 8h12l-1 12H7L6 8z" />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" />
        </>
      ) : null}
      {name === "ticket" ? (
        <>
          <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" />
        </>
      ) : null}
      {name === "plane" ? <path d="M3 12l18-7-7 18-2-7-7-4z" /> : null}
      {name === "plus" ? <path d="M12 5v14M5 12h14" /> : null}
      {name === "bell" ? (
        <>
          <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </>
      ) : null}
      {name === "refresh" ? (
        <>
          <path d="M20 12a8 8 0 1 1-2.2-5.5" />
          <path d="M20 4v5h-5" />
        </>
      ) : null}
      {name === "home" ? <path d="M4 11.5L12 4l8 7.5V20H4v-8.5z" /> : null}
      {name === "arrow" ? <path d="M5 12h14M13 6l6 6-6 6" /> : null}
    </svg>
  );
}
