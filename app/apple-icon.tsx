import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const bars = [
    { h: 46, c: "#6B58E8" },
    { h: 74, c: "#7C5CFF" },
    { h: 108, c: "#9075FF" },
    { h: 68, c: "#7C5CFF" },
    { h: 40, c: "#FFB74D" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0B0A10 0%, #16131F 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* svarita accent tick — the rising-pitch mark the name refers to */}
          <div
            style={{
              width: 26,
              height: 5,
              borderRadius: 3,
              background: "#FFB74D",
              marginBottom: 14,
              transform: "rotate(-18deg)",
            }}
          />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 9 }}>
            {bars.map((b, i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: b.h,
                  background: b.c,
                  borderRadius: 7,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
