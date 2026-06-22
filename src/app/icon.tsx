import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** App icon / favicon — brand "F" mark on Deep Fresh Green. */
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
          background: "linear-gradient(160deg, #5aac55, #205830)",
          color: "#ffffff",
          fontSize: 40,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          borderRadius: 14,
        }}
      >
        F
      </div>
    ),
    { ...size },
  );
}
