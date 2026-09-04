import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.nv-root { --ground:#eae6da; --paper:#1c1a17; --ink:#1c1a17; --muted:#847c6b; --open:#a13d2e; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2eee0 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.nv-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.nv-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.nv-persona { text-align:center; margin-bottom:24px; }
.nv-persona h1 { font-family:Pretendard,sans-serif;  font-size:32px; margin:0; font-weight:500; }
.nv-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.nv-tagline { font-family:Pretendard,sans-serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.nv-persona-header { font-family:Pretendard,sans-serif; font-size:15px; line-height:1.6; color:#1c1a17; text-align:center; margin:0 0 20px; font-weight:600; }
.nv-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(28,26,23,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.nv-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.nv-q { font-family:Pretendard,sans-serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.nv-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.nv-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.nv-textarea::placeholder { color:rgba(49,53,45,.28); }
.nv-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.nv-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.nv-opt:hover { background:rgba(49,53,45,.07); }
.nv-opt.sel { background:rgba(28,26,23,.13); border-color:var(--open); color:#1c1a17; }
.nv-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.nv-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.nv-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.nv-actions-row { display:flex; align-items:center; gap:14px; }
.nv-actions-row .nv-next { flex:1; }
.nv-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.nv-summary-row { margin-bottom:12px; }
.nv-summary-row:last-child { margin-bottom:0; }
.nv-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.nv-summary-value { font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.6; }
.nv-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.nv-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:nv-pulse 1.2s infinite ease-in-out; }
.nv-loading .dot:nth-child(2) { animation-delay:.2s; }
.nv-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes nv-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.nv-result-block { margin-bottom:16px; }
.nv-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.nv-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.nv-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.nv-final-text { font-size:14px; line-height:1.85; color:#1c1a17; }
.nv-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.nv-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const Q1_OPTS = ["있다.", "비슷한 순간이 떠오른다.", "없다."];
const Q7_OPTS = [
  "처음과 같은 생각이다.",
  "일부는 같지만 다르게 보이는 부분이 있다.",
  "지금은 조금 다르게 생각한다.",
  "처음과 다른 생각이 든다.",
  "아직 잘 모르겠다.",
];
function q8Prompt(a) {
  switch (a.step7) {
    case "처음과 같은 생각이다.":
      return "밖에서 보이는 모습과 그때의 마음을 함께 보아도 처음 생각이 그대로 남는 이유는 무엇입니까?";
    case "일부는 같지만 다르게 보이는 부분이 있다.":
      return "어떤 부분은 그대로이고, 어떤 부분은 다르게 보입니까?";
    case "지금은 조금 다르게 생각한다.":
      return "소설가로 이 장면을 다시 보면서 무엇이 다르게 보였습니까?";
    case "처음과 다른 생각이 든다.":
      return "밖에서 보인 모습과 그때의 마음을 함께 보면서 무엇이 달라졌습니까?";
    case "아직 잘 모르겠다.":
      return "두 모습을 함께 보아도 아직 자신을 판단하기 어려운 것은 무엇입니까?";
    default:
      return "그렇게 생각하는 이유는 무엇입니까?";
  }
}

function buildResultPrompt(a) {
  return `당신은 사용자가 밖에서 보이는 모습과 그때 안에서 있었던 것을 함께 놓고
본 뒤, 자신에 대한 판단이 실제로 어떻게 됐는지 사실 그대로 정리하는 역할입니다.
"성장했습니다", "더 깊이 이해했습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
"밖에서 보이는 모습"(관찰 가능한 행동)과 "안에서 경험한 것"(마음속에 있던 것)을
구분해서 쓰세요. 두 개념을 섞어 쓰지 마세요.
데이터:
- 실제 장면: "${a.step2}"
- 처음 자기판단: "${a.step3}"
- 밖에서 보이는 모습: "${a.step4}"
- 그때 안에서 있었던 것: "${a.step5}"
- 둘을 모두 아는 소설가의 묘사: "${a.step6}"
- 처음 자기판단에 대한 재검토: "${a.step7}"
- 그 이유: "${a.step8}"
작업:
1. 처음 자기판단(step3)과 소설가의 묘사(step6)를 나란히 비교할 수 있게 쓰세요.
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
3. "처음과 같은 생각"으로 확인된 경우도 실패가 아니라, 밖과 안을 모두 본 뒤에도
   같은 판단이 맞다고 확인된 결과입니다. 그대로 쓰세요.
4. 제안은 행동 지시가 아니라, 다음에 비슷한 장면을 마주칠 때 살펴볼 관찰 포인트
   하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "실제 장면 / 처음 자기판단 / 밖에서 보이는 모습과 안에서 있었던 것 / 소설가의 묘사 / 재검토와 이유, 이 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  hasScene: "",
  step2: "",
  step3: "",
  step4: "",
  step5: "",
  step6: "",
  step7: "",
  step8: "",
};

export default function NovelistLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [error, setError] = useState(null);
  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));

  async function goToResult() {
    setStep("loading-result");
    setError(null);
    try {
      const raw = await mockCallClaude(buildResultPrompt(answers));
      const parsed = JSON.parse(raw);
      set("summary", parsed.summary);
      set("suggestion", parsed.suggestion);
      setStep("result");
    } catch (e) {
      console.error("goToResult failed:", e);
      setError("결과를 정리하는 중 문제가 생겼습니다. 다시 시도해주세요.");
      setStep("s8");
    }
  }
  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setStep("intro");
  }

  return (
    <div className="nv-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="nv-shell">
        <div className="nv-eyebrow">돌 하나를 얹다</div>
        <div className="nv-persona">
          <h1>소설가</h1>
          <div className="en">The Novelist</div>
        </div>

        {step === "intro" && (
          <>
            <p className="nv-tagline">겉으로 보인 나와,<br />속으로 생각하던 나는 얼마나 같았을까.</p>
            <p className="nv-persona-header">잠시 이야기 밖으로 나가봅시다.</p>
            <p className="nv-hint">여덟 개의 질문을 지나갑니다.</p>
            <button className="nv-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="nv-q">최근 누군가와 이야기하거나 어떤 일을 하다가, 겉으로는 그냥 지나갔지만 속으로는 생각이 많았던 순간이 있었습니까?</p>
            <div className="nv-opts">
              {Q1_OPTS.map((o) => (
                <button key={o} className={`nv-opt ${answers.hasScene === o ? "sel" : ""}`} onClick={() => { set("hasScene", o); setStep("s2"); }}>{o}</button>
              ))}
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <button className="nv-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="nv-step-label">STEP 2</div>
            <p className="nv-q">무슨 일이 있었습니까?</p>
            {answers.hasScene === "없다." && (
              <p className="nv-hint">떠오르는 사례가 없다면, 앞으로 그런 상황이 온다면 어떨지 상상해서 적어주세요.</p>
            )}
            <textarea className="nv-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} placeholder="예: 회의에서 내 의견을 말할 기회가 있었는데 그냥 넘어갔다." />
            <div className="nv-actions-row">
              <button className="nv-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="nv-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="nv-step-label">STEP 3 · Initial Judgment</div>
            <div className="nv-subject">"{answers.step2}"</div>
            <p className="nv-q">그 일이 있었을 때, 나는 나 자신을 어떻게 생각했습니까?</p>
            <textarea className="nv-textarea" value={answers.step3} onChange={(e) => set("step3", e.target.value)} placeholder="예: 나는 중요한 순간에 말을 못 하는 사람이라고 생각했다." />
            <div className="nv-actions-row">
              <button className="nv-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="nv-next" disabled={!answers.step3.trim()} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="nv-step-label">STEP 4</div>
            <div className="nv-subject">"{answers.step2}"</div>
            <p className="nv-q">이제 이 장면을 쓰는 소설가가 되어봅니다. 이번에는 이 사람의 마음속을 알 수 없습니다.</p>
            <p className="nv-hint">밖에서 보이는 행동과 상태만 쓴다면, 이 장면에서 이 사람은 무엇을 하고 있습니까?</p>
            <textarea className="nv-textarea" value={answers.step4} onChange={(e) => set("step4", e.target.value)} placeholder="예: 다른 사람들의 이야기를 듣고 있었고, 내 차례가 왔을 때 짧게 대답했다." />
            <div className="nv-actions-row">
              <button className="nv-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="nv-next" disabled={!answers.step4.trim()} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="nv-step-label">STEP 5</div>
            <div className="nv-subject">"{answers.step2}"</div>
            <p className="nv-q">이번에는 작가가 이 사람의 마음속까지 알 수 있습니다.</p>
            <p className="nv-hint">그 순간 이 사람은 무엇을 생각하고 있었습니까? 무엇이 가장 신경 쓰이고 있었습니까?</p>
            <textarea className="nv-textarea" value={answers.step5} onChange={(e) => set("step5", e.target.value)} placeholder="예: 말을 잘못하면 괜히 분위기를 흐릴 것 같았고, 다른 사람들이 어떻게 받아들일지가 계속 신경 쓰였다." />
            <div className="nv-actions-row">
              <button className="nv-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="nv-next" disabled={!answers.step5.trim()} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="nv-step-label">병치 · STEP 6</div>
            <div className="nv-summary-card">
              <div className="nv-summary-row">
                <div className="nv-summary-label">밖에서 보이는 모습</div>
                <div className="nv-summary-value">{answers.step4}</div>
              </div>
              <div className="nv-summary-row">
                <div className="nv-summary-label">그때 내 안에서 있었던 것</div>
                <div className="nv-summary-value">{answers.step5}</div>
              </div>
            </div>
            <p className="nv-q">이 둘을 모두 알고 있는 소설가라면, 이 장면 속 사람을 어떻게 묘사하겠습니까?</p>
            <textarea className="nv-textarea" value={answers.step6} onChange={(e) => set("step6", e.target.value)} placeholder="예: 말할 것이 없어서 조용한 사람이라기보다, 주변 반응을 많이 살피면서 말을 고르고 있는 사람이다." />
            <div className="nv-actions-row">
              <button className="nv-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="nv-next" disabled={!answers.step6.trim()} onClick={() => setStep("s7")}>다음</button>
            </div>
          </>
        )}

        {step === "s7" && (
          <>
            <div className="nv-step-label">STEP 7</div>
            <div className="nv-subject">"{answers.step3}"</div>
            <p className="nv-q">지금까지는 소설가로 이 사람을 보았습니다. 이제 다시 나 자신으로 돌아와봅니다.</p>
            <p className="nv-hint">처음에는 "{answers.step3}"라고 생각했습니다. 지금도 그렇게 생각합니까?</p>
            <div className="nv-opts">
              {Q7_OPTS.map((o) => (
                <button key={o} className={`nv-opt ${answers.step7 === o ? "sel" : ""}`} onClick={() => set("step7", o)}>{o}</button>
              ))}
            </div>
            <div className="nv-actions-row">
              <button className="nv-back" onClick={() => setStep("s6")}>← 이전</button>
              <button className="nv-next" disabled={!answers.step7} onClick={() => setStep("s8")}>다음</button>
            </div>
          </>
        )}

        {step === "s8" && (
          <>
            <div className="nv-step-label">STEP 8</div>
            <div className="nv-subject">"{answers.step3}"</div>
            <p className="nv-q">{q8Prompt(answers)}</p>
            <textarea className="nv-textarea" value={answers.step8} onChange={(e) => set("step8", e.target.value)} />
            {error && <p className="nv-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="nv-actions-row">
              <button className="nv-back" onClick={() => setStep("s7")}>← 이전</button>
              <button className="nv-next" disabled={!answers.step8.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="nv-loading">
            소설가가 원고를 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="nv-result-block">
              <div className="nv-result-label">기록된 사실</div>
              <div className="nv-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="nv-final-label">제안</div>
            <div className="nv-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="nv-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="nv-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
