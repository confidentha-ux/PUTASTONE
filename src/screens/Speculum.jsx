import React, { useMemo, useState } from "react";
import { useUserState } from "../state/UserStateContext";
import { scoreFamilies, rankFamilies } from "../speculum/familyRouting";
import { getCandidatePersonas } from "../speculum/personaRegistry";
import { buildOperationCandidatesFromRankedFamilies } from "../speculum/operationDedup";
import { getPersonaComponent } from "../personas";
import { makeSpeculumSession, SCHEMA_VERSIONS } from "../state/schema";
import Rejudge from "./Rejudge";
import SessionResult from "./SessionResult";
import { PaperGrain } from "../components/PaperGrain";
import { SectionMark } from "../components/SectionMark";

// 구조 문서 7번 "HOME → Speculum" — Family Routing(claude/family-routing-matrix-v1.md)과
// 18 Persona Registry(src/speculum/personaRegistry.js)를 연결하는 화면.
// Task #14: 이제 렌즈를 선택하면 실제 18개 persona 컴포넌트(src/personas/*.jsx)가 열리고,
// 완료하면 SpeculumSession으로 저장된다(state/schema.js의 makeSpeculumSession). AI 계층은
// 아직 서버 프록시가 없어 src/speculum/aiStub.js의 임시 mock으로 대신하고 있다 — 이 부분은
// 여전히 다음 로드맵 항목이다. Persona Eligibility(자유 텍스트 판정)도 아직 없어서, 지금은
// Family Routing으로 후보를 좁힌 뒤 사용자가 직접 하나를 선택하는 방식이다.
export default function Speculum({ onNavigate, currentJudgment }) {
  const { state, actions } = useUserState();
  const meditatioDerived = state.meditatio.derived;
  const initialJudgment = currentJudgment?.initialJudgment ?? "";
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [openPersonaId, setOpenPersonaId] = useState(null);
  const [justCompleted, setJustCompleted] = useState(null);
  // Persona 질문을 마친 뒤 재판단(Rejudge)과 세션 결과(SessionResult) 두 화면을 지나야 실제로
  // 저장된다 — claude/돌하나를-얹다-app-spec-v1.md "7~8" 참고. rejudgmentDone이 true가 되기 전엔
  // Rejudge를, 그 후엔 SessionResult를 보여준다.
  const [pendingResult, setPendingResult] = useState(null);

  const routing = useMemo(() => {
    if (!meditatioDerived) return null;
    const scores = scoreFamilies(meditatioDerived);
    const ranked = rankFamilies(scores, meditatioDerived);
    const candidateFamilies = ranked.filter((r) => r.candidate);
    const candidatePersonas = getCandidatePersonas(candidateFamilies);
    const operationCandidates = buildOperationCandidatesFromRankedFamilies(ranked, { max: 3 });
    return { ranked, candidateFamilies, candidatePersonas, operationCandidates };
  }, [meditatioDerived]);

  // 렌즈(Persona) 하나를 실제로 열었을 때 — 해당 컴포넌트를 전체 화면으로 렌더링한다.
  // 질문지가 끝나면(onComplete) SpeculumSession을 만들어 저장하고, 다시 라우팅 화면으로
  // 돌아온다. 이 전환은 항상 사용자가 페르소나 화면 안의 "완료하고 Speculum으로 돌아가기"
  // 버튼을 눌러야 일어난다 — 자동으로 넘어가지 않는다(Lectio/Meditatio와 같은 원칙).
  if (openPersonaId) {
    const PersonaComponent = getPersonaComponent(openPersonaId);
    const personaMeta = routing?.operationCandidates.find((p) => p.id === openPersonaId) ?? null;

    if (!PersonaComponent) {
      // 이론상 일어나지 않아야 하지만(registry와 personas/index.js가 어긋난 경우 대비) 방어적으로 처리.
      return (
        <Shell>
          <p style={bodyStyle}>이 페르소나({openPersonaId})의 컴포넌트를 찾지 못했습니다.</p>
          <button style={primaryButtonStyle} onClick={() => setOpenPersonaId(null)}>돌아가기</button>
        </Shell>
      );
    }

    return (
      <PersonaComponent
        onComplete={(answers) => {
          setPendingResult({
            personaId: openPersonaId,
            personaName: personaMeta?.koreanName ?? openPersonaId,
            answers: answers ?? {},
          });
          setOpenPersonaId(null);
        }}
      />
    );
  }

  // "7. PERSONA 질문을 마친 뒤 — 재판단" — Persona가 끝나면 바로 저장하지 않고 먼저 재판단을 받는다.
  if (pendingResult && !pendingResult.rejudgmentDone) {
    return (
      <Rejudge
        initialJudgment={initialJudgment}
        onComplete={({ newInformation, judgmentShift, rejudgment }) => {
          setPendingResult({ ...pendingResult, newInformation, judgmentShift, rejudgment, rejudgmentDone: true });
        }}
      />
    );
  }

  // "8. 한 번의 인지 시뮬레이션 결과" — 실제 저장은 이 화면의 [ 돌 하나를 얹다 ] 버튼을 눌러야 일어난다.
  if (pendingResult && pendingResult.rejudgmentDone) {
    return (
      <SessionResult
        personaName={pendingResult.personaName}
        initialJudgment={initialJudgment}
        newInformation={pendingResult.newInformation}
        judgmentShift={pendingResult.judgmentShift}
        rejudgment={pendingResult.rejudgment}
        onSave={() => {
          const session = makeSpeculumSession({
            sessionId: `${pendingResult.personaId}-${Date.now()}`,
            personaId: pendingResult.personaId,
            personaVersion: SCHEMA_VERSIONS.personaProtocolVersion,
            initialJudgment,
            operationData: pendingResult.answers,
            newInformation: pendingResult.newInformation,
            judgmentShift: pendingResult.judgmentShift,
            rejudgment: pendingResult.rejudgment,
            reflection: pendingResult.answers?.suggestion ?? "",
            rawAnswers: pendingResult.answers,
            routingMeta: {
              source: "user_selected",
              familyRoutingMatrixVersion: SCHEMA_VERSIONS.familyRoutingMatrixVersion,
              familyCandidates: routing?.candidateFamilies.map((f) => f.family) ?? null,
              eligibilityPassed: null,
            },
          });
          actions.addSpeculumSession(session);
          setJustCompleted(true);
          setPendingResult(null);
        }}
      />
    );
  }

  if (!meditatioDerived) {
    return (
      <Shell>
        <p style={bodyStyle}>
          다른 역할 입어보기는 나는 어떻게 판단하는가에서 읽은 판단 기준을 바탕으로, 지금의 판단을 다른
          렌즈로 다시 보게 해줍니다.
        </p>
        <p style={{ ...bodyStyle, color: "#847c6b" }}>
          아직 나는 어떻게 판단하는가를 완료하지 않아서, 어떤 렌즈를 열어야 할지 정할 근거가 없습니다. 먼저
          완료해 주세요.
        </p>
        <button style={primaryButtonStyle} onClick={() => onNavigate("meditatio")}>
          나는 어떻게 판단하는가 하러 가기
        </button>
      </Shell>
    );
  }

  if (!initialJudgment) {
    return (
      <Shell>
        <p style={bodyStyle}>
          어떤 질문을 얹을지 정하기 전에, 지금 실제로 고민 중인 문제와 그 문제에 대한 현재 판단을 먼저
          받아야 합니다.
        </p>
        <button style={primaryButtonStyle} onClick={() => onNavigate("judgment")}>
          지금의 판단 적으러 가기
        </button>
      </Shell>
    );
  }

  const selectedPersona = routing.operationCandidates.find((p) => p.id === selectedPersonaId) ?? null;

  // claude/돌하나를-얹다-app-spec-v1.md "5. Operation 선택 구간" — Family 이름이나 라우팅 계산은
  // 사용자에게 보여주지 않는다. 사용자는 Persona를 먼저 고르지 않고, 자기 판단에 적용해보고 싶은
  // Operation(질문 방식 = 각 persona의 operationHeader)을 먼저 고른다. 그 선택 뒤에야("6. PERSONA
  // 구간") 그 질문을 쓰는 Persona가 등장한다.
  return (
    <Shell>
      <h1 style={titleStyle}>어떤 질문을 얹어볼까요?</h1>
      <p style={bodyStyle}>
        지금의 판단에 적용해볼 수 있는 질문 방식입니다. 사람을 고르는 것이 아니라, 이번에 따라가 볼 질문
        하나를 고르는 것입니다.
      </p>

      {justCompleted && (
        <div style={completedBoxStyle}>
          {/* claude/돌하나를-얹다-app-spec-v1.md "10. 저장 완료" — 확정된 문장 그대로, 해석을 덧붙이지 않는다. */}
          <div style={{ fontSize: 14, marginBottom: 14 }}>돌 하나가 더해졌습니다.</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={primaryButtonStyle} onClick={() => onNavigate("studiolo")}>현재의 돌탑으로 이동</button>
            <button style={secondaryButtonStyle} onClick={() => setJustCompleted(null)}>다른 렌즈 보기</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {routing.operationCandidates.map((persona) => (
          <button
            key={persona.id}
            data-testid="operation-card"
            data-persona-id={persona.id}
            onClick={() => setSelectedPersonaId(persona.id)}
            style={{
              ...personaCardStyle,
              borderColor: selectedPersonaId === persona.id ? "#1c1a17" : "rgba(49,53,45,0.14)",
            }}
          >
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: 15.5, lineHeight: 1.5 }}>
              {persona.operationHeader}
            </div>
          </button>
        ))}
      </div>

      {selectedPersona && (
        <div style={noticeBoxStyle}>
          <SectionLabel>다른 역할 입어보기</SectionLabel>
          <div style={{ fontSize: 13, color: "#847c6b", marginBottom: 12 }}>
            다른 사람들의 인지구조를 따라가 봅니다.
          </div>
          <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: 16, marginBottom: 12 }}>
            {selectedPersona.koreanName}
          </div>
          <button style={primaryButtonStyle} onClick={() => setOpenPersonaId(selectedPersona.id)}>
            이 렌즈 열기
          </button>
        </div>
      )}
    </Shell>
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
      <PaperGrain seed={23} baseFrequency={0.65} octaves={3} opacity={0.06} />
      <div style={{ maxWidth: 460, margin: "0 auto", position: "relative" }}>
        <SectionMark number="04" title="다른 역할 입어보기" />
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 12, color: "#1c1a17", letterSpacing: 0.4, marginBottom: 10, marginTop: 4 }}>
      {children}
    </div>
  );
}

const titleStyle = { fontFamily: "Pretendard, sans-serif", fontWeight: 400, fontSize: 22, marginBottom: 12 };
const bodyStyle = { fontSize: 13.5, lineHeight: 1.6, marginBottom: 16, color: "#1c1a17" };
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
const secondaryButtonStyle = {
  padding: "12px 20px",
  borderRadius: 3,
  border: "1px solid rgba(49,53,45,0.2)",
  background: "transparent",
  color: "#1c1a17",
  fontSize: 13.5,
  cursor: "pointer",
  fontFamily: "inherit",
};
const completedBoxStyle = {
  padding: "14px 16px",
  borderRadius: 3,
  background: "rgba(28,26,23,0.1)",
  border: "1px solid rgba(28,26,23,0.35)",
  marginBottom: 20,
};
const personaCardStyle = {
  textAlign: "left",
  padding: "16px 18px",
  borderRadius: 3,
  background: "rgba(49,53,45,0.035)",
  border: "1px solid rgba(49,53,45,0.14)",
  color: "#1c1a17",
  cursor: "pointer",
  fontFamily: "inherit",
};
const noticeBoxStyle = {
  padding: "14px 16px",
  borderRadius: 3,
  background: "rgba(28,26,23,0.08)",
  border: "1px solid rgba(28,26,23,0.3)",
};
