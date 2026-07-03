import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080B",
          borderRadius: 7,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2.5 }}>
          <div style={{ width: 3, height: 9, background: "#7C5CFF", borderRadius: 2 }} />
          <div style={{ width: 3, height: 16, background: "#9075FF", borderRadius: 2 }} />
          <div style={{ width: 3, height: 6, background: "#FFB74D", borderRadius: 2 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
