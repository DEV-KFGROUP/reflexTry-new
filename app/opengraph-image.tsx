import { ImageResponse } from "next/og";

export const alt = "Reflextry — 76 Free Cognitive Benchmarks & 9 Mensa Logic Puzzles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 52%, #1d4ed8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
          color: "#f8fafc",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              R
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>
              Reflextry
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#93c5fd",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Cognitive Performance Lab
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Brain Speed, Reflex &amp; Mensa Logic Puzzles
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: "#cbd5e1",
            }}
          >
            Millisecond reaction time tests, working memory benchmarks, 9 daily logic &amp; word puzzles (10,800+ levels), Wordle, Tetris, Chess &amp; 3D Labs.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            borderTop: "1px solid rgba(148, 163, 184, 0.25)",
            paddingTop: 28,
            fontSize: 20,
            color: "#e2e8f0",
            fontWeight: 600,
          }}
        >
          <span>76 Free Browser Tools</span>
          <span style={{ color: "#64748b" }}>·</span>
          <span>10,800+ Puzzle Levels</span>
          <span style={{ color: "#64748b" }}>·</span>
          <span>Zero Sign-Up Required</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
