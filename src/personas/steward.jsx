import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.st-root { --ground:#eae6da; --paper:#1c1a17; --ink:#1c1a17; --muted:#847c6b; --open:#a13d2e; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2eee0 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.st-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.st-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.st-persona { text-align:center; margin-bottom:24px; }
.st-persona h1 { font-family:Pretendard,sans-serif;  font-size:32px; margin:0; font-weight:500; }
.st-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.st-tagline { font-family:Pretendard,sans-serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.st-persona-header { font-family:Pretendard,sans-serif; font-size:15px; line-height:1.6; color:#1c1a17; text-align:center; margin:0 0 20px; font-weight:600; }
.st-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(28,26,23,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.st-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.st-q { font-family:Pretendard,sans-serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.st-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.st-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.st-textarea::placeholder { color:rgba(49,53,45,.28); }
.st-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.st-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.st-opt:hover { background:rgba(49,53,45,.07); }
.st-opt.sel { background:rgba(28,26,23,.13); border-color:var(--open); color:#1c1a17; }
.st-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.st-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.st-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.st-actions-row { display:flex; align-items:center; gap:14px; }
.st-actions-row .st-next { flex:1; }
.st-item-input-row { display:flex; gap:8px; margin-bottom:14px; }
.st-item-input { flex:1; background:rgba(49,53,45,.04); border:1px solid var(--line); border-radius:2px; color:var(--paper);
  font-family:inherit; font-size:14px; padding:12px 13px; box-sizing:border-box; }
.st-item-input::placeholder { color:rgba(49,53,45,.28); }
.st-item-add { padding:0 18px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14px; cursor:pointer; font-family:inherit; }
.st-item-list { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
.st-item-row { display:flex; align-items:center; justify-content:space-between; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; padding:10px 13px; font-size:14px; }
.st-item-remove { background:none; border:none; color:var(--muted); cursor:pointer; font-size:16px; line-height:1; padding:0 4px; }
.st-progress { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.st-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.st-summary-row { margin-bottom:12px; }
.st-summary-row:last-child { margin-bottom:0; }
.st-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.st-summary-value { font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.6; }
.st-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.st-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:st-pulse 1.2s infinite ease-in-out; }
.st-loading .dot:nth-child(2) { animation-delay:.2s; }
.st-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes st-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.st-result-block { margin-bottom:16px; }
.st-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.st-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.st-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.st-final-text { font-size:14px; line-height:1.85; color:#1c1a17; }
.st-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.st-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const Q1_OPTS = ["있다.", "비슷한 일이 떠오른다.", "없다."];
const SHARE_OPTS = ["내가 맡을 일", "상대가 맡을 일", "함께 맡을 일", "잘 모르겠다"];
const Q8_OPTS = [
  "처음과 같은 판단이다.",
  "내가 맡을 범위가 달라졌다.",
  "함께 맡아야 할 부분이 새롭게 보인다.",
  "다른 사람에게 맡길 부분이 새롭게 보인다.",
  "아직 잘 모르겠다.",
];
function q9Prompt(a) {
  switch (a.step8) {
    case "처음과 같은 판단이다.":
      return "일을 나누어 본 뒤에도 처음과 같은 범위를 맡는 것이 맞다고 생각하는 이유는 무엇입니까?";
    case "내가 맡을 범위가 달라졌다.":
      return "어떤 일을 나누어 보면서 당신이 맡을 범위가 달라졌습니까?";
    case "함께 맡아야 할 부분이 새롭게 보인다.":
      return "어떤 일을 함께 맡는 것이 맞다고 보게 되었습니까?";
    case "다른 사람에게 맡길 부분이 새롭게 보인다.":
      return "어떤 일이 누구의 몫으로 새롭게 보였습니까?";
    case "아직 잘 모르겠다.":
      return "일을 나누어 보아도 아직 몫을 정하기 어려운 이유는 무엇입니까?";
    default:
      return "그렇게 정한 이유는 무엇입니까?";
  }
}
function groupItems(a) {
  const groups = { mine: [], other: [], together: [], unclear: [] };
  a.step4Items.forEach((it) => {
    const c = a.step5Map[it];
    if (c === "내가 맡을 일") groups.mine.push(it);
    else if (c === "상대가 맡을 일") groups.other.push(it);
    else if (c === "함께 맡을 일") groups.together.push(it);
    else groups.unclear.push(it);
  });
  return groups;
}
function joinOrNone(list) {
  return list.length ? list.join(", ") : "없음";
}

function buildResultPrompt(a) {
  const g = groupItems(a);
  return `당신은 사용자가 "결국 내가 해야 한다"로 뭉쳐 있던 일이 실제 일들로 나뉜 뒤
누가 무엇을 맡게 됐는지 사실 그대로 정리하는 역할입니다.
"성장했습니다", "현명하게 나누었습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 실제 있었던 일: "${a.step2}"
- 처음 "내가 해야 한다"고 생각했던 범위: "${a.step3}"
- 실제로 필요한 일 전체: "${a.step4Items.join(", ")}"
- 내가 맡을 일로 분류된 것: "${joinOrNone(g.mine)}"
- 상대가 맡을 일로 분류된 것: "${joinOrNone(g.other)}"
- 함께 맡을 일로 분류된 것: "${joinOrNone(g.together)}"
- 아직 정하기 어려운 일: "${joinOrNone(g.unclear)}"
- 나누어 본 뒤 내가 실제로 맡을 부분 (사용자 서술): "${a.step6}"
- 내 범위를 넘어서는 몫 (사용자 서술): "${a.step7}"
- 처음 판단에 대한 재검토: "${a.step8}"
- 그 이유: "${a.step9}"
작업:
1. 처음 "내가 해야 한다"고 뭉쳐 있던 범위(step3)와, 실제로 필요한 일들로 나눈 뒤
   내가 맡을 부분(step6)을 나란히 비교할 수 있게 쓰세요.
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
3. "처음과 같은 판단"으로 확인된 경우도 실패가 아니라, 일을 실제로 나누어 본 뒤에도
   같은 범위가 맞다고 확인된 결과입니다. 그대로 쓰세요.
4. 제안은 행동 지시가 아니라, 다음에 비슷한 공동 과업을 마주칠 때 살펴볼 관찰
   포인트 하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "실제 있었던 일 / 처음 내가 해야 한다고 본 범위 / 필요한 일을 나눈 배분 결과 / 내가 실제로 맡을 부분과 범위 밖의 몫 / 처음 판단에 대한 재검토와 이유, 이 다섯 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  hasScene: "",
  step2: "",
  step3: "",
  step4Items: [],
  step5Map: {},
  step5Idx: 0,
  step6: "",
  step7: "",
  step8: "",
  step9: "",
};

export default function StewardLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [itemDraft, setItemDraft] = useState("");
  const [error, setError] = useState(null);
  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));

  function addItem() {
    const v = itemDraft.trim();
    if (!v) return;
    setAnswers((p) => ({ ...p, step4Items: [...p.step4Items, v] }));
    setItemDraft("");
  }
  function removeItem(idx) {
    setAnswers((p) => ({ ...p, step4Items: p.step4Items.filter((_, i) => i !== idx) }));
  }
  function assignItem(item, choice) {
    setAnswers((p) => {
      const nextMap = { ...p.step5Map, [item]: choice };
      const nextIdx = p.step5Idx + 1;
      return { ...p, step5Map: nextMap, step5Idx: nextIdx };
    });
    if (answers.step5Idx + 1 >= answers.step4Items.length) {
      setStep("s6");
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
      setStep("s9");
    }
  }
  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setItemDraft("");
    setStep("intro");
  }

  const g = groupItems(answers);
  const currentItem = answers.step4Items[answers.step5Idx];

  return (
    <div className="st-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="st-shell">
        <div className="st-eyebrow">돌 하나를 얹다</div>
        <div className="st-persona">
          <h1>더치페이</h1>
          <div className="en">The Steward</div>
        </div>

        {step === "intro" && (
          <>
            <p className="st-tagline">이 일에서 내 몫은 어디까지이고,<br />나머지는 누구의 몫일까.</p>
            <p className="st-persona-header">이 일의 몫을 하나씩 나눠봅시다.</p>
            <p className="st-hint">아홉 개의 질문을 지나갑니다.</p>
            <button className="st-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="st-q">최근 여러 사람이 함께해야 하는 일에서, "결국 내가 해야 한다"고 생각하며 맡고 있던 일이 있었습니까?</p>
            <div className="st-opts">
              {Q1_OPTS.map((o) => (
                <button key={o} className={`st-opt ${answers.hasScene === o ? "sel" : ""}`} onClick={() => { set("hasScene", o); setStep("s2"); }}>{o}</button>
              ))}
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <button className="st-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="st-step-label">STEP 2</div>
            <p className="st-q">무슨 일이 있었습니까?</p>
            {answers.hasScene === "없다." && (
              <p className="st-hint">떠오르는 사례가 없다면, 앞으로 그런 상황이 온다면 어떨지 상상해서 적어주세요.</p>
            )}
            <textarea className="st-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} placeholder="예: 가족 행사를 준비하면서 내가 대부분의 일을 챙기고 있었다." />
            <div className="st-actions-row">
              <button className="st-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="st-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="st-step-label">STEP 3</div>
            <div className="st-subject">"{answers.step2}"</div>
            <p className="st-q">그때 "내가 해야 한다"고 생각한 것은 무엇이었습니까?</p>
            <textarea className="st-textarea" value={answers.step3} onChange={(e) => set("step3", e.target.value)} placeholder="예: 장소를 정하고, 사람들에게 연락하고, 음식도 준비하고, 당일 진행까지 내가 해야 한다고 생각했다." />
            <div className="st-actions-row">
              <button className="st-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="st-next" disabled={!answers.step3.trim()} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="st-step-label">STEP 4</div>
            <div className="st-subject">"{answers.step2}"</div>
            <p className="st-q">이 일이 이루어지려면 실제로 어떤 일들이 필요합니까?</p>
            <p className="st-hint">한 가지씩 적어서 추가해주세요. 두 가지 이상 적어주세요.</p>
            <div className="st-item-input-row">
              <input
                className="st-item-input"
                value={itemDraft}
                onChange={(e) => setItemDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
                placeholder="예: 장소 정하기"
              />
              <button className="st-item-add" onClick={addItem}>추가</button>
            </div>
            {answers.step4Items.length > 0 && (
              <div className="st-item-list">
                {answers.step4Items.map((it, idx) => (
                  <div className="st-item-row" key={idx}>
                    <span>{it}</span>
                    <button className="st-item-remove" onClick={() => removeItem(idx)}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="st-actions-row">
              <button className="st-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="st-next" disabled={answers.step4Items.length < 2} onClick={() => { set("step5Idx", 0); setStep("s5"); }}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && currentItem && (
          <>
            <div className="st-progress">몫 정하기 · {answers.step5Idx + 1} / {answers.step4Items.length}</div>
            <div className="st-subject">"{currentItem}"</div>
            <p className="st-q">이 일은 누가 맡는 것이 맞다고 생각합니까?</p>
            <div className="st-opts">
              {SHARE_OPTS.map((o) => (
                <button key={o} className="st-opt" onClick={() => assignItem(currentItem, o)}>{o}</button>
              ))}
            </div>
            <button className="st-back" onClick={() => {
              if (answers.step5Idx === 0) { setStep("s4"); }
              else { set("step5Idx", answers.step5Idx - 1); }
            }}>← 이전</button>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="st-step-label">몫 화면</div>
            <div className="st-summary-card">
              <div className="st-summary-row">
                <div className="st-summary-label">내가 맡을 일</div>
                <div className="st-summary-value">{joinOrNone(g.mine)}</div>
              </div>
              <div className="st-summary-row">
                <div className="st-summary-label">상대가 맡을 일</div>
                <div className="st-summary-value">{joinOrNone(g.other)}</div>
              </div>
              <div className="st-summary-row">
                <div className="st-summary-label">함께 맡을 일</div>
                <div className="st-summary-value">{joinOrNone(g.together)}</div>
              </div>
              <div className="st-summary-row">
                <div className="st-summary-label">아직 정하기 어려운 일</div>
                <div className="st-summary-value">{joinOrNone(g.unclear)}</div>
              </div>
            </div>
            <p className="st-q">이렇게 나누어 놓고 보니, 이 일에서 당신이 실제로 맡을 부분은 무엇입니까?</p>
            <textarea className="st-textarea" value={answers.step6} onChange={(e) => set("step6", e.target.value)} placeholder="예: 장소 예약과 비용 정리는 내가 맡고, 연락은 동생이 맡고, 음식 준비는 같이 하면 될 것 같다." />
            <div className="st-actions-row">
              <button className="st-back" onClick={() => { set("step5Idx", answers.step4Items.length - 1); setStep("s5"); }}>← 이전</button>
              <button className="st-next" disabled={!answers.step6.trim()} onClick={() => setStep("s7")}>다음</button>
            </div>
          </>
        )}

        {step === "s7" && (
          <>
            <div className="st-step-label">STEP 7</div>
            <div className="st-subject">"{answers.step2}"</div>
            <p className="st-q">당신이 맡을 범위를 넘어서는 일은 누구의 몫입니까?</p>
            <textarea className="st-textarea" value={answers.step7} onChange={(e) => set("step7", e.target.value)} placeholder="예: 참석자 연락은 동생의 몫이다." />
            {error && <p className="st-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="st-actions-row">
              <button className="st-back" onClick={() => setStep("s6")}>← 이전</button>
              <button className="st-next" disabled={!answers.step7.trim()} onClick={() => setStep("s8")}>다음</button>
            </div>
          </>
        )}

        {step === "s8" && (
          <>
            <div className="st-step-label">다시 보기</div>
            <div className="st-summary-card">
              <div className="st-summary-row">
                <div className="st-summary-label">처음 내가 해야 한다고 생각했던 것</div>
                <div className="st-summary-value">{answers.step3}</div>
              </div>
              <div className="st-summary-row">
                <div className="st-summary-label">일을 나누어 본 뒤 내가 맡을 부분</div>
                <div className="st-summary-value">{answers.step6}</div>
              </div>
              <div className="st-summary-row">
                <div className="st-summary-label">내 범위를 넘어서는 몫</div>
                <div className="st-summary-value">{answers.step7}</div>
              </div>
            </div>
            <p className="st-q">처음에는 "{answers.step3}"라고 생각했습니다. 지금도 같은 판단입니까?</p>
            <div className="st-opts">
              {Q8_OPTS.map((o) => (
                <button key={o} className={`st-opt ${answers.step8 === o ? "sel" : ""}`} onClick={() => set("step8", o)}>{o}</button>
              ))}
            </div>
            <div className="st-actions-row">
              <button className="st-back" onClick={() => setStep("s7")}>← 이전</button>
              <button className="st-next" disabled={!answers.step8} onClick={() => setStep("s9")}>다음</button>
            </div>
          </>
        )}

        {step === "s9" && (
          <>
            <div className="st-step-label">STEP 9</div>
            <div className="st-subject">"{answers.step3}"</div>
            <p className="st-q">{q9Prompt(answers)}</p>
            <textarea className="st-textarea" value={answers.step9} onChange={(e) => set("step9", e.target.value)} />
            {error && <p className="st-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="st-actions-row">
              <button className="st-back" onClick={() => setStep("s8")}>← 이전</button>
              <button className="st-next" disabled={!answers.step9.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="st-loading">
            더치페이가 몫을 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="st-result-block">
              <div className="st-result-label">기록된 사실</div>
              <div className="st-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="st-final-label">제안</div>
            <div className="st-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="st-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="st-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
