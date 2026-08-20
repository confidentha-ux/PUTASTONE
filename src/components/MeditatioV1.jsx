import React, { useMemo, useState } from "react";
import { MEDITATIO_SECTIONS } from "../data/meditatioV1";
import { deriveMeditatioResult, DOMAIN_COPY } from "../state/deriveMeditatio";
import { useUserState } from "../state/UserStateContext";

// Section을 "그룹" 단위로 평탄화한다.
// Section 2(카드 5개)는 카드 하나가 그룹, Section 1/3/4는 Section 전체가 그룹 하나.
function buildGroups() {
  const groups = [];
  for (const section of MEDITATIO_SECTIONS) {
    if (section.cards) {
      for (const card of section.cards) {
        groups.push({
          id: card.id,
          title: card.title,
          sectionId: section.id,
          sectionTitle: section.title,
          questions: card.questions,
        });
      }
    } else {
      groups.push({
        id: section.id,
        title: section.title,
        sectionId: section.id,
        sectionTitle: section.title,
        questions: section.questions,
      });
    }
  }
  return groups;
}

const GROUPS = buildGroups();
const TOTAL_QUESTIONS = GROUPS.reduce((sum, g) => sum + g.questions.length, 0);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');

.mv-root {
  --ground: #e4e2db; --paper: #31352d; --ink: #31352d; --muted: #5f6354;
  --open: #5c7a5e; --line: rgba(49,53,45,0.14);
  flex: 1; min-height: 0;
  background: radial-gradient(120% 90% at 50% 0%, #f2f0ea 0%, var(--ground) 62%);
  color: var(--paper); font-family: Pretendard, -apple-system, sans-serif;
  display: flex; flex-direction: column; align-items: center; padding: 28px 20px 44px; box-sizing: border-box;
}
.mv-shell { width: 100%; max-width: 440px; display: flex; flex-direction: column; flex: 1; }
.mv-eyebrow { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); text-align: center; margin-bottom: 18px; }

.mv-intro { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 24px; text-align: center; }
.mv-intro h1 { font-family: 'Source Serif 4', serif;  font-weight: 500; font-size: 42px; line-height: 1.3; margin: 0; letter-spacing: 0.02em; }
.mv-intro .sub { font-size: 13px; color: var(--muted); margin-top: 8px; }
.mv-intro p { color: var(--muted); font-size: 14px; line-height: 1.85; margin: 0; }

.mv-open-h1 { font-family: 'Gowun Batang', serif; font-weight: 400; font-size: 24px; line-height: 1.4; margin: 0 0 14px; }
.mv-open-desc { color: var(--muted); font-size: 14px; line-height: 1.85; margin: 0; }

.mv-back { background: none; border: none; color: var(--muted); font-size: 12px; cursor: pointer; margin-bottom: 16px; padding: 0; text-align: left; }
.mv-section-h { font-family: 'Gowun Batang', serif; font-size: 18px; margin: 0 0 4px; font-weight: 400; }
.mv-section-tag { font-size: 11px; color: var(--open); letter-spacing: 0.1em; margin-bottom: 20px; display: block; }

.mv-cardlist { display: flex; flex-direction: column; gap: 8px; }
.mv-cardrow {
  display: flex; justify-content: space-between; align-items: center; padding: 15px 16px;
  border: 1px solid var(--line); border-radius: 3px; background: rgba(49,53,45,0.035); cursor: pointer;
}
.mv-cardrow:hover { background: rgba(49,53,45,0.07); }
.mv-cardrow.done { opacity: 0.5; }
.mv-cardrow .n { font-size: 11px; color: var(--muted); margin-right: 10px; }
.mv-cardrow .chk { color: var(--open); font-size: 12px; }

.mv-progress-wrap { margin-bottom: 22px; }
.mv-progress-bar { height: 3px; background: var(--line); border-radius: 2px; overflow: hidden; }
.mv-progress-fill { height: 100%; background: var(--open); transition: width 300ms; }
.mv-progress-label { font-size: 11px; color: var(--muted); margin-top: 8px; text-align: center; }

.mv-q { font-family: 'Gowun Batang', serif; font-size: 18px; line-height: 1.65; margin: 0 0 18px; font-weight: 400; }
.mv-opts { display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px; }
.mv-opt {
  text-align: left; padding: 14px 16px; border-radius: 2px; cursor: pointer;
  background: rgba(49,53,45,0.035); border: 1px solid var(--line);
  color: var(--paper); font-size: 14px; line-height: 1.6; font-family: inherit;
}
.mv-opt:hover { background: rgba(49,53,45,0.07); }
.mv-opt.sel { background: rgba(92,122,94,0.13); border-color: var(--open); color: #2f4530; }
.mv-hint { font-size: 12px; color: var(--muted); margin: -12px 0 18px; }

.mv-next { width: 100%; padding: 15px; border-radius: 2px; background: var(--open); border: none; color: #f2f4ef; font-weight: 600; font-size: 14.5px; cursor: pointer; font-family: inherit; }
.mv-next:disabled { background: rgba(49,53,45,0.07); color: var(--muted); cursor: default; }
.mv-skip { width: 100%; padding: 12px; margin-top: 8px; background: none; border: none; color: var(--muted); font-size: 12.5px; cursor: pointer; text-decoration: underline; }

.mv-result { display: flex; flex-direction: column; gap: 18px; }
.mv-result h2 { font-family: 'Gowun Batang', serif; font-weight: 400; font-size: 20px; margin: 0; }
.mv-result-card { background: linear-gradient(160deg,#f7f5ee,#ddd8ca); color: var(--ink); border-radius: 3px; padding: 18px 20px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.85; box-shadow: 0 6px 18px rgba(0,0,0,.25); white-space: pre-line; }
.mv-affect-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.mv-affect-tag { font-size: 11px; padding: 4px 9px; border-radius: 20px; border: 1px solid var(--line); color: var(--muted); }
.mv-restart { width: 100%; padding: 14px; margin-top: 8px; background: transparent; border: 1px solid var(--line); color: var(--muted); font-size: 13px; cursor: pointer; border-radius: 2px; font-family: inherit; }
`;

export default function MeditatioV1({ onComplete }) {
  const { state, actions } = useUserState();
  const [view, setView] = useState("intro"); // intro | home | group | question | result
  const [groupIdx, setGroupIdx] = useState(null);
  const [qIdx, setQIdx] = useState(0);

  const raw = state.meditatio.raw;
  const derived = state.meditatio.derived;

  const answeredCount = useMemo(() => Object.keys(raw).length, [raw]);
  const doneGroupIds = useMemo(() => {
    const done = new Set();
    for (const g of GROUPS) {
      if (g.questions.every((q) => raw[q.id] !== undefined)) done.add(g.id);
    }
    return done;
  }, [raw]);

  const sectionsView = useMemo(() => {
    const bySection = [];
    for (const section of MEDITATIO_SECTIONS) {
      const groupsInSection = GROUPS.filter((g) => g.sectionId === section.id);
      const totalQ = groupsInSection.reduce((s, g) => s + g.questions.length, 0);
      const doneQ = groupsInSection.reduce(
        (s, g) => s + g.questions.filter((q) => raw[q.id] !== undefined).length,
        0
      );
      bySection.push({ section, groupsInSection, totalQ, doneQ });
    }
    return bySection;
  }, [raw]);

  const openGroup = (groupId) => {
    const idx = GROUPS.findIndex((g) => g.id === groupId);
    setGroupIdx(idx);
    setQIdx(0);
    setView("question");
  };

  // Section 1/3/4는 카드가 없으니 섹션 클릭 시 바로 첫 그룹(=섹션 전체)으로 진입한다.
  const openSection = (section) => {
    if (section.cards) {
      setView("group");
      setGroupIdx(GROUPS.findIndex((g) => g.sectionId === section.id));
    } else {
      openGroup(section.id);
    }
  };

  const group = groupIdx !== null ? GROUPS[groupIdx] : null;
  const q = group ? group.questions[qIdx] : null;

  const setAnswer = (value) => {
    actions.setMeditatioAnswer(q.id, value);
  };

  const toggleMulti = (optN) => {
    const cur = raw[q.id];
    const arr = Array.isArray(cur) ? cur : [];
    const next = arr.includes(optN) ? arr.filter((x) => x !== optN) : [...arr, optN];
    setAnswer(next);
  };

  const isMulti = q?.type === "multi";
  const currentAnswer = q ? raw[q.id] : undefined;
  const canProceed = q ? (isMulti ? true : currentAnswer !== undefined) : false;

  const finishAll = () => {
    const result = deriveMeditatioResult(raw);
    actions.completeMeditatio(result);
    setView("result");
    // Lectio와 같은 이유로 onComplete는 여기서 자동 호출하지 않는다 — 결과 화면의
    // "Speculum으로 이동" 버튼을 사용자가 눌렀을 때만 다음 화면으로 넘어간다.
  };

  const nextQuestion = () => {
    if (qIdx + 1 < group.questions.length) {
      setQIdx(qIdx + 1);
      return;
    }
    // 이 그룹의 마지막 질문 — 다음 그룹으로 넘어가거나(연속 진행), 전체가 끝났으면 결과로.
    const nextGroupIdx = groupIdx + 1;
    if (nextGroupIdx < GROUPS.length) {
      setGroupIdx(nextGroupIdx);
      setQIdx(0);
    } else {
      finishAll();
    }
  };

  return (
    <div className="mv-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mv-shell">
        <div className="mv-eyebrow">돌 하나를 얹다</div>

        {view === "intro" && (
          <>
            <div className="mv-intro">
              <div>
                <h1 className="mv-open-h1">나는 어떻게 판단하는가?</h1>
                <p className="mv-open-desc">
                  내가 무엇을 보고, 무엇을 기억하며, 어떤 과정을 거쳐 판단을 내리는지 살펴봅니다.
                </p>
              </div>
            </div>
            <button className="mv-next" style={{ marginTop: 24 }} onClick={() => setView("home")}>
              시작하기
            </button>
          </>
        )}

        {view === "home" && (
          <div className="mv-intro">
            <p>
              4개의 장, 총 {TOTAL_QUESTIONS}문항입니다.
              <br />
              한 번에 다 하지 않아도 됩니다. 장 하나씩 이어가면 됩니다.
            </p>
            <div className="mv-cardlist">
              {sectionsView.map(({ section, doneQ, totalQ }) => (
                <div key={section.id} className="mv-cardrow" onClick={() => openSection(section)}>
                  <span>{section.title}</span>
                  <span className="n">{doneQ}/{totalQ}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, marginTop: 8 }}>
              전체 {answeredCount}/{TOTAL_QUESTIONS}문항 응답됨
            </p>
            {derived && (
              <button className="mv-next" onClick={() => setView("result")}>
                결과 다시 보기
              </button>
            )}
          </div>
        )}

        {view === "group" && groupIdx !== null && (
          <>
            <button className="mv-back" onClick={() => setView("home")}>
              ← 목록으로
            </button>
            <span className="mv-section-tag">{GROUPS[groupIdx].sectionTitle}</span>
            <h2 className="mv-section-h">Section {MEDITATIO_SECTIONS.find((s) => s.id === GROUPS[groupIdx].sectionId).index}</h2>
            <div className="mv-cardlist" style={{ marginTop: 16 }}>
              {GROUPS.filter((g) => g.sectionId === GROUPS[groupIdx].sectionId).map((g) => (
                <div key={g.id} className={`mv-cardrow ${doneGroupIds.has(g.id) ? "done" : ""}`} onClick={() => openGroup(g.id)}>
                  <span>{g.title}</span>
                  {doneGroupIds.has(g.id) ? <span className="chk">✓ 마침</span> : <span className="n">{g.questions.length}문항</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {view === "question" && group && q && (
          <>
            <button
              className="mv-back"
              onClick={() => (group.sectionId === "section2" ? setView("group") : setView("home"))}
            >
              ← {group.title}
            </button>

            <div className="mv-progress-wrap">
              <div className="mv-progress-bar">
                <div className="mv-progress-fill" style={{ width: `${((qIdx + 1) / group.questions.length) * 100}%` }} />
              </div>
              <div className="mv-progress-label">
                {group.title} · {qIdx + 1} / {group.questions.length}
              </div>
            </div>

            <p className="mv-q">{q.text}</p>
            {isMulti && <p className="mv-hint">해당하는 것을 모두 골라주세요. 없으면 그냥 다음으로 넘어가도 됩니다.</p>}

            <div className="mv-opts">
              {q.options.map((opt) => {
                const sel = isMulti ? Array.isArray(currentAnswer) && currentAnswer.includes(opt.n) : currentAnswer === opt.n;
                return (
                  <button
                    key={opt.n}
                    className={`mv-opt ${sel ? "sel" : ""}`}
                    onClick={() => (isMulti ? toggleMulti(opt.n) : setAnswer(opt.n))}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            <button className="mv-next" disabled={!canProceed} onClick={nextQuestion}>
              {groupIdx === GROUPS.length - 1 && qIdx === group.questions.length - 1 ? "Meditatio 마치기" : "다음"}
            </button>
            {isMulti && (
              <button className="mv-skip" onClick={nextQuestion}>
                건너뛰기
              </button>
            )}
          </>
        )}

        {view === "result" && derived && (
          <div className="mv-result">
            <button className="mv-back" onClick={() => setView("home")}>
              ← 목록으로
            </button>
            <h2>지금, 나는 이렇게 판단합니다</h2>
            <div className="mv-result-card">{derived.narrative || "아직 판단 흐름을 구성할 만큼 응답이 모이지 않았습니다."}</div>

            {derived.affect.length > 0 && (
              <div>
                <p className="mv-hint" style={{ margin: "0 0 8px" }}>정서적으로 반복해서 나타난 것</p>
                <div className="mv-affect-tags">
                  {[...new Set(derived.affect)].map((s) => (
                    <span key={s} className="mv-affect-tag">{DOMAIN_COPY[s.replace("_related", "")]?.label ?? s}</span>
                  ))}
                </div>
              </div>
            )}

            {onComplete && (
              <button className="mv-next" onClick={() => onComplete(derived)}>
                Speculum으로 이동
              </button>
            )}
            <button className="mv-restart" onClick={() => setView("home")}>
              목록으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
