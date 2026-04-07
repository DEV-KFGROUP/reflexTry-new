import { ImageResponse } from "next/og";

export const alt = "Reflextry — Free brain training games";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #020617 0%, #1e1b4b 45%, #0e7490 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: "#f8fafc",
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          Reflextry
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 920,
            padding: "0 48px",
            lineHeight: 1.35,
          }}
        >
          Test your reflexes, memory, and speed — free brain training games
        </div>
      </div>
    ),
    { ...size }
  );
}
