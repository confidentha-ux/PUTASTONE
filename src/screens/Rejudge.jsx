import React, { useState } from "react";

// claude/돌하나를-얹다-app-spec-v1.md "7. PERSONA 질문을 마친 뒤 — 재판단".
// 내부 구조: Initial Judgment → Operation → New Information → Judgment Shift → Rejudgment.
// Judgment Shift는 state/schema.js의 judgmentShift enum("same" | "reason_shift" | "different" |
// "unclear")을 그대로 쓴다 — 4개 선택지의 한국어 문구는 이 스펙 문서의 "Book I의 종료 조건"(프로젝트
// 설명에 있는 ①/②)에서 그대로 가져왔다.
const SHIFT_OPTIONS = [
  { value: "same", label: "처음과 같은 판단입니다" },
  { value: "reason_shift", label: "같은 판단이지만, 그 이유는 달라졌습니다" },
  { value: "different", label: "다른 판단을 하게 되었습니다" },
  { value: "unclear", label: "아직 잘 모르겠습니다" },
];

export default function Rejudge({ initialJudgment, onComplete }) {
  const [newInformation, setNewInformation] = useState("");
  const [judgmentShift, setJudgmentShift] = useState(null);
  const [rejudgment, setRejudgment] = useState("");

  const canProceed = judgmentShift !== null && rejudgment.trim().length > 0;

  return (
    <Shell>
      <h1 style={titleStyle}>다시, 같은 질문 앞에서</h1>

      <div style={labelStyle}>처음의 판단</div>
      <div style={quoteBoxStyle}>{initialJudgment || "기록된 처음의 판단이 없습니다."}</div>

      <label style={labelStyle}>이번 질문을 따라가면서 새롭게 보인 것이 있다면 적어주세요.</label>
      <textarea
        style={textareaStyle}
        rows={3}
        value={newInformation}
        onChange={(e) => setNewInformation(e.target.value)}
        placeholder="없다면 비워두어도 됩니다."
      />

      <label style={labelStyle}>판단이 어떻게 되었나요?</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {SHIFT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setJudgmentShift(opt.value)}
            style={{
              ...optionStyle,
              ...(judgmentShift === opt.value ? optionSelStyle : null),
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <label style={labelStyle}>같은 문제를 지금은 어떻게 판단하나요?</label>
      <textarea
        style={textareaStyle}
        rows={3}
        value={rejudgment}
        onChange={(e) => setRejudgment(e.target.value)}
        placeholder="지금의 판단을 적어주세요."
      />

      <button
        style={{ ...primaryButtonStyle, width: "100%", marginTop: 8, opacity: canProceed ? 1 : 0.5 }}
        disabled={!canProceed}
        onClick={() =>
          onComplete({
            newInformation: newInformation.trim(),
            judgmentShift,
            rejudgment: rejudgment.trim(),
          })
        }
      >
        다음
      </button>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div
      style={{
        minHeight: "100%",
        background: "#16131c",
        color: "#ece7de",
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
const labelStyle = { display: "block", fontSize: 12.5, color: "#7d7489", marginBottom: 8 };
const quoteBoxStyle = {
  padding: "12px 14px",
  borderRadius: 3,
  background: "rgba(236,231,222,0.035)",
  border: "1px solid rgba(236,231,222,0.14)",
  fontSize: 13.5,
  lineHeight: 1.6,
  marginBottom: 22,
};
const textareaStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 3,
  background: "rgba(236,231,222,0.035)",
  border: "1px solid rgba(236,231,222,0.14)",
  color: "#ece7de",
  fontSize: 13.5,
  lineHeight: 1.6,
  fontFamily: "inherit",
  marginBottom: 20,
  boxSizing: "border-box",
  resize: "vertical",
};
const optionStyle = {
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: 3,
  background: "rgba(236,231,222,0.035)",
  border: "1px solid rgba(236,231,222,0.14)",
  color: "#ece7de",
  fontSize: 13.5,
  cursor: "pointer",
  fontFamily: "inherit",
};
const optionSelStyle = {
  background: "rgba(214,167,86,0.13)",
  borderColor: "#d6a756",
  color: "#f6ecda",
};
const primaryButtonStyle = {
  padding: "12px 20px",
  borderRadius: 3,
  border: "none",
  background: "#d6a756",
  color: "#1b1509",
  fontSize: 13.5,
  cursor: "pointer",
  fontFamily: "inherit",
};
