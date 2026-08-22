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
  const [operationConfirmed, setOperationConfirmed] = useState(false);
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
        onComplete={({ rejudgment }) => {
          setPendingResult({ ...pendingResult, rejudgment, rejudgmentDone: true });
        }}
      />
    );
  }

  // "8. 한 번의 인지 시뮬레이션 결과" — 실제 저장은 이 화면의 [ 돌 하나를 얹다 ] 버튼을 눌러야 일어난다.
  // "새롭게 생긴 것"은 Rejudge에서 따로 묻지 않는다 — 페르소나 자신이 만든 answers.suggestion을 그대로 쓴다
  // (18개 페르소나 모두 완료 시 summary/suggestion을 반드시 채우도록 되어 있다).
  if (pendingResult && pendingResult.rejudgmentDone) {
    const newInformation = pendingResult.answers?.suggestion ?? "";
    return (
      <SessionResult
        personaName={pendingResult.personaName}
        initialJudgment={initialJudgment}
        newInformation={newInformation}
        rejudgment={pendingResult.rejudgment}
        onSave={() => {
          const session = makeSpeculumSession({
            sessionId: `${pendingResult.personaId}-${Date.now()}`,
            personaId: pendingResult.personaId,
            personaVersion: SCHEMA_VERSIONS.personaProtocolVersion,
            initialJudgment,
            operationData: pendingResult.answers,
            newInformation,
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
          setOperationConfirmed(false);
          setSelectedPersonaId(null);
        }}
      />
    );
  }

  if (!meditatioDerived) {
    return (
      <Shell>
        <p style={bodyStyle}>
          다른 역할 입어보기는 판단이 만들어지는 과정에서 읽은 판단 기준을 바탕으로, 지금의 판단을 다른
          렌즈로 다시 보게 해줍니다.
        </p>
        <p style={{ ...bodyStyle, color: "#847c6b" }}>
          아직 판단이 만들어지는 과정을 완료하지 않아서, 어떤 렌즈를 열어야 할지 정할 근거가 없습니다. 먼저
          완료해 주세요.
        </p>
        <button style={primaryButtonStyle} onClick={() => onNavigate("meditatio")}>
          판단이 만들어지는 과정 하러 가기
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

  // "9. 지금은" 이후 페르소나를 마치고 여기로 돌아왔을 때 justCompleted를 보여주는 화면은
  // "돌 하나를 고르다" 쪽에 둔다 — 다음 렌즈를 고르는 시작점이기 때문.
  if (!operationConfirmed) {
    return (
      <Shell sectionTitle="돌 하나를 고르다">
        <h1 style={titleStyle}>돌 하나를 고르다</h1>
        <p style={bodyStyle}>
          지금의 판단에 서로 다른 질문을 하나씩 얹어볼 수 있습니다. 지금 따라가 보고 싶은 질문을
          골라주세요.
        </p>

        {justCompleted && (
          <div style={completedBoxStyle}>
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

        <button
          style={{ ...primaryButtonStyle, width: "100%", opacity: selectedPersona ? 1 : 0.5 }}
          disabled={!selectedPersona}
          onClick={() => setOperationConfirmed(true)}
        >
          이 질문을 얹어보기
        </button>
      </Shell>
    );
  }

  // "8. 다른 역할 입어보기" — Operation을 고른 뒤에만 실제로 어떤 Persona를 쓰는지 드러난다.
  return (
    <Shell sectionTitle="다른 역할 입어보기">
      <h1 style={titleStyle}>다른 역할 입어보기</h1>
      <p style={bodyStyle}>다른 사람들의 인지구조를 따라가 봅니다.</p>

      <div style={noticeBoxStyle}>
        <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: 16, marginBottom: 12 }}>
          {selectedPersona?.koreanName}
        </div>
        <div style={{ fontSize: 13.5, color: "#847c6b", marginBottom: 14 }}>{selectedPersona?.operationHeader}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={primaryButtonStyle} onClick={() => setOpenPersonaId(selectedPersona.id)}>
            시작
          </button>
          <button
            style={secondaryButtonStyle}
            onClick={() => {
              setOperationConfirmed(false);
              setSelectedPersonaId(null);
            }}
          >
            다시 고르기
          </button>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children, sectionTitle = "다른 역할 입어보기" }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        position: "relative",
        background: "radial-gradient(120% 90% at 50% 0%, #e1e6da 0%, #d7ddd0 62%)",
        color: "#1c1a17",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <PaperGrain seed={23} baseFrequency={0.65} octaves={3} opacity={0.13} />
      <div style={{ maxWidth: 460, margin: "0 auto", position: "relative" }}>
        <SectionMark number="04" title={sectionTitle} />
        {children}
      </div>
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
