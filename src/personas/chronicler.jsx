import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.dt-root { --ground:#16131c; --paper:#ece7de; --ink:#221d2b; --muted:#7d7489; --open:#d6a756; --line:rgba(236,231,222,.14);
  min-height:100%; background:radial-gradient(120% 90% at 50% 0%,#241d2f 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.dt-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.dt-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.dt-persona { text-align:center; margin-bottom:24px; }
.dt-persona h1 { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:32px; margin:0; font-weight:500; }
.dt-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.dt-tagline { font-family:'Gowun Batang',serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.dt-persona-header { font-family:'Gowun Batang',serif; font-size:15px; line-height:1.6; color:#f6ecda; text-align:center; margin:0 0 20px; font-weight:600; }
.dt-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(214,167,86,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.dt-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.dt-q { font-family:'Gowun Batang',serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.dt-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.dt-textarea { width:100%; min-height:80px; background:rgba(236,231,222,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.dt-textarea::placeholder { color:rgba(236,231,222,.28); }
.dt-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.dt-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(236,231,222,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.dt-opt:hover { background:rgba(236,231,222,.07); }
.dt-opt.sel { background:rgba(214,167,86,.13); border-color:var(--open); color:#f6ecda; }
.dt-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#1b1509; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.dt-next:disabled { background:rgba(236,231,222,.07); color:var(--muted); cursor:default; }
.dt-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; margin-bottom:16px; padding:0; text-align:left; }
.dt-actions-row { display:flex; align-items:center; gap:14px; }
.dt-actions-row .dt-back { margin-bottom:0; flex-shrink:0; }
.dt-actions-row .dt-next { flex:1; }
.dt-condition-card { background:linear-gradient(160deg,#f2eee6,#e4ded3); color:var(--ink); border-radius:3px; padding:20px;
  font-family:'Gowun Batang',serif; font-size:15.5px; line-height:1.75; margin-bottom:20px; box-shadow:0 10px 26px rgba(0,0,0,.3); }
.dt-condition-label { font-size:11px; color:#8a8070; font-family:Pretendard,sans-serif; margin-bottom:8px; letter-spacing:.04em; }
.dt-summary-card { background:linear-gradient(160deg,#f2eee6,#e4ded3); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.dt-summary-row { margin-bottom:12px; }
.dt-summary-row:last-child { margin-bottom:0; }
.dt-summary-label { font-size:10.5px; color:#8a8070; letter-spacing:.04em; margin-bottom:3px; }
.dt-summary-value { font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.6; }
.dt-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.dt-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:dt-pulse 1.2s infinite ease-in-out; }
.dt-loading .dot:nth-child(2) { animation-delay:.2s; }
.dt-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes dt-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.dt-result-block { margin-bottom:16px; }
.dt-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.dt-result-card { background:linear-gradient(160deg,#f2eee6,#e4ded3); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.dt-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.dt-final-text { font-size:14px; line-height:1.85; color:#e8e2d6; }
.dt-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.dt-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#1b1509; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;
/* 데모용 — 실제로는 Layer 1에서 가져옴 */
const SAMPLE_JUDGMENT = "먼저 말하면 계산적으로 보일 것 같기 때문이다.";
/* ============ AI 호출 ============ */

const Q4_OPTS = [
  "상대에게서 직접 그런 말이나 반응을 받은 적이 있다.",
  "비슷한 상황에서 그런 일이 일어나는 것을 본 적이 있다.",
  "내가 이전에 비슷한 일을 겪은 적이 있다.",
  "특별한 경험은 없지만 원래 그렇게 생각해왔다.",
  "이유를 설명하기 어렵지만 그렇게 될 것 같았다.",
  "잘 모르겠다.",
  "직접 적기",
];
const Q5_OPTS = [
  "이번 상황에서도 직접 확인한 사실이 있다.",
  "그렇게 생각할 만한 근거는 있지만 아직 직접 확인하지는 않았다.",
  "이전 경험이나 사례를 바탕으로 그렇게 생각하고 있다.",
  "아직 예상이나 생각에 가깝다.",
  "잘 모르겠다.",
];
const Q6_OPTS = [
  "같은 판단을 한다.",
  "판단의 방향은 같지만 확신의 정도가 달라진다.",
  "다른 판단을 한다.",
  "아직 판단하기 어렵다.",
];
const Q7_PROMPT = {
  "같은 판단을 한다.": "이 사실을 알고도 같은 판단을 하는 이유는 무엇입니까?",
  "판단의 방향은 같지만 확신의 정도가 달라진다.": "무엇을 새롭게 보면서 확신의 정도가 달라졌습니까?",
  "다른 판단을 한다.": "무엇을 새롭게 보면서 판단이 달라졌습니까?",
  "아직 판단하기 어렵다.": "이 사실을 알고도 아직 판단하기 어렵게 만드는 것은 무엇입니까?",
};

function buildConditionPrompt(a) {
  const q4Answer = a.step3 === "직접 적기" ? a.step3b : a.step3;
  return `당신은 사용자의 판단을 실제로 다시 확인해볼 수 있는 최소 조건 하나를 만드는 역할입니다.
사용자가 말하지 않은 결론을 대신 만들어주지 않습니다. 조건을 만들 뿐, 판단은 사용자의 몫입니다.
사용자 정보:
- 원래 판단: "${a.judgment}"
- 장면 또는 이 문장을 고른 근거: "${a.step1}"
- 그때의 생각 (무엇이 걱정되었거나 어떤 생각으로 판단했는지): "${a.step2}"
- 그 생각의 근거: "${q4Answer}"
- 지금 이 상황에서 확인된 정도: "${a.step4}"
먼저 그 생각의 근거의 성격을 판단하세요.
- 직접반응형: 상대에게서 직접 그런 말이나 반응을 받은 적이 있다
- 목격형: 비슷한 상황에서 그런 일이 일어나는 것을 본 적이 있다
- 경험형: 내가 이전에 비슷한 일을 겪은 적이 있다
- 신념형: 특별한 경험 없이 원래 그렇게 생각해왔거나, 설명하기 어렵지만 그럴 것 같았다
- 불명확: 잘 모르겠다고 했거나 위 어디에도 뚜렷이 속하지 않는다 — 이 경우 확인된 정도를 근거로 판단하세요
성격에 따라 다른 조건을 만드세요.
- 직접반응형·목격형이면 → 그 반응이나 사례와 다르게 실제로 흘러간 구체적 사례
- 경험형이면 → 그 패턴이 깨진, 비슷하지만 다른 결과의 실제 경험
- 신념형·불명확이면 → 그 생각과 다르게 행동하거나 다른 결과를 낸 사람의 구체적 사례
출력은 사용자의 장면과 인물에 맞춘 구체적인 조건 문장 하나만 씁니다.
"~라고 해봅니다" 형태로, 실제 대사나 장면처럼 구체적으로 쓰세요.
평가하거나 해설하지 마세요.
출력은 JSON만: {"condition": "여기에 조건 문장", "conditionType": "직접반응형 | 목격형 | 경험형 | 신념형 | 불명확"}`;
}
function buildResultPrompt(a) {
  const q4Answer = a.step3 === "직접 적기" ? a.step3b : a.step3;
  return `당신은 사용자의 판단이 실제로 어떻게 됐는지 사실 그대로 정리하는 역할입니다.
"생각이 넓어졌습니다", "성장했습니다" 같은 평가 문구를 절대 쓰지 마세요.
데이터:
- 처음 판단: "${a.judgment}"
- 그때의 생각: "${a.step2}"
- 그 생각의 근거: "${q4Answer}"
- 지금 이 상황에서 확인된 정도: "${a.step4}"
- 조건의 성격: "${a.conditionType}"
- 새로 제시된 조건: "${a.condition}"
- 재판단: "${a.step6}"
- 그 이유: "${a.step7}"
작업:
1. step6(재판단)이 다음 네 가지 중 무엇인지 먼저 확정하세요: "같은 판단을 한다" / "판단의 방향은 같지만 확신의 정도가 달라진다" / "다른 판단을 한다" / "아직 판단하기 어렵다".
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을 지어내지 마세요.
3. "같은 판단을 한다"인 경우: 조건을 보고도 판단이 그대로 유지됐다는 사실 그대로 쓰세요. 이건 실패가 아니라 그 자체로 하나의 결과입니다.
4. "확신의 정도가 달라진다"인 경우: 결론은 같지만 무엇이 새롭게 보여서 확신이 달라졌는지 step7 내용 그대로 쓰세요.
5. "다른 판단을 한다"인 경우: 무엇을 새롭게 보면서 판단이 달라졌는지 step7 내용 그대로 쓰세요.
6. "아직 판단하기 어렵다"인 경우: 무엇이 판단을 계속 어렵게 만드는지 step7 내용 그대로 쓰세요. 이것도 실패가 아니라 지금 시점의 정직한 결과입니다.
7. 제안은 conditionType과 재판단 결과를 함께 반영해서, 이 사람에게만 해당하는 관찰 포인트를 쓰세요. 행동을 지시하지 말고 다음에 비슷한 상황에서 무엇을 지켜볼지 정도로만 제안하세요.
두 경우 모두 반드시 summary와 suggestion을 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "처음 판단 / 그때의 생각과 근거 / 확인된 정도 / 새로 제시된 조건 / 재판단과 그 이유, 이 다섯 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 제안 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  judgment: SAMPLE_JUDGMENT,
  hasScene: null,
  step1: "",
  step2: "",
  step3: "", step3b: "",
  step4: "",
  condition: "", conditionType: "",
  step6: "",
  step7: "",
};

export default function ChroniclerLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro"); // intro | s0..s7 | s5(판단카드) | loading-condition | s6 | s7 | loading-result | result
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [error, setError] = useState(null);
  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));

  async function goToCondition() {
    setStep("loading-condition");
    setError(null);
    try {
      const raw = await mockCallClaude(buildConditionPrompt(answers));
      const parsed = JSON.parse(raw);
      set("condition", parsed.condition);
      set("conditionType", parsed.conditionType);
      setStep("s6");
    } catch (e) {
      console.error("goToCondition failed:", e);
      setError("조건을 만드는 중 문제가 생겼습니다. 다시 시도해주세요.");
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
      setStep("s7");
    }
  }
  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setStep("intro");
  }

  const q4Ready = answers.step3 && (answers.step3 !== "직접 적기" || answers.step3b.trim());

  return (
    <div className="dt-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="dt-shell">
        <div className="dt-eyebrow">돌 하나를 얹다</div>
        <div className="dt-persona">
          <h1>기록자</h1>
          <div className="en">The Chronicler</div>
        </div>

        {step === "intro" && (
          <>
            <p className="dt-tagline">내가 걱정하는 일은,<br />실제로 어디까지 확인된 걸까.</p>
            <p className="dt-persona-header">일어난 일과 예상한 일을 나눠봅시다.</p>
            <div className="dt-subject">"{answers.judgment}"</div>
            <p className="dt-hint">일곱 개의 질문을 지나갑니다.</p>
            <button className="dt-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <button className="dt-back" onClick={() => setStep("intro")}>← 이전</button>
            <div className="dt-subject">"{answers.judgment}"</div>
            <p className="dt-q">이 생각이 들었던 구체적인 순간이 있었습니까?</p>
            <div className="dt-opts">
              <button className="dt-opt" onClick={() => { set("hasScene", true); setStep("s1"); }}>있다.</button>
              <button className="dt-opt" onClick={() => { set("hasScene", false); setStep("s1"); }}>특별히 떠오르는 순간은 없다.</button>
            </div>
          </>
        )}

        {step === "s1" && answers.hasScene === true && (
          <>
            <div className="dt-step-label">STEP 1</div>
            <div className="dt-subject">"{answers.judgment}"</div>
            <p className="dt-q">그 순간으로 돌아가 보겠습니다. 어떤 일이 있었습니까?</p>
            <p className="dt-hint">어디서, 누구와 있었고, 무슨 일이 있었는지 편하게 적어주세요.</p>
            <textarea className="dt-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} placeholder="예: 프리랜서로 작업을 맡았는데, 클라이언트에게 견적을 먼저 말해야 하는 상황이었다." />
            <div className="dt-actions-row">
              <button className="dt-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="dt-next" disabled={!answers.step1.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}
        {step === "s1" && answers.hasScene === false && (
          <>
            <div className="dt-step-label">STEP 1</div>
            <div className="dt-subject">"{answers.judgment}"</div>
            <p className="dt-hint" style={{ marginBottom: 6 }}>이 문장을 고르셨습니다.</p>
            <p className="dt-q">무엇을 보고 이 문장이 나와 가깝다고 느끼셨습니까?</p>
            <p className="dt-hint">편하게 적어주세요.</p>
            <textarea className="dt-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} placeholder="예: 예전에 비슷한 얘기를 꺼냈다가 분위기가 어색해진 적이 있어서." />
            <div className="dt-actions-row">
              <button className="dt-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="dt-next" disabled={!answers.step1.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <button className="dt-back" onClick={() => setStep("s1")}>← 이전</button>
            <div className="dt-subject">"{answers.judgment}"</div>
            <div className="dt-step-label">STEP 2</div>
            <p className="dt-q">그때 무엇이 걱정되었거나, 어떤 생각 때문에 그렇게 판단했습니까?</p>
            <textarea className="dt-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <button className="dt-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
          </>
        )}

        {step === "s3" && (
          <>
            <button className="dt-back" onClick={() => setStep("s2")}>← 이전</button>
            <div className="dt-subject">"{answers.judgment}"</div>
            <div className="dt-step-label">STEP 3</div>
            <p className="dt-q">그렇게 생각하게 된 데 가장 가까운 것은 무엇입니까?</p>
            <div className="dt-opts">
              {Q4_OPTS.map((o) => (
                <button key={o} className={`dt-opt ${answers.step3 === o ? "sel" : ""}`} onClick={() => set("step3", o)}>{o}</button>
              ))}
            </div>
            {answers.step3 === "직접 적기" && (
              <textarea className="dt-textarea" value={answers.step3b} onChange={(e) => set("step3b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            <button className="dt-next" disabled={!q4Ready} onClick={() => setStep("s4")}>다음</button>
          </>
        )}

        {step === "s4" && (
          <>
            <button className="dt-back" onClick={() => setStep("s3")}>← 이전</button>
            <div className="dt-subject">"{answers.judgment}"</div>
            <div className="dt-step-label">STEP 4</div>
            <p className="dt-q">그 생각이 지금 이 상황에서도 맞는지는 어느 정도 확인되어 있습니까?</p>
            <div className="dt-opts">
              {Q5_OPTS.map((o) => (
                <button key={o} className={`dt-opt ${answers.step4 === o ? "sel" : ""}`} onClick={() => set("step4", o)}>{o}</button>
              ))}
            </div>
            <button className="dt-next" disabled={!answers.step4} onClick={() => setStep("s5")}>다음</button>
          </>
        )}

        {step === "s5" && (
          <>
            <button className="dt-back" onClick={() => setStep("s4")}>← 이전</button>
            <div className="dt-subject">"{answers.judgment}"</div>
            <div className="dt-step-label">판단 카드</div>
            <div className="dt-summary-card">
              <div className="dt-summary-row">
                <div className="dt-summary-label">그때의 생각</div>
                <div className="dt-summary-value">{answers.step2}</div>
              </div>
              <div className="dt-summary-row">
                <div className="dt-summary-label">그 생각의 근거</div>
                <div className="dt-summary-value">{answers.step3 === "직접 적기" ? answers.step3b : answers.step3}</div>
              </div>
              <div className="dt-summary-row">
                <div className="dt-summary-label">현재 확인된 정도</div>
                <div className="dt-summary-value">{answers.step4}</div>
              </div>
            </div>
            {error && <p className="dt-hint" style={{ color: "#e08a8a" }}>{error}</p>}
            <button className="dt-next" onClick={goToCondition}>다음</button>
          </>
        )}

        {step === "loading-condition" && (
          <div className="dt-loading">
            기록자가 증거를 찾고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "s6" && (
          <>
            <div className="dt-condition-card">
              <div className="dt-condition-label">새로운 조건 —</div>
              {answers.condition}
            </div>
            <div className="dt-step-label">STEP 5</div>
            <p className="dt-q">이 사실을 알게 된 지금, 같은 상황이라면 처음과 같은 판단을 하시겠습니까?</p>
            <div className="dt-opts">
              {Q6_OPTS.map((o) => (
                <button key={o} className={`dt-opt ${answers.step6 === o ? "sel" : ""}`} onClick={() => set("step6", o)}>{o}</button>
              ))}
            </div>
            <button className="dt-next" disabled={!answers.step6} onClick={() => setStep("s7")}>다음</button>
          </>
        )}

        {step === "s7" && (
          <>
            <button className="dt-back" onClick={() => setStep("s6")}>← 이전</button>
            <div className="dt-subject">"{answers.judgment}"</div>
            <div className="dt-step-label">STEP 6</div>
            <p className="dt-q">{Q7_PROMPT[answers.step6] || "그렇게 판단한 이유는 무엇입니까?"}</p>
            <textarea className="dt-textarea" value={answers.step7} onChange={(e) => set("step7", e.target.value)} />
            {error && <p className="dt-hint" style={{ color: "#e08a8a" }}>{error}</p>}
            <button className="dt-next" disabled={!answers.step7.trim()} onClick={goToResult}>결과 보기</button>
          </>
        )}

        {step === "loading-result" && (
          <div className="dt-loading">
            사실을 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="dt-result-block">
              <div className="dt-result-label">기록된 사실</div>
              <div className="dt-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="dt-final-label">제안</div>
            <div className="dt-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="dt-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="dt-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
