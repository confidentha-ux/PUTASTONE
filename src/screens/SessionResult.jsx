import React from "react";
import { PaperGrain } from "../components/PaperGrain";
import { SectionMark } from "../components/SectionMark";

// "13. 현재의 돌탑 · 3" — 확정본 기준. 처음/새로 생각하게 된 것/지금은을 보여주고,
// 왜 다른 가면을 써봤는지 고정 서사를 지난 뒤 저장한다.
//
// 참고: "달라진 것과 그대로 남은 것"과 "이번 답에서 보인 것"의 구체적 피드백은 텍스트를
// 실제로 비교·종합하는 로직이 필요해서(AI 계층 없이는 생성 불가) 이번엔 자리만 비워뒀다 —
// answers.suggestion을 재탕해서 채우면 "새로 생각하게 된 것"과 같은 말이 두 번 나온다.
export default function SessionResult({
  personaName,
  initialJudgment,
  newInformation,
  rejudgment,
  comparison,
  insight,
  onSave,
}) {
  return (
    <Shell>
      <Row label="처음에는" value={initialJudgment || "—"} />
      <Row label="새로 생각하게 된 것" value={newInformation || "특별히 없음"} />
      <Row label="지금은" value={rejudgment || "—"} />

      {comparison && (
        <div style={{ marginBottom: 18 }}>
          <div style={labelStyle}>달라진 것과 그대로 남은 것</div>
          <div style={quoteBoxStyle}>{comparison}</div>
        </div>
      )}

      <div style={{ height: 1, background: "rgba(28,26,23,0.14)", margin: "26px 0" }} />

      <p style={titleStyle}>왜 다른 가면을 써봤을까요?</p>
      <p style={bodyStyle}>
        익숙한 방식으로 판단할 때는 내가 무엇을 중요하게 보고 있는지는 물론, 무엇을 아예 생각하지
        않고 있는지도 알아차리기 어렵습니다.
      </p>
      <p style={bodyStyle}>
        그래서 같은 고민을 평소에는 쓰지 않던 판단 방식({personaName || "다른 역할"})으로 한 번
        생각해봤습니다.
      </p>
      <p style={bodyStyle}>
        다른 방식으로 생각해보면 한데 묶여 있던 것을 따로 볼 수도 있고, 처음에는 없던 질문이나
        기준이 판단에 들어오기도 합니다.
      </p>
      <p style={bodyStyle}>
        그리고 다른 방식으로 생각해도 그대로 남는 것이 있다면, 내가 무엇을 중요하게 여기고 있는지도
        더 분명해집니다.
      </p>
      <p style={bodyStyle}>
        여러 가면을 경험하다 보면 필요한 순간에 다른 판단 방법을 스스로 꺼내 쓸 수도 있습니다.
      </p>
      <p style={leadStyle}>
        다른 가면을 써본 이유는 결국 내 판단을 더 잘 보기 위해서였습니다.
      </p>

      {insight && (
        <>
          <p style={titleStyle}>이번 답에서 보인 것</p>
          <p style={leadStyle}>{insight}</p>
        </>
      )}

      <p style={{ ...bodyStyle, marginTop: 24 }}>이 내용을 지금의 돌탑에 남겨둘 수 있습니다.</p>

      <button style={{ ...primaryButtonStyle, width: "100%", marginTop: 8 }} onClick={onSave}>
        돌 하나 얹기
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
        position: "relative",
        background: "#eae6da",
        color: "#1c1a17",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <PaperGrain seed={51} baseFrequency={0.7} octaves={2} opacity={0.08} />
      <div style={{ maxWidth: 460, margin: "0 auto", position: "relative" }}>
        <SectionMark number="3" title="현재의 돌탑" />
        {children}
      </div>
    </div>
  );
}

const titleStyle = { fontFamily: "Pretendard, sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 14 };
const bodyStyle = { fontSize: 13, fontWeight: 300, lineHeight: 1.9, color: "#847c6b", marginBottom: 14 };
const leadStyle = { fontSize: 14, fontWeight: 500, lineHeight: 1.8, color: "#1c1a17", marginBottom: 0 };
const labelStyle = { fontSize: 12.5, color: "#847c6b", marginBottom: 8 };
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
  background: "rgba(28,26,23,0.92)",
  color: "#eae6da",
  fontSize: 13.5,
  cursor: "pointer",
  fontFamily: "inherit",
};
