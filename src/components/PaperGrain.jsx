import React from "react";

// 섹션마다 seed만 다르게 줘서 "같은 종이, 다른 장" 느낌을 낸다.
// 이미지 파일 없이 SVG feTurbulence로 만들어서 용량이 들지 않는다.
export function PaperGrain({ seed = 3, baseFrequency = 0.85, octaves = 2, opacity = 0.14 }) {
  const id = `grain-${seed}`;
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves={octaves} seed={seed} result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
        </filter>
      </svg>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#${id})`,
          opacity,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
    </>
  );
}
