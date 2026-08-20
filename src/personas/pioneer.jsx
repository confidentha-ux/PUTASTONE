import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.pn-root { --ground:#eae6da; --paper:#1c1a17; --ink:#1c1a17; --muted:#847c6b; --open:#a13d2e; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2eee0 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.pn-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.pn-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.pn-persona { text-align:center; margin-bottom:24px; }
.pn-persona h1 { font-family:Pretendard,sans-serif;  font-size:32px; margin:0; font-weight:500; }
.pn-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.pn-tagline { font-family:Pretendard,sans-serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.pn-persona-header { font-family:Pretendard,sans-serif; font-size:15px; line-height:1.6; color:#1c1a17; text-align:center; margin:0 0 20px; font-weight:600; }
.pn-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(28,26,23,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.pn-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.pn-q { font-family:Pretendard,sans-serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.pn-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.pn-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.pn-textarea::placeholder { color:rgba(49,53,45,.28); }
.pn-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.pn-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.pn-opt:hover { background:rgba(49,53,45,.07); }
.pn-opt.sel { background:rgba(28,26,23,.13); border-color:var(--open); color:#1c1a17; }
.pn-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.pn-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.pn-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.pn-actions-row { display:flex; align-items:center; gap:14px; }
.pn-actions-row .pn-next { flex:1; }
.pn-condition-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:20px;
  font-family:Pretendard,sans-serif; font-size:15.5px; line-height:1.75; margin-bottom:20px; box-shadow:0 10px 26px rgba(0,0,0,.3); }
.pn-condition-label { font-size:11px; color:#6b6a5c; font-family:Pretendard,sans-serif; margin-bottom:8px; letter-spacing:.04em; }
.pn-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.pn-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:pn-pulse 1.2s infinite ease-in-out; }
.pn-loading .dot:nth-child(2) { animation-delay:.2s; }
.pn-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes pn-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.pn-result-block { margin-bottom:16px; }
.pn-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.pn-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.pn-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.pn-final-text { font-size:14px; line-height:1.85; color:#1c1a17; }
.pn-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.pn-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;
/* 데모용 — 실제로는 Layer 1에서 가져옴 */
const SAMPLE_JUDGMENT = "나는 아직 그 자리에 어울리는 사람이 아니다.";
function buildQuestionPrompt(a) {
  return `당신은 사용자의 판단을 다시 보게 만드는 질문 하나를 만드는 역할입니다.
답을 주지 않습니다. 질문만 만듭니다.
절대 하면 안 되는 것:
- 사용자가 그대로 따라 말할 대사나 모범 답안을 쓰는 것
- 답이 한쪽으로 미리 정해진 유도 질문을 만드는 것
  (예: "~한 사람이 있을까요?", "처음엔 그렇지 않았을까요?" 같은,
  질문 안에 이미 결론이 들어있는 수사의문문)
좋은 질문은 사용자가 "예"라고 답할 수도, "아니오"라고 답할 수도 있어야 합니다.
질문을 만든 뒤 스스로 확인하세요: 이 질문에 대해 반대되는 두 답이 둘 다
자연스럽게 나올 수 있는가? 한쪽 답만 나올 수밖에 없다면 다시 만드세요.
사용자 정보:
- 원래 판단: "${a.judgment}"
- 장면 (실제 겪은 일이거나, 겪은 적 없다면 상상한 상황일 수 있음): "${a.step1}"
- 그 자리에 어울린다고 느낄 자격 기준: "${a.step2}"
- 그 기준 중 지금 이미 갖고 있다고 느끼는 것: "${a.step3}"
작업:
step2(전체 기준)와 step3(이미 가진 것)을 비교해서, step2에는 있지만 step3에는
언급되지 않은 부분을 찾으세요. 그 지점에 대해 사용자가 실제로 어떻게 생각하는지
열어서 묻는 질문을 하나 만드세요. 결론을 향해 몰아가지 말고, 사용자가 스스로
판단할 자리를 남기세요.
질문 하나만 출력하세요. 설명이나 해설을 붙이지 마세요.
출력은 JSON만: {"question": "여기에 질문 하나", "targetLine": "step2 또는 step3에서 어느 지점을 겨냥했는지 한 줄 요약"}`;
}
function buildResultPrompt(a) {
  return `당신은 사용자의 판단이 실제로 어떻게 됐는지 사실 그대로 정리하는 역할입니다.
"성장했습니다", "가까워졌습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 처음 판단: "${a.judgment}"
- 자격 기준: "${a.step2}"
- 그중 이미 갖고 있다고 느낀 것: "${a.step3}"
- 개척자가 던진 질문: "${a.question}"
- 질문에 대한 답: "${a.step5}"
- 기준을 보고도 처음 판단이 그대로인지: "${a.step6}"
- 그 이유: "${a.step6b}"
- 처음과 지금 사이 달라진 것 (사용자 응답): "${a.step7}"
작업:
1. step6(판단 유지 여부)을 근거로, 처음 판단이 그대로인지 달라졌는지 먼저 확정하세요.
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요.
3. 판단이 달라진 경우: 무엇이 달라졌는지 step6·step6b에 있는 내용 그대로 쓰세요. 지어내지 마세요.
4. 판단이 그대로인 경우: 기준을 보고도 유지됐다는 사실 그대로 쓰세요. 이건 실패가 아니라
   이 판단이 이 사람에게 얼마나 확고한지 확인된 결과입니다.
5. 제안은 행동 지시가 아니라, 이 판단이 다음에 비슷한 상황에서 어떻게 다시 나타날 수 있는지
   관찰 포인트 하나를 제시하는 정도로만 쓰세요.
   - 판단이 달라진 경우: 다음에 비슷한 자리 앞에서 이 기준이 다시 떠오르는지 지켜볼 것을 제안
   - 그대로인 경우: 이 판단이 이 자리에만 해당하는지, 다른 자리에서도 반복되는지 살펴볼 것을 제안
두 경우 모두 반드시 summary와 suggestion을 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "처음 판단 / 자격 기준 / 그중 이미 갖고 있다고 느낀 것 / 개척자가 던진 질문과 그 답 / 판단이 달라지거나 유지된 결과, 이 다섯 줄을 순서대로 담은 텍스트 (줄바꿈 \n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 제안 1~2문장"
}`;
}
export default function PioneerLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState({
    judgment: SAMPLE_JUDGMENT,
    hasScene: null,
    step1: "", step2: "", step3: "",
    question: "", targetLine: "",
    step5: "", step6: "", step6b: "", step7: "",
  });
  const [error, setError] = useState(null);
  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));
  async function goToQuestion() {
    setStep("loading-question");
    setError(null);
    try {
      const raw = await mockCallClaude(buildQuestionPrompt(answers));
      const parsed = JSON.parse(raw);
      set("question", parsed.question);
      set("targetLine", parsed.targetLine);
      setStep("s4");
    } catch (e) {
      console.error("goToQuestion failed:", e);
      setError("질문을 만드는 중 문제가 생겼습니다. 다시 시도해주세요.");
      setStep("s3");
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
    setAnswers({
      judgment: SAMPLE_JUDGMENT,
      hasScene: null,
      step1: "", step2: "", step3: "",
      question: "", targetLine: "",
      step5: "", step6: "", step6b: "", step7: "",
    });
    setStep("intro");
  }
  return (
    <div className="pn-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pn-shell">
        <div className="pn-eyebrow">돌 하나를 얹다</div>
        <div className="pn-persona">
          <h1>개척자</h1>
          <div className="en">The Pioneer</div>
        </div>
        {step === "intro" && (
          <>
            <p className="pn-tagline">그 자리에 필요한 것 중,<br />나는 이미 무엇을 가지고 있을까.</p>
            <p className="pn-persona-header">이 자리 앞에 내가 어떤 자격을 세워두었는지 봅시다.</p>
            <div className="pn-subject">"{answers.judgment}"</div>
            <p className="pn-hint">일곱 개의 질문을 지나갑니다.</p>
            <button className="pn-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}
        {step === "s0" && (
          <>
            <button className="pn-back" style={{ marginBottom: 16 }} onClick={() => setStep("intro")}>← 이전</button>
            <div className="pn-subject">"{answers.judgment}"</div>
            <p className="pn-q">이 생각이 들었던 구체적인 순간이 있었습니까?</p>
            <div className="pn-opts">
              <button className="pn-opt" onClick={() => { set("hasScene", true); setStep("s1"); }}>있다.</button>
              <button className="pn-opt" onClick={() => { set("hasScene", false); setStep("s1"); }}>특별히 떠오르는 순간은 없다.</button>
            </div>
          </>
        )}
        {step === "s1" && answers.hasScene === true && (
          <>
            <div className="pn-step-label">STEP 1</div>
            <div className="pn-subject">"{answers.judgment}"</div>
            <p className="pn-q">그 순간으로 돌아가 보겠습니다.</p>
            <p className="pn-hint">그때 어떤 자리, 어떤 역할 앞에서 이런 생각이 들었습니까? 어떤 상황이었는지 적어주세요.</p>
            <textarea className="pn-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} placeholder="예: 팀 리더 자리를 제안받았다." />
            <div className="pn-actions-row">
              <button className="pn-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="pn-next" disabled={!answers.step1.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}
        {step === "s1" && answers.hasScene === false && (
          <>
            <div className="pn-step-label">STEP 1</div>
            <div className="pn-subject">"{answers.judgment}"</div>
            <p className="pn-hint" style={{ marginBottom: 6 }}>이 문장을 고르셨습니다.</p>
            <p className="pn-q">아직 어울리지 않는다고 느끼는 이유는 무엇 때문입니까?</p>
            <p className="pn-hint">떠오르는 게 없다면, 왜 그렇게 생각하게 됐는지 짐작해서 적어주세요.</p>
            <textarea className="pn-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} placeholder="예: 주변에서 하는 걸 보면 나랑은 좀 다른 것 같다는 느낌이 든다." />
            <div className="pn-actions-row">
              <button className="pn-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="pn-next" disabled={!answers.step1.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}
        {step === "s2" && (
          <>
            <div className="pn-step-label">STEP 2</div>
            <div className="pn-subject">"{answers.judgment}"</div>
            <p className="pn-q">그 자리, 어떤 자격이면 어울린다고 느끼겠습니까?</p>
            <p className="pn-hint">확신이 없어도 괜찮습니다. 막연하게라도 떠오르는 대로 적어주세요.</p>
            <textarea className="pn-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <div className="pn-actions-row">
              <button className="pn-back" onClick={() => setStep("s1")}>← 이전</button>
              <button className="pn-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}
        {step === "s3" && (
          <>
            <div className="pn-step-label">STEP 3</div>
            <div className="pn-subject">"{answers.judgment}"</div>
            <p className="pn-q">방금 말한 그 자격 중, 지금 당신에게 이미 있는 건 무엇입니까?</p>
            <p className="pn-hint">전부가 아니어도 됩니다. 하나라도 있다면 그것부터 적어주세요.</p>
            <textarea className="pn-textarea" value={answers.step3} onChange={(e) => set("step3", e.target.value)} />
            {error && <p className="pn-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="pn-actions-row">
              <button className="pn-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="pn-next" disabled={!answers.step3.trim()} onClick={goToQuestion}>다음</button>
            </div>
          </>
        )}
        {step === "loading-question" && (
          <div className="pn-loading">
            개척자가 질문을 고르고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}
        {step === "s4" && (
          <>
            <div className="pn-condition-card">
              <div className="pn-condition-label">개척자가 묻습니다 —</div>
              {answers.question}
            </div>
            <div className="pn-step-label">STEP 4</div>
            <p className="pn-q">이 질문에 답한다면, 뭐라고 하시겠습니까?</p>
            <textarea className="pn-textarea" value={answers.step5} onChange={(e) => set("step5", e.target.value)} placeholder="지금 드는 생각을 그대로 적어주세요." />
            <button className="pn-next" disabled={!answers.step5.trim()} onClick={() => setStep("s5")}>다음</button>
          </>
        )}
        {step === "s5" && (
          <>
            <div className="pn-step-label">STEP 5</div>
            <div className="pn-subject">"{answers.judgment}"</div>
            <p className="pn-q">이 질문에 답하고도, 처음 판단이 그대로입니까?</p>
            <p className="pn-hint">"나는 아직 그 자리에 어울리는 사람이 아니다" — 지금도 그렇게 느껴지는지 적어주세요.</p>
            <textarea className="pn-textarea" value={answers.step6} onChange={(e) => set("step6", e.target.value)} />
            <div className="pn-actions-row">
              <button className="pn-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="pn-next" disabled={!answers.step6.trim()} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}
        {step === "s6" && (
          <>
            <div className="pn-step-label">STEP 6</div>
            <div className="pn-subject">"{answers.judgment}"</div>
            <p className="pn-q">그 판단이 그대로인 이유, 혹은 달라진 이유는 무엇입니까?</p>
            <p className="pn-hint">판단이 달라졌다면 무엇이 달라지게 했는지, 그대로라면 무엇이 남아 있는지 적어주세요.</p>
            <textarea className="pn-textarea" value={answers.step6b} onChange={(e) => set("step6b", e.target.value)} />
            <div className="pn-actions-row">
              <button className="pn-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="pn-next" disabled={!answers.step6b.trim()} onClick={() => setStep("s7")}>다음</button>
            </div>
          </>
        )}
        {step === "s7" && (
          <>
            <div className="pn-step-label">STEP 7</div>
            <div className="pn-subject">"{answers.judgment}"</div>
            <p className="pn-q">오늘 이 과정을 돌아보면, 무엇이 새롭게 보입니까?</p>
            <textarea className="pn-textarea" value={answers.step7} onChange={(e) => set("step7", e.target.value)} />
            {error && <p className="pn-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="pn-actions-row">
              <button className="pn-back" onClick={() => setStep("s6")}>← 이전</button>
              <button className="pn-next" disabled={!answers.step7.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}
        {step === "loading-result" && (
          <div className="pn-loading">
            거리를 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}
        {step === "result" && (
          <>
            <div className="pn-result-block">
              <div className="pn-result-label">기록된 사실</div>
              <div className="pn-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="pn-final-label">제안</div>
            <div className="pn-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="pn-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="pn-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
