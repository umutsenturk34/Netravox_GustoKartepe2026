import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "64px",
          background: "linear-gradient(135deg, #1F190F 0%, #2C2217 70%, #82171B 100%)",
          color: "white",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#AB9363",
            fontSize: 24,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
          }}
        >
          Gusto Kartepe
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 78, lineHeight: 1.02, maxWidth: 720 }}>
            Doganin kucaginda olaganustu bir lezzet deneyimi
          </div>
          <div style={{ color: "#E7E0D5", fontSize: 30, maxWidth: 820 }}>
            Serpme kahvalti, izgara cesitleri ve Kartepe&apos;nin sakin atmosferi bir arada.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
