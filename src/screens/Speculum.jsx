import React, { useEffect, useMemo, useState } from "react";
import { useUserState } from "../state/UserStateContext";
import { scoreFamilies, rankFamilies } from "../speculum/familyRouting";
import { getCandidatePersonas } from "../speculum/personaRegistry";
import { buildOperationCandidatesFromRankedFamilies } from "../speculum/operationDedup";
import { getPersonaComponent } from "../personas";
import { makeSpeculumSession, SCHEMA_VERSIONS } from "../state/schema";
import { generateSessionSynthesis } from "../speculum/sessionSynthesis";
import Rejudge from "./Rejudge";
import SessionResult from "./SessionResult";
import { PaperGrain } from "../components/PaperGrain";
import { SectionMark } from "../components/SectionMark";

// 구조 문서 7번 "HOME → Speculum" — Family Routing(claude/family-routing-matrix-v1.md)과
// 18 Persona Registry(src/speculum/personaRegistry.js)를 연결하는 화면.
// Task #14: 이제 역할을 선택하면 실제 18개 persona 컴포넌트(src/personas/*.jsx)가 열리고,
// 완료하면 SpeculumSession으로 저장된다(state/schema.js의 makeSpeculumSession). AI 계층은
// 아직 서버 프록시가 없어 src/speculum/aiStub.js의 임시 mock으로 대신하고 있다 — 이 부분은
// 여전히 다음 로드맵 항목이다. Persona Eligibility(자유 텍스트 판정)도 아직 없어서, 지금은
// Family Routing으로 후보를 좁힌 뒤 사용자가 직접 하나를 선택하는 방식이다.
export default function Speculum({ onNavigate }) {
  const { state, actions } = useUserState();
  const meditatioDerived = state.meditatio.derived;
  // "지금의 판단"(구 CurrentJudgment)이 이제 03 안의 내부 단계라, 여기서 자체 상태로 갖는다.
  const [concern, setConcern] = useState("");
  const [initialJudgment, setInitialJudgment] = useState("");
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  // "bringIntro"(03 시작, 신설) → "concern"(요즘 마음에 있는 일) → "concernConfirm"(내가 이야기한 것)
  // → "roleIntro"(다른 판단 방식 안내) → "pick"(두 역할 추천) → "confirm"(선택한 역할)
  const [stage, setStage] = useState("bringIntro");
  const [openPersonaId, setOpenPersonaId] = useState(null);
  const [justCompleted, setJustCompleted] = useState(null);
  // Persona 질문을 마친 뒤 재판단(Rejudge)과 세션 결과(SessionResult) 두 화면을 지나야 실제로
  // 저장된다 — claude/돌하나를-얹다-app-spec-v1.md "7~8" 참고. rejudgmentDone이 true가 되기 전엔
  // Rejudge를, 그 후엔 SessionResult를 보여준다.
  const [pendingResult, setPendingResult] = useState(null);
  // "달라진 것과 그대로 남은 것" / "이번 답에서 보인 것" — 재판단이 끝나야 생성할 수 있다.
  // undefined=아직 시작 안 함, null=생성 중이거나 실패(그 자리는 비움), 객체=생성 완료.
  const [synthesis, setSynthesis] = useState(undefined);

  useEffect(() => {
    if (!pendingResult?.rejudgmentDone || synthesis !== undefined) return;
    setSynthesis(null);
    generateSessionSynthesis({
      initialJudgment,
      rejudgment: pendingResult.rejudgment,
      personaName: pendingResult.personaName,
      summary: pendingResult.answers?.summary,
      suggestion: pendingResult.answers?.suggestion,
    }).then(setSynthesis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingResult?.rejudgmentDone]);

  const routing = useMemo(() => {
    if (!meditatioDerived) return null;
    const scores = scoreFamilies(meditatioDerived);
    const ranked = rankFamilies(scores, meditatioDerived);
    const candidateFamilies = ranked.filter((r) => r.candidate);
    const candidatePersonas = getCandidatePersonas(candidateFamilies);
    const operationCandidates = buildOperationCandidatesFromRankedFamilies(ranked, { max: 2 });
    return { ranked, candidateFamilies, candidatePersonas, operationCandidates };
  }, [meditatioDerived]);

  // 역할(Persona) 하나를 실제로 열었을 때 — 해당 컴포넌트를 전체 화면으로 렌더링한다.
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
    if (synthesis === null) {
      return (
        <Shell>
          <p style={bodyStyle}>지금까지의 답을 살펴보는 중입니다…</p>
        </Shell>
      );
    }
    const newInformation = pendingResult.answers?.suggestion ?? "";
    return (
      <SessionResult
        personaName={pendingResult.personaName}
        initialJudgment={initialJudgment}
        newInformation={newInformation}
        rejudgment={pendingResult.rejudgment}
        comparison={synthesis?.comparison}
        insight={synthesis?.insight}
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
          setSynthesis(undefined);
          setStage("bringIntro");
          setSelectedPersonaId(null);
        }}
      />
    );
  }

  if (!meditatioDerived) {
    return (
      <Shell>
        <p style={bodyStyle}>
          다른 역할 입어보기는 내 판단의 지형에서 드러난 판단 기준을 바탕으로, 지금의 판단을 다른
          역할로 다시 보게 해줍니다.
        </p>
        <p style={{ ...bodyStyle, color: "#847c6b" }}>
          아직 내 판단의 지형을 확인하지 않아서, 어떤 역할을 골라야 할지 정할 근거가 없습니다. 먼저
          완료해 주세요.
        </p>
        <button style={primaryButtonStyle} onClick={() => onNavigate("meditatio")}>
          내 판단의 지형 하러 가기
        </button>
      </Shell>
    );
  }

  const selectedPersona = routing.operationCandidates.find((p) => p.id === selectedPersonaId) ?? null;

  // "## 시작" — 03 전체의 진입점. 완료 직후 돌아왔을 때도 여기가 시작점이다.
  if (stage === "bringIntro") {
    return (
      <Shell>
        <h1 style={titleStyle}>이번에는 다른 돌 하나를 얹어봅니다.</h1>

        {justCompleted && (
          <div style={completedBoxStyle}>
            <div style={{ fontSize: 14, marginBottom: 14 }}>돌 하나가 더해졌습니다.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={primaryButtonStyle} onClick={() => onNavigate("studiolo")}>현재의 돌탑으로 이동</button>
              <button style={secondaryButtonStyle} onClick={() => setJustCompleted(null)}>다른 역할 보기</button>
            </div>
          </div>
        )}

        <p style={bodyStyle}>
          지금까지는 내가 어떤 선택을 어렵게 느끼는지, 그리고 평소 어떤 방식으로 판단하는지
          봤습니다.
        </p>
        <p style={bodyStyle}>
          이번에는 실제 고민 하나를 가지고 평소에는 쓰지 않던 판단 방식을 직접 사용해봅니다.
        </p>
        <p style={bodyStyle}>각 역할은 서로 다른 방법으로 판단을 다룹니다.</p>
        <p style={bodyStyle}>
          어떤 역할은 사실과 예상을 나누고, 어떤 역할은 책임의 경계를 다시 보고, 어떤 역할은
          판단에서 한 가지 요소를 잠시 빼봅니다.
        </p>
        <p style={bodyStyle}>새로운 돌 하나를 얹으면 돌탑의 무게중심이나 모양이 달라질 수 있습니다.</p>
        <p style={bodyStyle}>
          같은 방식으로, 다른 판단 방식을 하나 사용해본 뒤 처음의 생각에서 무엇이 달라지고 무엇이
          그대로 남는지 봅니다.
        </p>
        <p style={bodyStyle}>마치 잠시 다른 가면을 써보는 것처럼요.</p>

        <button style={{ ...primaryButtonStyle, width: "100%" }} onClick={() => setStage("concern")}>
          고민 가져오기
        </button>
      </Shell>
    );
  }

  // "요즘 마음에 있는 일" — 구 CurrentJudgment 화면 1. 03 안의 내부 단계로 들어왔다.
  if (stage === "concern") {
    const canProceed = concern.trim().length > 0 && initialJudgment.trim().length > 0;
    return (
      <Shell>
        <h1 style={titleStyle}>요즘 마음에 있는 일</h1>
        <p style={bodyStyle}>계속 생각하게 되는 일이 있다면 여기에서 먼저 이야기해 주세요.</p>

        <label style={labelStyle}>어떤 일인가요?</label>
        <textarea
          style={textareaStyle}
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          placeholder="예: 새로운 일을 맡을지 계속 고민하고 있다."
          rows={3}
        />

        <label style={labelStyle}>이 일에 대해 지금은 어떻게 생각하고 있나요?</label>
        <textarea
          style={textareaStyle}
          value={initialJudgment}
          onChange={(e) => setInitialJudgment(e.target.value)}
          placeholder="예: 지금은 맡지 않는 편이 낫다고 생각한다."
          rows={3}
        />

        <button
          style={{ ...primaryButtonStyle, width: "100%", opacity: canProceed ? 1 : 0.5 }}
          disabled={!canProceed}
          onClick={() => setStage("concernConfirm")}
        >
          다음
        </button>
      </Shell>
    );
  }

  // "내가 이야기한 것" — 구 CurrentJudgment 화면 2.
  if (stage === "concernConfirm") {
    return (
      <Shell>
        <h1 style={titleStyle}>내가 이야기한 것</h1>

        <div style={{ marginBottom: 18 }}>
          <div style={labelStyle}>마음에 있는 일</div>
          <div style={quoteBoxStyle}>{concern}</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={labelStyle}>지금은 이렇게 생각하고 있습니다</div>
          <div style={quoteBoxStyle}>{initialJudgment}</div>
        </div>

        <p style={{ ...bodyStyle, marginTop: 4 }}>
          이 생각을 시작점으로 남겨둡니다. 가면을 벗은 뒤 같은 고민에 다시 답합니다.
        </p>

        <button style={{ ...primaryButtonStyle, width: "100%" }} onClick={() => setStage("roleIntro")}>
          다음
        </button>
      </Shell>
    );
  }

  // "다른 판단 방식 안내" — 고민을 확인한 뒤, 실제 역할 추천 전에 한 번 더 개념을 짚는다.
  if (stage === "roleIntro") {
    return (
      <Shell>
        <h1 style={titleStyle}>다른 역할 입어보기</h1>
        <p style={bodyStyle}>이번에는 다른 판단 방식을 사용해봅니다.</p>
        <p style={bodyStyle}>
          「나를 받치는 돌」에서는 어려운 선택에 걸려 있던 생각을 한 번 덜어내 봤습니다. 이번에는
          지금의 고민을 다른 판단 방식으로 생각해봅니다.
        </p>
        <p style={bodyStyle}>
          각 역할은 판단을 다루는 자기만의 방법을 가지고 있습니다. 역할을 하나 고르면 그 역할의
          방식대로 지금의 고민을 생각해봅니다.
        </p>
        <p style={bodyStyle}>마치 잠시 다른 가면을 써보는 것처럼요.</p>

        <button style={{ ...primaryButtonStyle, width: "100%" }} onClick={() => setStage("pick")}>
          역할 보기
        </button>
      </Shell>
    );
  }

  // "10. 두 역할 추천" — Family Routing + operationDedup으로 이미 정해진 상위 2명을 그대로 보여준다.
  // 자유 탐색이 아니라, 각 카드에 바로 시작 버튼이 붙는다.
  if (stage === "pick") {
    return (
      <Shell>
        <h1 style={titleStyle}>어떤 역할로 생각해볼까요?</h1>
        <p style={bodyStyle}>
          앞에서 답한 내용과 지금 적어준 고민을 바탕으로 이번에 사용해볼 두 역할을 골랐습니다.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
          {routing.operationCandidates.map((persona) => (
            <div key={persona.id} style={personaCardStyle}>
              <div style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 700, fontSize: 15.5, marginBottom: 6 }}>
                {persona.koreanName}
              </div>
              <div style={{ fontSize: 13, color: "#847c6b", marginBottom: 14, lineHeight: 1.6 }}>
                {persona.operationHeader}
              </div>
              <button
                style={primaryButtonStyle}
                onClick={() => {
                  setSelectedPersonaId(persona.id);
                  setStage("confirm");
                }}
              >
                이 역할로 시작하기
              </button>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  // "11. 선택한 역할"
  return (
    <Shell>
      <div style={noticeBoxStyle}>
        <div style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
          {selectedPersona?.koreanName}
        </div>
        <div style={{ fontSize: 13.5, color: "#847c6b", marginBottom: 14 }}>{selectedPersona?.operationHeader}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={primaryButtonStyle} onClick={() => setOpenPersonaId(selectedPersona.id)}>
            가면쓰기
          </button>
          <button
            style={secondaryButtonStyle}
            onClick={() => {
              setStage("pick");
              setSelectedPersonaId(null);
            }}
          >
            다른 역할 고르기
          </button>
        </div>
      </div>
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
        background: "radial-gradient(120% 90% at 50% 0%, #e1e6da 0%, #d7ddd0 62%)",
        color: "#1c1a17",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <PaperGrain seed={23} baseFrequency={0.65} octaves={3} opacity={0.13} />
      <div style={{ maxWidth: 460, margin: "0 auto", position: "relative" }}>
        <SectionMark number="04" title="다른 역할 입어보기" />
        {children}
      </div>
    </div>
  );
}

const titleStyle = { fontFamily: "Pretendard, sans-serif", fontWeight: 400, fontSize: 22, marginBottom: 12 };
const bodyStyle = { fontSize: 13.5, lineHeight: 1.6, marginBottom: 16, color: "#1c1a17" };
const labelStyle = { display: "block", fontSize: 12.5, color: "#847c6b", marginBottom: 8 };
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
