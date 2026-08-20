import React from "react";

const SHIFT_LABEL = {
  same: "처음과 같은 판단입니다",
  reason_shift: "같은 판단이지만, 그 이유는 달라졌습니다",
  different: "다른 판단을 하게 되었습니다",
  unclear: "아직 잘 모르겠습니다",
};

// claude/돌하나를-얹다-app-spec-v1.md "8. 한 번의 인지 시뮬레이션 결과".
// 저장되는 것은 세션 전체(Initial Judgment / Operation / New Information / Judgment Shift /
// Rejudgment)다 — 이 화면은 저장 전에 그 다섯 가지를 한 화면에 모아 보여주고, 실제 저장은
// [ 돌 하나를 얹다 ] 버튼을 눌러야 일어난다.
export default function SessionResult({
  personaName,
  initialJudgment,
  newInformation,
  judgmentShift,
  rejudgment,
  onSave,
}) {
  return (
    <Shell>
      <h1 style={titleStyle}>이번에 확인한 것</h1>

      <Row label="처음의 판단" value={initialJudgment || "—"} />
      <Row label="이번에 사용한 인지구조" value={personaName || "—"} />
      <Row label="새롭게 보인 것" value={newInformation || "특별히 없음"} />
      <Row label="판단의 변화" value={SHIFT_LABEL[judgmentShift] ?? "—"} />
      <Row label="지금의 판단" value={rejudgment || "—"} />

      <button style={{ ...primaryButtonStyle, width: "100%", marginTop: 8 }} onClick={onSave}>
        돌 하나를 얹다
      </button>
    </Shell>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={labelStyle}>{label}</div>
      <div style={quoteBoxStyle}>{value}</div>
    </div>
  );
}

function Shell({ children }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        background: "#e4e2db",
        color: "#31352d",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

const titleStyle = { fontFamily: "'Gowun Batang', serif", fontWeight: 400, fontSize: 22, marginBottom: 20 };
const labelStyle = { fontSize: 12.5, color: "#5f6354", marginBottom: 8 };
const quoteBoxStyle = {
  padding: "12px 14px",
  borderRadius: 3,
  background: "rgba(49,53,45,0.035)",
  border: "1px solid rgba(49,53,45,0.14)",
  fontSize: 13.5,
  lineHeight: 1.6,
  whiteSpace: "pre-line",
};
const primaryButtonStyle = {
  padding: "12px 20px",
  borderRadius: 3,
  border: "none",
  background: "#5c7a5e",
  color: "#f2f4ef",
  fontSize: 13.5,
  cursor: "pointer",
  fontFamily: "inherit",
};
