import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.mg-root { --ground:#eae6da; --paper:#1c1a17; --ink:#1c1a17; --muted:#847c6b; --open:#a13d2e; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2eee0 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.mg-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.mg-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.mg-persona { text-align:center; margin-bottom:24px; }
.mg-persona h1 { font-family:Pretendard,sans-serif;  font-size:32px; margin:0; font-weight:500; }
.mg-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.mg-tagline { font-family:Pretendard,sans-serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.mg-persona-header { font-family:Pretendard,sans-serif; font-size:15px; line-height:1.6; color:#1c1a17; text-align:center; margin:0 0 20px; font-weight:600; }
.mg-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(28,26,23,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.mg-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.mg-q { font-family:Pretendard,sans-serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.mg-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.mg-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.mg-textarea::placeholder { color:rgba(49,53,45,.28); }
.mg-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.mg-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.mg-opt:hover { background:rgba(49,53,45,.07); }
.mg-opt.sel { background:rgba(28,26,23,.13); border-color:var(--open); color:#1c1a17; }
.mg-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.mg-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.mg-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.mg-actions-row { display:flex; align-items:center; gap:14px; }
.mg-actions-row .mg-next { flex:1; }
.mg-condition-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:20px;
  font-family:Pretendard,sans-serif; font-size:15.5px; line-height:1.75; margin-bottom:20px; box-shadow:0 10px 26px rgba(0,0,0,.3); }
.mg-condition-label { font-size:11px; color:#6b6a5c; font-family:Pretendard,sans-serif; margin-bottom:8px; letter-spacing:.04em; }
.mg-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.mg-summary-row { margin-bottom:12px; }
.mg-summary-row:last-child { margin-bottom:0; }
.mg-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.mg-summary-value { font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.6; }
.mg-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.mg-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:mg-pulse 1.2s infinite ease-in-out; }
.mg-loading .dot:nth-child(2) { animation-delay:.2s; }
.mg-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes mg-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.mg-result-block { margin-bottom:16px; }
.mg-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.mg-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.mg-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.mg-final-text { font-size:14px; line-height:1.85; color:#1c1a17; }
.mg-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.mg-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const Q1_OPTS = ["있다.", "비슷한 일이 떠오른다.", "없다."];
const Q3_OPTS = ["하려고 했다.", "하지 않으려고 했다.", "어느 쪽도 정하지 못했다.", "직접 적기"];
const Q7_OPTS = [
  "처음과 같은 판단이다.",
  "같은 방향이지만 조건을 조정하고 싶다.",
  "다른 선택을 한다.",
  "아직 결정하기 어렵다.",
  "직접 적기",
];
function q8Prompt(a) {
  switch (a.step7) {
    case "처음과 같은 판단이다.":
      return "이 둘을 함께 보아도 같은 판단을 하는 이유는 무엇입니까?";
    case "같은 방향이지만 조건을 조정하고 싶다.":
      return "무엇을 조정하고 싶습니까?";
    case "다른 선택을 한다.":
      return "무엇을 함께 보았을 때 판단이 달라졌습니까?";
    case "아직 결정하기 어렵다.":
      return "지금도 결정하기 어렵게 만드는 것은 무엇입니까?";
    default:
      return "그렇게 판단한 이유는 무엇입니까?";
  }
}

function buildQuestionPrompt(a) {
  const judgment = a.step3 === "직접 적기" ? a.step3b : a.step3;
  return `당신은 사용자가 스스로 정한 "판단이 달라지는 조건"을, 지금 실제 상황과
비교할 수 있게 만들어주는 역할입니다. 판단을 대신 내리지 않습니다.
사용자 정보:
- 결정해야 했던 것: "${a.step2}"
- 그때의 판단: "${judgment}"
- 가장 마음에 걸렸던 것: "${a.step4}"
- 판단이 달라지려면 이렇게 되어야 한다고 답한 조건: "${a.step5}"
작업:
1. step5(달라지는 조건)를 실제 지금 상황과 비교할 수 있는 구체적인 질문
   하나만 만드세요.
2. 사용자가 쓴 명사와 단위(금액, 요일, 횟수, 비율 등)를 최대한 그대로 유지하세요.
3. 새로운 기준을 추가하지 마세요. step5에 없는 조건을 만들어내지 마세요.
4. 답을 특정 방향으로 유도하지 마세요. "그러니 괜찮다"거나 "그러니 안 된다" 같은
   판단을 암시하지 마세요.
5. 한 번에 한 가지 사실만 묻는 질문 하나로 쓰세요. 평가하거나 해설하지 마세요.
출력은 JSON만: {"question": "여기에 질문 하나"}`;
}

function buildResultPrompt(a) {
  const judgment = a.step3 === "직접 적기" ? a.step3b : a.step3;
  const rejudge = a.step7 === "직접 적기" ? a.step7b : a.step7;
  return `당신은 사용자가 스스로 정한 "판단이 달라지는 조건"과 실제 지금 상황을
함께 놓고 본 뒤 그 판단이 실제로 어떻게 됐는지 사실 그대로 정리하는 역할입니다.
"현명한 결정입니다", "좋은 판단입니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
"판단이 달라지는 조건"(사용자가 미리 정한 기준)과 "현재 실제 상황"(지금 확인된
사실)을 구분해서 쓰세요. 두 개념을 섞어 쓰지 마세요.
데이터:
- 결정해야 했던 것: "${a.step2}"
- 그때의 판단: "${judgment}"
- 가장 마음에 걸렸던 것: "${a.step4}"
- 판단이 달라지는 조건: "${a.step5}"
- 실제 상황을 확인하기 위한 질문: "${a.step6question}"
- 그 질문에 대한 현재 실제 상황: "${a.step6answer}"
- 둘을 함께 본 뒤의 재판단: "${rejudge}"
- 그 이유: "${a.step8}"
작업:
1. step7(재판단)을 근거로 어떤 선택을 했는지 먼저 확정하세요.
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
3. "처음과 같은 판단"으로 확인된 경우도 실패가 아니라, 조건과 실제 상황을 함께
   확인한 뒤에도 같은 판단이 맞다고 확인된 결과입니다. 그대로 쓰세요.
4. 제안은 행동 지시가 아니라, 다음에 비슷한 결정을 마주칠 때 살펴볼 관찰 포인트
   하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "결정해야 했던 것과 그때의 판단 / 가장 마음에 걸렸던 것 / 판단이 달라지는 조건과 확인된 실제 상황 / 둘을 함께 본 뒤의 재판단과 이유, 이 네 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  hasScene: "",
  step2: "",
  step3: "", step3b: "",
  step4: "",
  step5: "",
  step6question: "",
  step6answer: "",
  step7: "", step7b: "",
  step8: "",
};

export default function MagistrateLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [error, setError] = useState(null);
  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));

  async function goToQuestion() {
    setStep("loading-question");
    setError(null);
    try {
      const raw = await mockCallClaude(buildQuestionPrompt(answers));
      const parsed = JSON.parse(raw);
      set("step6question", parsed.question);
      setStep("s6");
    } catch (e) {
      console.error("goToQuestion failed:", e);
      setError("질문을 만드는 중 문제가 생겼습니다. 다시 시도해주세요.");
      setStep("s5");
    }
  }
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

  const q3Ready = answers.step3 && (answers.step3 !== "직접 적기" || answers.step3b.trim());
  const q7Ready = answers.step7 && (answers.step7 !== "직접 적기" || answers.step7b.trim());
  const judgmentDisplay = answers.step3 === "직접 적기" ? answers.step3b : answers.step3;

  return (
    <div className="mg-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mg-shell">
        <div className="mg-eyebrow">돌 하나를 얹다</div>
        <div className="mg-persona">
          <h1>기준!</h1>
          <div className="en">The Magistrate</div>
        </div>

        {step === "intro" && (
          <>
            <p className="mg-tagline">어느 정도까지라면,<br />내 판단은 달라질까.</p>
            <p className="mg-persona-header">어느 지점에서 판단이 달라지는지 찾아봅시다.</p>
            <p className="mg-hint">여덟 개의 질문을 지나갑니다.</p>
            <button className="mg-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="mg-q">최근 어떤 일을 두고 결정하기 어려웠던 순간이 있었습니까?</p>
            <div className="mg-opts">
              {Q1_OPTS.map((o) => (
                <button key={o} className={`mg-opt ${answers.hasScene === o ? "sel" : ""}`} onClick={() => { set("hasScene", o); setStep("s2"); }}>{o}</button>
              ))}
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <button className="mg-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="mg-step-label">STEP 2</div>
            <p className="mg-q">그때 무엇을 결정해야 했습니까?</p>
            {answers.hasScene === "없다." && (
              <p className="mg-hint">떠오르는 사례가 없다면, 앞으로 그런 상황이 온다면 어떨지 상상해서 적어주세요.</p>
            )}
            <textarea className="mg-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <div className="mg-actions-row">
              <button className="mg-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="mg-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="mg-step-label">STEP 3</div>
            <div className="mg-subject">"{answers.step2}"</div>
            <p className="mg-q">그때는 어느 쪽으로 생각하고 있었습니까?</p>
            <div className="mg-opts">
              {Q3_OPTS.map((o) => (
                <button key={o} className={`mg-opt ${answers.step3 === o ? "sel" : ""}`} onClick={() => set("step3", o)}>{o}</button>
              ))}
            </div>
            {answers.step3 === "직접 적기" && (
              <textarea className="mg-textarea" value={answers.step3b} onChange={(e) => set("step3b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            <div className="mg-actions-row">
              <button className="mg-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="mg-next" disabled={!q3Ready} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="mg-step-label">STEP 4</div>
            <div className="mg-subject">"{answers.step2}"</div>
            <p className="mg-q">이 결정에서 가장 마음에 걸렸던 것은 무엇입니까?</p>
            <textarea className="mg-textarea" value={answers.step4} onChange={(e) => set("step4", e.target.value)} />
            <div className="mg-actions-row">
              <button className="mg-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="mg-next" disabled={!answers.step4.trim()} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="mg-step-label">STEP 5</div>
            <div className="mg-subject">"{answers.step2}"</div>
            <p className="mg-q">{answers.step4}이(가) 어떻게 달라지면 지금과 다른 선택을 할 수 있을 것 같습니까?</p>
            <p className="mg-hint">금액, 요일, 횟수, 비율처럼 실제로 확인할 수 있는 기준으로 적어주세요.</p>
            <textarea className="mg-textarea" value={answers.step5} onChange={(e) => set("step5", e.target.value)} />
            {error && <p className="mg-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="mg-actions-row">
              <button className="mg-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="mg-next" disabled={!answers.step5.trim()} onClick={goToQuestion}>다음</button>
            </div>
          </>
        )}

        {step === "loading-question" && (
          <div className="mg-loading">
            판결선을 확인하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "s6" && (
          <>
            <div className="mg-condition-card">
              <div className="mg-condition-label">지금 실제 상황을 확인해봅시다 —</div>
              {answers.step6question}
            </div>
            <div className="mg-step-label">STEP 6</div>
            <textarea className="mg-textarea" value={answers.step6answer} onChange={(e) => set("step6answer", e.target.value)} placeholder="지금 알고 있는 대로 적어주세요." />
            <button className="mg-next" disabled={!answers.step6answer.trim()} onClick={() => setStep("s7")}>다음</button>
          </>
        )}

        {step === "s7" && (
          <>
            <div className="mg-step-label">판결 화면</div>
            <div className="mg-summary-card">
              <div className="mg-summary-row">
                <div className="mg-summary-label">내 판단이 달라지는 선</div>
                <div className="mg-summary-value">{answers.step5}</div>
              </div>
              <div className="mg-summary-row">
                <div className="mg-summary-label">현재 실제 상황</div>
                <div className="mg-summary-value">{answers.step6answer}</div>
              </div>
            </div>
            <p className="mg-q">이 둘을 함께 놓고 보면, 지금은 어떻게 판단합니까?</p>
            <div className="mg-opts">
              {Q7_OPTS.map((o) => (
                <button key={o} className={`mg-opt ${answers.step7 === o ? "sel" : ""}`} onClick={() => set("step7", o)}>{o}</button>
              ))}
            </div>
            {answers.step7 === "직접 적기" && (
              <textarea className="mg-textarea" value={answers.step7b} onChange={(e) => set("step7b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            <div className="mg-actions-row">
              <button className="mg-back" onClick={() => setStep("s6")}>← 이전</button>
              <button className="mg-next" disabled={!q7Ready} onClick={() => setStep("s8")}>다음</button>
            </div>
          </>
        )}

        {step === "s8" && (
          <>
            <div className="mg-step-label">STEP 8</div>
            <div className="mg-subject">"{judgmentDisplay}"</div>
            <p className="mg-q">{q8Prompt(answers)}</p>
            <textarea className="mg-textarea" value={answers.step8} onChange={(e) => set("step8", e.target.value)} />
            {error && <p className="mg-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="mg-actions-row">
              <button className="mg-back" onClick={() => setStep("s7")}>← 이전</button>
              <button className="mg-next" disabled={!answers.step8.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="mg-loading">
            판결을 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="mg-result-block">
              <div className="mg-result-label">기록된 사실</div>
              <div className="mg-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="mg-final-label">제안</div>
            <div className="mg-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="mg-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="mg-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
