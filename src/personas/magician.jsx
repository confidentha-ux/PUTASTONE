import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.mj-root { --ground:#eae6da; --paper:#1c1a17; --ink:#1c1a17; --muted:#847c6b; --open:#1c1a17; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2eee0 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.mj-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.mj-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.mj-persona { text-align:center; margin-bottom:24px; }
.mj-persona h1 { font-family:Pretendard,sans-serif;  font-size:32px; margin:0; font-weight:500; }
.mj-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.mj-tagline { font-family:Pretendard,sans-serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.mj-persona-header { font-family:Pretendard,sans-serif; font-size:15px; line-height:1.6; color:#1c1a17; text-align:center; margin:0 0 20px; font-weight:600; }
.mj-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(28,26,23,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.mj-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.mj-q { font-family:Pretendard,sans-serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.mj-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.mj-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.mj-textarea::placeholder { color:rgba(49,53,45,.28); }
.mj-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.mj-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.mj-opt:hover { background:rgba(49,53,45,.07); }
.mj-opt.sel { background:rgba(28,26,23,.13); border-color:var(--open); color:#1c1a17; }
.mj-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.mj-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.mj-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.mj-actions-row { display:flex; align-items:center; gap:14px; }
.mj-actions-row .mj-next { flex:1; }
.mj-condition-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:20px;
  font-family:Pretendard,sans-serif; font-size:15.5px; line-height:1.75; margin-bottom:20px; box-shadow:0 10px 26px rgba(0,0,0,.3); }
.mj-condition-label { font-size:11px; color:#6b6a5c; font-family:Pretendard,sans-serif; margin-bottom:8px; letter-spacing:.04em; }
.mj-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.mj-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:mj-pulse 1.2s infinite ease-in-out; }
.mj-loading .dot:nth-child(2) { animation-delay:.2s; }
.mj-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes mj-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.mj-result-block { margin-bottom:16px; }
.mj-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.mj-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.mj-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.mj-final-text { font-size:14px; line-height:1.85; color:#1c1a17; }
.mj-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.mj-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const Q1_OPTS = ["있다.", "비슷한 일이 떠오른다.", "없다."];
const Q3_OPTS = ["하려고 했다.", "하지 않으려고 했다.", "어느 쪽도 정하지 못했다.", "직접 적기"];
const Q5_OPTS = ["처음과 같은 선택을 한다.", "다른 선택을 한다.", "아직 결정하기 어렵다.", "직접 적기"];
const Q7_OPTS = [
  "이 요소가 판단을 거의 결정하고 있었다.",
  "중요한 이유 중 하나였다.",
  "영향을 주고 있었지만 결정적인 이유는 아니었다.",
  "생각했던 것보다 영향이 작았다.",
  "아직 잘 모르겠다.",
];
const Q8_OPTS = [
  "처음과 같은 판단이다.",
  "같은 선택이지만 이유가 다르게 보인다.",
  "다른 선택을 한다.",
  "아직 결정하기 어렵다.",
  "직접 적기",
];
function q6Prompt(a) {
  switch (a.step5) {
    case "처음과 같은 선택을 한다.":
      return `"${a.step4}"가 없어도 같은 판단을 하게 만드는 것은 무엇입니까?`;
    case "다른 선택을 한다.":
      return `"${a.step4}"가 보이지 않자, 무엇이 달라져서 판단도 달라졌습니까?`;
    case "아직 결정하기 어렵다.":
      return `"${a.step4}"가 없어도 결정을 어렵게 만드는 것은 무엇입니까?`;
    default:
      return "그렇게 판단한 이유는 무엇입니까?";
  }
}
function q9Prompt(a) {
  switch (a.step8) {
    case "처음과 같은 판단이다.":
      return "두 경우를 모두 보아도 같은 판단을 하는 이유는 무엇입니까?";
    case "같은 선택이지만 이유가 다르게 보인다.":
      return "처음에는 무엇이 중요하다고 생각했고, 지금은 무엇이 더 중요하게 보입니까?";
    case "다른 선택을 한다.":
      return "무엇을 확인하면서 판단이 달라졌습니까?";
    case "아직 결정하기 어렵다.":
      return "한 요소를 빼서 보아도 아직 판단하기 어려운 것은 무엇입니까?";
    default:
      return "그렇게 판단한 이유는 무엇입니까?";
  }
}

function buildResultPrompt(a) {
  const startJudgment = a.step3 === "직접 적기" ? a.step3b : a.step3;
  const withoutJudgment = a.step5 === "직접 적기" ? a.step5b : a.step5;
  const finalJudgment = a.step8 === "직접 적기" ? a.step8b : a.step8;
  return `당신은 사용자가 판단에서 크게 작용하던 요소 하나를 잠시 제거했다가 다시
놓아본 뒤, 그 판단이 실제로 어떻게 됐는지 사실 그대로 정리하는 역할입니다.
"현명한 판단입니다", "더 명확해졌습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
"요소가 없을 때의 판단"(가정 상태)과 "요소를 다시 놓고 본 뒤의 최종 판단"(실제
상태)을 구분해서 쓰세요. 두 개념을 섞어 쓰지 마세요.
데이터:
- 실제 선택: "${a.step2}"
- 출발 판단: "${startJudgment}"
- 가장 크게 작용하는 요소: "${a.step4}"
- 요소를 뺀 상태에서의 재판단: "${withoutJudgment}"
- 요소가 없어도 남아 있던 근거: "${a.step6}"
- 그 요소가 처음 판단에서 했던 실제 역할: "${a.step7}"
- 요소를 다시 놓고 본 최종 재판단: "${finalJudgment}"
- 그 이유: "${a.step9}"
작업:
1. step8(최종 재판단)을 근거로 어떤 선택을 했는지 먼저 확정하세요.
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
3. "처음과 같은 판단"으로 확인된 경우도 실패가 아니라, 그 요소를 빼고 다시 놓고
   본 뒤에도 같은 판단이 맞다고 확인된 결과입니다. 그대로 쓰세요.
4. 제안은 행동 지시가 아니라, 다음에 비슷한 요소가 크게 작용할 때 살펴볼 관찰
   포인트 하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "실제 선택과 출발 판단 / 가장 크게 작용하는 요소 / 요소를 뺀 재판단과 남아 있던 근거 / 요소의 실제 역할과 최종 재판단, 그 이유, 이 네 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  hasScene: "",
  step2: "",
  step3: "", step3b: "",
  step4: "",
  step5: "", step5b: "",
  step6: "",
  step7: "",
  step8: "", step8b: "",
  step9: "",
};

export default function MagicianLens({ onComplete } = {}) {
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
      setStep("s9");
    }
  }
  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setStep("intro");
  }

  const q3Ready = answers.step3 && (answers.step3 !== "직접 적기" || answers.step3b.trim());
  const q5Ready = answers.step5 && (answers.step5 !== "직접 적기" || answers.step5b.trim());
  const q8Ready = answers.step8 && (answers.step8 !== "직접 적기" || answers.step8b.trim());

  return (
    <div className="mj-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mj-shell">
        <div className="mj-eyebrow">돌 하나를 얹다</div>
        <div className="mj-persona">
          <h1>마술사</h1>
          <div className="en">The Magician</div>
        </div>

        {step === "intro" && (
          <>
            <p className="mj-tagline">가장 크게 걸리는 한 가지가 잠시 사라진다면,<br />나는 어떻게 선택할까.</p>
            <p className="mj-persona-header">한 가지를 잠시 없애고 다시 봅시다.</p>
            <p className="mj-hint">아홉 개의 질문을 지나갑니다.</p>
            <button className="mj-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="mj-q">최근 어떤 선택을 하면서, 한 가지가 유난히 크게 마음에 걸렸던 일이 있었습니까?</p>
            <div className="mj-opts">
              {Q1_OPTS.map((o) => (
                <button key={o} className={`mj-opt ${answers.hasScene === o ? "sel" : ""}`} onClick={() => { set("hasScene", o); setStep("s2"); }}>{o}</button>
              ))}
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <button className="mj-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="mj-step-label">STEP 2</div>
            <p className="mj-q">그때 무엇을 결정하거나 선택해야 했습니까?</p>
            {answers.hasScene === "없다." && (
              <p className="mj-hint">떠오르는 사례가 없다면, 앞으로 그런 상황이 온다면 어떨지 상상해서 적어주세요.</p>
            )}
            <textarea className="mj-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <div className="mj-actions-row">
              <button className="mj-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="mj-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="mj-step-label">STEP 3</div>
            <div className="mj-subject">"{answers.step2}"</div>
            <p className="mj-q">그때는 어느 쪽으로 생각하고 있었습니까?</p>
            <div className="mj-opts">
              {Q3_OPTS.map((o) => (
                <button key={o} className={`mj-opt ${answers.step3 === o ? "sel" : ""}`} onClick={() => set("step3", o)}>{o}</button>
              ))}
            </div>
            {answers.step3 === "직접 적기" && (
              <textarea className="mj-textarea" value={answers.step3b} onChange={(e) => set("step3b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            <div className="mj-actions-row">
              <button className="mj-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="mj-next" disabled={!q3Ready} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="mj-step-label">STEP 4</div>
            <div className="mj-subject">"{answers.step2}"</div>
            <p className="mj-q">지금 이 선택에서 가장 크게 작용하고 있는 한 가지는 무엇입니까?</p>
            <p className="mj-hint">예: 상대가 실망할 것 같다는 생각, 이미 들인 시간이 아깝다는 생각, 돈을 잃을 수도 있다는 걱정</p>
            <textarea className="mj-textarea" value={answers.step4} onChange={(e) => set("step4", e.target.value)} />
            <div className="mj-actions-row">
              <button className="mj-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="mj-next" disabled={!answers.step4.trim()} onClick={() => setStep("cloak1")}>다음</button>
            </div>
          </>
        )}

        {step === "cloak1" && (
          <>
            <div className="mj-condition-card">
              <div className="mj-condition-label">투명망토 —</div>
              잠시 "{answers.step4}"에 투명망토를 씌워보겠습니다.
              지금 이 판단을 하는 동안에는 "{answers.step4}"가 보이지 않고 판단에도 들어오지 않는다고 생각해보세요.
            </div>
            <button className="mj-next" onClick={() => setStep("s5")}>계속</button>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="mj-step-label">STEP 5</div>
            <div className="mj-subject">"{answers.step2}"</div>
            <p className="mj-q">"{answers.step4}"가 판단에 들어오지 않는다면, 지금도 같은 선택을 하시겠습니까?</p>
            <div className="mj-opts">
              {Q5_OPTS.map((o) => (
                <button key={o} className={`mj-opt ${answers.step5 === o ? "sel" : ""}`} onClick={() => set("step5", o)}>{o}</button>
              ))}
            </div>
            {answers.step5 === "직접 적기" && (
              <textarea className="mj-textarea" value={answers.step5b} onChange={(e) => set("step5b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            <div className="mj-actions-row">
              <button className="mj-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="mj-next" disabled={!q5Ready} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="mj-step-label">STEP 6</div>
            <div className="mj-subject">"{answers.step2}"</div>
            <p className="mj-q">{q6Prompt(answers)}</p>
            <textarea className="mj-textarea" value={answers.step6} onChange={(e) => set("step6", e.target.value)} />
            {error && <p className="mj-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="mj-actions-row">
              <button className="mj-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="mj-next" disabled={!answers.step6.trim()} onClick={() => setStep("cloak2")}>다음</button>
            </div>
          </>
        )}

        {step === "cloak2" && (
          <>
            <div className="mj-condition-card">
              <div className="mj-condition-label">투명망토 벗기기 —</div>
              이제 "{answers.step4}"를 다시 판단 안으로 가져오겠습니다.
            </div>
            <button className="mj-next" onClick={() => setStep("s7")}>계속</button>
          </>
        )}

        {step === "s7" && (
          <>
            <div className="mj-step-label">STEP 7</div>
            <div className="mj-subject">"{answers.step4}"</div>
            <p className="mj-q">이 요소를 다시 놓고 보면, 처음 판단에서 어떤 역할을 하고 있었습니까?</p>
            <div className="mj-opts">
              {Q7_OPTS.map((o) => (
                <button key={o} className={`mj-opt ${answers.step7 === o ? "sel" : ""}`} onClick={() => set("step7", o)}>{o}</button>
              ))}
            </div>
            <div className="mj-actions-row">
              <button className="mj-back" onClick={() => setStep("cloak2")}>← 이전</button>
              <button className="mj-next" disabled={!answers.step7} onClick={() => setStep("s8")}>다음</button>
            </div>
          </>
        )}

        {step === "s8" && (
          <>
            <div className="mj-step-label">STEP 8</div>
            <div className="mj-subject">"{answers.step2}"</div>
            <p className="mj-q">"{answers.step4}"가 있을 때와 없을 때를 모두 보았습니다. 지금은 어떻게 판단합니까?</p>
            <div className="mj-opts">
              {Q8_OPTS.map((o) => (
                <button key={o} className={`mj-opt ${answers.step8 === o ? "sel" : ""}`} onClick={() => set("step8", o)}>{o}</button>
              ))}
            </div>
            {answers.step8 === "직접 적기" && (
              <textarea className="mj-textarea" value={answers.step8b} onChange={(e) => set("step8b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            <div className="mj-actions-row">
              <button className="mj-back" onClick={() => setStep("s7")}>← 이전</button>
              <button className="mj-next" disabled={!q8Ready} onClick={() => setStep("s9")}>다음</button>
            </div>
          </>
        )}

        {step === "s9" && (
          <>
            <div className="mj-step-label">STEP 9</div>
            <div className="mj-subject">"{answers.step2}"</div>
            <p className="mj-q">{q9Prompt(answers)}</p>
            <textarea className="mj-textarea" value={answers.step9} onChange={(e) => set("step9", e.target.value)} />
            {error && <p className="mj-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="mj-actions-row">
              <button className="mj-back" onClick={() => setStep("s8")}>← 이전</button>
              <button className="mj-next" disabled={!answers.step9.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="mj-loading">
            마술사가 무대를 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="mj-result-block">
              <div className="mj-result-label">기록된 사실</div>
              <div className="mj-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="mj-final-label">제안</div>
            <div className="mj-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="mj-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="mj-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
