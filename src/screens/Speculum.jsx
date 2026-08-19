import React, { useMemo, useState } from "react";
import { useUserState } from "../state/UserStateContext";
import { scoreFamilies, rankFamilies } from "../speculum/familyRouting";
import { getCandidatePersonas } from "../speculum/personaRegistry";
import { buildOperationCandidatesFromRankedFamilies } from "../speculum/operationDedup";

const FAMILY_LABEL = {
  probability: "Probability · 예상과 확인된 것",
  distance: "Distance · 한 걸음 떨어진 위치",
  time: "Time · 시간이 해결해줄 것이라는 기대",
  inversion: "Inversion · 보이지 않던 반대편",
  scale: "Scale · 판단의 크기와 범위",
  identity: "Identity · 자신에 대한 판단",
  boundary: "Boundary · 어디까지가 내 몫인지",
  criterion: "Criterion · 판단을 성립시키는 조건",
};

// 구조 문서 7번 "HOME → Speculum" — Family Routing(claude/family-routing-matrix-v1.md)과
// 18 Persona Registry(src/speculum/personaRegistry.js)를 연결하는 화면.
// 아직 하지 않는 것: 각 Persona의 실제 질문지(18개 jsx)를 여기서 실행하는 것 — 이건 로드맵의
// 다음 단계(18개 persona 컴포넌트 연결, AI 계층)에서 붙는다. 지금 이 화면은 "어떤 렌즈들이
// 왜 열렸는지"를 사용자에게 보여주는 라우팅 단계까지만 한다.
export default function Speculum({ onNavigate }) {
  const { state } = useUserState();
  const meditatioDerived = state.meditatio.derived;
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);

  const routing = useMemo(() => {
    if (!meditatioDerived) return null;
    const scores = scoreFamilies(meditatioDerived);
    const ranked = rankFamilies(scores, meditatioDerived);
    const candidateFamilies = ranked.filter((r) => r.candidate);
    const candidatePersonas = getCandidatePersonas(candidateFamilies);
    const operationCandidates = buildOperationCandidatesFromRankedFamilies(ranked, { max: 3 });
    return { ranked, candidateFamilies, candidatePersonas, operationCandidates };
  }, [meditatioDerived]);

  if (!meditatioDerived) {
    return (
      <Shell>
        <h1 style={titleStyle}>Speculum</h1>
        <p style={bodyStyle}>
          Speculum은 Meditatio에서 읽은 판단 기준을 바탕으로, 지금의 판단을 다른 렌즈로 다시 보게 해줍니다.
        </p>
        <p style={{ ...bodyStyle, color: "#7d7489" }}>
          아직 Meditatio를 완료하지 않아서, 어떤 렌즈를 열어야 할지 정할 근거가 없습니다. Meditatio를 먼저
          완료해 주세요.
        </p>
        <button style={primaryButtonStyle} onClick={() => onNavigate("meditatio")}>
          Meditatio 하러 가기
        </button>
      </Shell>
    );
  }

  const selectedPersona = routing.operationCandidates.find((p) => p.id === selectedPersonaId) ?? null;

  return (
    <Shell>
      <h1 style={titleStyle}>Speculum</h1>
      <p style={bodyStyle}>
        Meditatio에서 읽은 판단 기준을 근거로, 지금 열어볼 수 있는 렌즈 후보를 계산했습니다. 렌즈는 사람을
        분석하는 도구가 아니라, 같은 판단을 다른 조건으로 다시 보게 만드는 도구입니다.
      </p>

      <SectionLabel>1. 열린 Family 후보</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {routing.ranked
          .filter((r) => r.candidate)
          .map((r) => (
            <div key={r.family} style={familyRowStyle}>
              <div>
                <div style={{ fontSize: 13.5 }}>{FAMILY_LABEL[r.family] ?? r.family}</div>
                {(r.boostedBy.defaultStrategy || r.boostedBy.affectSignals.length > 0) && (
                  <div style={{ fontSize: 11, color: "#7d7489", marginTop: 2 }}>
                    보강: {[r.boostedBy.defaultStrategy, ...r.boostedBy.affectSignals].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#d6a756" }}>{r.score}점</div>
            </div>
          ))}
      </div>

      <SectionLabel>2. 지금 제시할 수 있는 렌즈 {routing.operationCandidates.length}개</SectionLabel>
      <p style={{ ...bodyStyle, fontSize: 12.5, color: "#7d7489" }}>
        같은 것을 비슷한 방식으로 보는 렌즈는 중복 제거했습니다 (claude/operation-dedup-rules-v1.md).
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {routing.operationCandidates.map((persona) => (
          <button
            key={persona.id}
            onClick={() => setSelectedPersonaId(persona.id)}
            style={{
              ...personaCardStyle,
              borderColor: selectedPersonaId === persona.id ? "#d6a756" : "rgba(236,231,222,0.14)",
            }}
          >
            <div style={{ fontFamily: "'Gowun Batang', serif", fontSize: 16 }}>
              {persona.koreanName} <span style={{ color: "#7d7489", fontSize: 12.5 }}>· {persona.englishName}</span>
            </div>
            <div style={{ fontSize: 12.5, color: "#7d7489", marginTop: 4 }}>{persona.eligibilityDescription}</div>
            <div style={{ fontSize: 11, color: "#5c5468", marginTop: 6 }}>
              {FAMILY_LABEL[persona.family] ?? persona.family}
            </div>
          </button>
        ))}
      </div>

      {selectedPersona && (
        <div style={noticeBoxStyle}>
          <div style={{ fontSize: 13.5, marginBottom: 6 }}>
            {selectedPersona.koreanName} 페르소나를 선택했습니다.
          </div>
          <div style={{ fontSize: 12.5, color: "#7d7489" }}>
            이 페르소나의 실제 질문지({selectedPersona.koreanName} — 처음 판단을 다시 읽는 7~10개 질문)는 아직
            이 화면에 연결되지 않았습니다. 지금 이 화면은 &ldquo;어떤 렌즈가 왜 열렸는지&rdquo;까지 계산하는
            Family Routing 단계이고, 실제 질문지 연결은 다음 로드맵 항목입니다.
          </div>
        </div>
      )}
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

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 12, color: "#d6a756", letterSpacing: 0.4, marginBottom: 10, marginTop: 4 }}>
      {children}
    </div>
  );
}

const titleStyle = { fontFamily: "'Gowun Batang', serif", fontWeight: 400, fontSize: 22, marginBottom: 12 };
const bodyStyle = { fontSize: 13.5, lineHeight: 1.6, marginBottom: 16, color: "#ece7de" };
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
const familyRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: 3,
  background: "rgba(236,231,222,0.035)",
  border: "1px solid rgba(236,231,222,0.1)",
};
const personaCardStyle = {
  textAlign: "left",
  padding: "16px 18px",
  borderRadius: 3,
  background: "rgba(236,231,222,0.035)",
  border: "1px solid rgba(236,231,222,0.14)",
  color: "#ece7de",
  cursor: "pointer",
  fontFamily: "inherit",
};
const noticeBoxStyle = {
  padding: "14px 16px",
  borderRadius: 3,
  background: "rgba(214,167,86,0.08)",
  border: "1px solid rgba(214,167,86,0.3)",
};
