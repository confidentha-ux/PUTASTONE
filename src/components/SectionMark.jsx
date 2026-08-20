import React from "react";

// 진행 상태를 프로그레스 바 대신 책의 장 번호처럼 보여준다.
export function SectionMark({ number, title }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        borderBottom: "1px solid #1c1a17",
        paddingBottom: 8,
        marginBottom: 18,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 800, color: "#1c1a17", letterSpacing: "-0.01em" }}>{title}</span>
      <span style={{ fontSize: 10, color: "#847c6b" }}>{number}</span>
    </div>
  );
}
