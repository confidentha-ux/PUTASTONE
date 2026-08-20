import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.tt-root { --ground:#e4e2db; --paper:#31352d; --ink:#31352d; --muted:#5f6354; --open:#5c7a5e; --line:rgba(49,53,45,.14);
  min-height:100%; background:radial-gradient(120% 90% at 50% 0%,#f2f0ea 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.tt-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.tt-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.tt-persona { text-align:center; margin-bottom:24px; }
.tt-persona h1 { font-family:'Source Serif 4',serif;  font-size:32px; margin:0; font-weight:500; }
.tt-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.tt-tagline { font-family:'Gowun Batang',serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.tt-persona-header { font-family:'Gowun Batang',serif; font-size:15px; line-height:1.6; color:#2f4530; text-align:center; margin:0 0 20px; font-weight:600; }
.tt-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(92,122,94,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.tt-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.tt-q { font-family:'Gowun Batang',serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.tt-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.tt-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.tt-textarea::placeholder { color:rgba(49,53,45,.28); }
.tt-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.tt-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.tt-opt:hover { background:rgba(49,53,45,.07); }
.tt-opt.sel { background:rgba(92,122,94,.13); border-color:var(--open); color:#2f4530; }
.tt-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.tt-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.tt-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.tt-actions-row { display:flex; align-items:center; gap:14px; }
.tt-actions-row .tt-next { flex:1; }
.tt-condition-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:20px;
  font-family:'Gowun Batang',serif; font-size:15.5px; line-height:1.75; margin-bottom:20px; box-shadow:0 10px 26px rgba(0,0,0,.3); }
.tt-condition-label { font-size:11px; color:#6b6a5c; font-family:Pretendard,sans-serif; margin-bottom:8px; letter-spacing:.04em; }
.tt-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.tt-summary-row { margin-bottom:12px; }
.tt-summary-row:last-child { margin-bottom:0; }
.tt-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.tt-summary-value { font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.6; }
.tt-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.tt-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:tt-pulse 1.2s infinite ease-in-out; }
.tt-loading .dot:nth-child(2) { animation-delay:.2s; }
.tt-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes tt-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.tt-result-block { margin-bottom:16px; }
.tt-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.tt-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.tt-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.tt-final-text { font-size:14px; line-height:1.85; color:#31352d; }
.tt-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.tt-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;
const SAMPLE_JUDGMENT = "지금 이 방향이 맞는 것 같다.";

const Q4_OPTS = [
  "지금보다 더 중요하게 보일 것 같다.",
  "지금과 비슷하게 중요할 것 같다.",
  "지금보다 덜 중요하게 보일 것 같다.",
  "거의 중요하지 않게 보일 것 같다.",
  "잘 모르겠다.",
];
const Q5_OPTS = ["있다.", "잘 모르겠다.", "딱히 없다."];
const Q6_OPTS = [
  "처음과 같은 판단이다.",
  "판단의 방향은 같지만 중요하게 보는 것이 달라졌다.",
  "처음과는 다르게 판단하게 된다.",
  "아직 판단하기 어렵다.",
];
const Q7_PROMPT = {
  "처음과 같은 판단이다.": "3년의 거리를 두고 보아도 같은 판단을 하는 이유는 무엇입니까?",
  "판단의 방향은 같지만 중요하게 보는 것이 달라졌다.": "무엇의 비중이 달라져 보였습니까?",
  "처음과는 다르게 판단하게 된다.": "무엇이 다르게 보이면서 판단도 달라졌습니까?",
  "아직 판단하기 어렵다.": "3년의 거리를 두고 보아도 여전히 판단하기 어렵게 만드는 것은 무엇입니까?",
};

function buildResultPrompt(a) {
  const growing = a.step4 === "있다." ? a.step4b : a.step4;
  return `당신은 시간을 두고 돌아본 판단이 실제로 어떻게 됐는지 사실 그대로
정리하는 역할입니다.
"성장했습니다", "현명해졌습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 처음 판단: "${a.judgment}"
- 지금 가장 크게 신경 쓰이는 것: "${a.step2}"
- 3년 뒤에서 본 그 요소의 비중: "${a.step3}"
- 시간이 지나면 더 중요해질 수 있는 것: "${growing}"
- 재판단: "${a.step6}"
- 그 이유: "${a.step7}"
작업:
1. step6(재판단)이 다음 네 가지 중 무엇인지 먼저 확정하세요: "처음과 같은 판단이다" / "판단의 방향은 같지만 중요하게 보는 것이 달라졌다" / "처음과는 다르게 판단하게 된다" / "아직 판단하기 어렵다".
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을 지어내지 마세요.
3. "처음과 같은 판단"인 경우: 3년의 거리를 두고 봐도 같은 결론에 도달했다는 사실 그대로 쓰세요. 이건 실패가 아니라 확인된 결과입니다.
4. "중요하게 보는 것이 달라졌다"인 경우: 결론은 같지만 무엇의 비중이 달라졌는지 step7 내용 그대로 쓰세요.
5. "다르게 판단하게 된다"인 경우: 무엇이 다르게 보이면서 판단이 달라졌는지 step7 내용 그대로 쓰세요.
6. "아직 판단하기 어렵다"인 경우: 무엇이 여전히 판단을 어렵게 만드는지 step7 내용 그대로 쓰세요. 이것도 실패가 아니라 지금 시점의 정직한 결과입니다.
7. 제안은 행동 지시가 아니라, 다음에 비슷한 판단을 마주칠 때 지금 크게 보이는 것과 나중에 커질 수 있는 것 중 무엇을 먼저 확인해볼지 관찰 포인트 하나만 제시하세요.
두 경우 모두 반드시 summary와 suggestion을 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "처음 판단 / 지금 크게 보이는 것 / 3년 뒤에서 본 비중 / 시간이 지나면 커질 수 있는 것 / 재판단과 그 이유, 이 다섯 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 제안 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  judgment: SAMPLE_JUDGMENT,
  hasScene: null,
  step1: "",
  step2: "",
  step3: "",
  step4: "", step4b: "",
  step6: "",
  step7: "",
};

export default function TimeTravelerLens({ onComplete } = {}) {
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
      setStep("s6");
    }
  }
  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setStep("intro");
  }

  const q5Ready = answers.step4 && (answers.step4 !== "있다." || answers.step4b.trim());

  return (
    <div className="tt-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="tt-shell">
        <div className="tt-eyebrow">돌 하나를 얹다</div>
        <div className="tt-persona">
          <h1>시간여행자</h1>
          <div className="en">The Time Traveler</div>
        </div>

        {step === "intro" && (
          <>
            <p className="tt-tagline">몇 년 뒤에 돌아보면,<br />지금 이 일은 얼마나 중요할까.</p>
            <p className="tt-persona-header">이 판단을 조금 먼 시간으로 옮겨봅시다.</p>
            <div className="tt-subject">"{answers.judgment}"</div>
            <p className="tt-hint">일곱 개의 질문을 지나갑니다.</p>
            <button className="tt-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <button className="tt-back" style={{ marginBottom: 16 }} onClick={() => setStep("intro")}>← 이전</button>
            <div className="tt-subject">"{answers.judgment}"</div>
            <p className="tt-q">이 생각이 들었던 구체적인 순간이 있었습니까?</p>
            <div className="tt-opts">
              <button className="tt-opt" onClick={() => { set("hasScene", true); setStep("s1"); }}>있다.</button>
              <button className="tt-opt" onClick={() => { set("hasScene", false); setStep("s1"); }}>특별히 떠오르는 순간은 없다.</button>
            </div>
          </>
        )}

        {step === "s1" && answers.hasScene === true && (
          <>
            <div className="tt-step-label">STEP 1</div>
            <div className="tt-subject">"{answers.judgment}"</div>
            <p className="tt-q">그 순간으로 돌아가 보겠습니다. 그때 어떤 상황이었습니까?</p>
            <textarea className="tt-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} placeholder="예: 지금 하는 방식을 계속 밀고 나갈지 고민하던 순간이었다." />
            <div className="tt-actions-row">
              <button className="tt-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="tt-next" disabled={!answers.step1.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}
        {step === "s1" && answers.hasScene === false && (
          <>
            <div className="tt-step-label">STEP 1</div>
            <div className="tt-subject">"{answers.judgment}"</div>
            <p className="tt-hint" style={{ marginBottom: 6 }}>이 문장을 고르셨습니다.</p>
            <p className="tt-q">무엇을 보고 이 문장이 나와 가깝다고 느끼셨습니까?</p>
            <p className="tt-hint">떠오르는 게 없다면, 앞으로 그런 순간이 온다면 어떨지 상상해서 적어도 됩니다.</p>
            <textarea className="tt-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} placeholder="예: 지금 방식에 큰 의심 없이 계속해왔던 것 같아서." />
            <div className="tt-actions-row">
              <button className="tt-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="tt-next" disabled={!answers.step1.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <div className="tt-step-label">STEP 2</div>
            <div className="tt-subject">"{answers.judgment}"</div>
            <p className="tt-q">지금 이 판단에서 가장 크게 신경 쓰이는 것은 무엇입니까?</p>
            <textarea className="tt-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <div className="tt-actions-row">
              <button className="tt-back" onClick={() => setStep("s1")}>← 이전</button>
              <button className="tt-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="tt-step-label">STEP 3</div>
            <div className="tt-subject">"{answers.judgment}"</div>
            <p className="tt-q">3년 뒤의 당신이 지금을 돌아본다면, "{answers.step2}"은 지금과 비교해 어느 정도 중요하게 보일 것 같습니까?</p>
            <div className="tt-opts">
              {Q4_OPTS.map((o) => (
                <button key={o} className={`tt-opt ${answers.step3 === o ? "sel" : ""}`} onClick={() => set("step3", o)}>{o}</button>
              ))}
            </div>
            <div className="tt-actions-row">
              <button className="tt-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="tt-next" disabled={!answers.step3} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="tt-step-label">STEP 4</div>
            <div className="tt-subject">"{answers.judgment}"</div>
            <p className="tt-q">반대로, 지금은 상대적으로 덜 보고 있지만 3년 뒤에는 더 중요하게 보일 것이 있습니까?</p>
            <div className="tt-opts">
              {Q5_OPTS.map((o) => (
                <button key={o} className={`tt-opt ${answers.step4 === o ? "sel" : ""}`} onClick={() => set("step4", o)}>{o}</button>
              ))}
            </div>
            {answers.step4 === "있다." && (
              <>
                <p className="tt-q" style={{ fontSize: 15 }}>무엇입니까?</p>
                <textarea className="tt-textarea" value={answers.step4b} onChange={(e) => set("step4b", e.target.value)} />
              </>
            )}
            {error && <p className="tt-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="tt-actions-row">
              <button className="tt-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="tt-next" disabled={!q5Ready} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="tt-step-label">시간 병치</div>
            <div className="tt-subject">"{answers.judgment}"</div>
            <div className="tt-summary-card">
              <div className="tt-summary-row">
                <div className="tt-summary-label">지금 크게 보이는 것</div>
                <div className="tt-summary-value">{answers.step2}</div>
              </div>
              <div className="tt-summary-row">
                <div className="tt-summary-label">3년 뒤에서 본 중요도</div>
                <div className="tt-summary-value">{answers.step3}</div>
              </div>
              <div className="tt-summary-row">
                <div className="tt-summary-label">시간이 지나면 더 중요해질 수 있는 것</div>
                <div className="tt-summary-value">{answers.step4 === "있다." ? answers.step4b : answers.step4}</div>
              </div>
            </div>
            <p className="tt-q">3년의 거리를 두고 이것들을 함께 보니, 처음 판단은 지금 어떻게 보입니까?</p>
            <div className="tt-opts">
              {Q6_OPTS.map((o) => (
                <button key={o} className={`tt-opt ${answers.step6 === o ? "sel" : ""}`} onClick={() => set("step6", o)}>{o}</button>
              ))}
            </div>
            <div className="tt-actions-row">
              <button className="tt-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="tt-next" disabled={!answers.step6} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="tt-step-label">STEP 5</div>
            <div className="tt-subject">"{answers.judgment}"</div>
            <p className="tt-q">{Q7_PROMPT[answers.step6] || "그렇게 판단한 이유는 무엇입니까?"}</p>
            <textarea className="tt-textarea" value={answers.step7} onChange={(e) => set("step7", e.target.value)} />
            {error && <p className="tt-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="tt-actions-row">
              <button className="tt-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="tt-next" disabled={!answers.step7.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="tt-loading">
            시간을 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="tt-result-block">
              <div className="tt-result-label">기록된 사실</div>
              <div className="tt-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="tt-final-label">제안</div>
            <div className="tt-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="tt-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="tt-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
