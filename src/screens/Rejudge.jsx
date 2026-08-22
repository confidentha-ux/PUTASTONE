import React, { useState } from "react";

export default function Rejudge({ initialJudgment, onComplete }) {
  const [rejudgment, setRejudgment] = useState("");

  const canProceed = rejudgment.trim().length > 0;

  return (
    <Shell>
      <h1 style={titleStyle}>지금은</h1>

      <div style={labelStyle}>처음에는</div>
      <div style={quoteBoxStyle}>{initialJudgment || "기록된 처음의 판단이 없습니다."}</div>

      <label style={labelStyle}>질문을 지나온 지금, 같은 일을 어떻게 판단하고 있나요?</label>
      <textarea
        style={textareaStyle}
        rows={4}
        value={rejudgment}
        onChange={(e) => setRejudgment(e.target.value)}
        placeholder="지금의 판단을 적어주세요."
      />

      <button
        style={{ ...primaryButtonStyle, width: "100%", marginTop: 8, opacity: canProceed ? 1 : 0.5 }}
        disabled={!canProceed}
        onClick={() => onComplete({ rejudgment: rejudgment.trim() })}
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
        flex: 1,
        minHeight: 0,
        background: "#eae6da",
        color: "#1c1a17",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

const titleStyle = { fontFamily: "Pretendard, sans-serif", fontWeight: 400, fontSize: 22, marginBottom: 20 };
const labelStyle = { display: "block", fontSize: 12.5, color: "#847c6b", marginBottom: 8 };
const quoteBoxStyle = {
  padding: "12px 14px",
  borderRadius: 3,
  background: "rgba(49,53,45,0.035)",
  border: "1px solid rgba(49,53,45,0.14)",
  fontSize: 13.5,
  lineHeight: 1.6,
  marginBottom: 22,
};
const textareaStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 3,
  background: "rgba(49,53,45,0.035)",
  border: "1px solid rgba(49,53,45,0.14)",
  color: "#1c1a17",
  fontSize: 13.5,
  lineHeight: 1.6,
  fontFamily: "inherit",
  marginBottom: 20,
  boxSizing: "border-box",
  resize: "vertical",
};
const primaryButtonStyle = {
  padding: "12px 20px",
  borderRadius: 3,
  border: "none",
  background: "#1c1a17",
  color: "#eae6da",
  fontSize: 13.5,
  cursor: "pointer",
  fontFamily: "inherit",
};
