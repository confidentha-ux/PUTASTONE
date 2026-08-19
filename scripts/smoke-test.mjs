import { chromium } from "playwright";
import { PERSONA_REGISTRY } from "../src/speculum/personaRegistry.js";

const KOREAN_NAME_TO_ID = Object.fromEntries(
  Object.values(PERSONA_REGISTRY).map((p) => [p.koreanName, p.id])
);

const errors = [];

// 18개 persona 컴포넌트는 서로 다른 흐름(텍스트 입력 / 객관식 선택 / 항목 추가형 반복)을
// 갖고 있지만, CSS 클래스 네이밍과 버튼 문구는 공통 패턴을 따른다. 이 드라이버는 그 공통
// 패턴을 이용해 "어떤 persona가 열리든" 최대한 끝까지 진행해본다 — General처럼 미리 정해둔
// 스크립트가 없는 나머지 17개 persona 중 무엇이 오늘 라우팅에서 선택되더라도 완료 + 세션
// 저장을 검증할 수 있게 하기 위한 best-effort 보조 수단이다. 막히면(더 진행할 수 있는 요소를
// 못 찾으면) 조용히 멈추고 false를 반환한다 — 이 경우 호출부에서 실패로 처리하지 않는다.
async function autoCompletePersona(page, { maxSteps = 60 } = {}) {
  for (let i = 0; i < maxSteps; i++) {
    if (await page.locator("text=완료하고 Speculum으로 돌아가기").count()) return true;

    // mockCallClaude의 인위적 지연(loading 화면)을 기다린다.
    if (await page.locator("[class*='-loading']").count()) {
      await page.waitForTimeout(450);
      continue;
    }

    // 항목 추가형 화면(측량사/세공사/청지기 등): input + "…추가" 버튼이 있으면 두 개 채운다.
    const addBtn = page.locator("button", { hasText: "추가" });
    if (await addBtn.count()) {
      const input = page.locator("input[class*='-input']").first();
      if (await input.count() && !(await input.inputValue())) {
        await input.fill(`스모크 항목 ${i}`);
        await addBtn.first().click();
        await page.waitForTimeout(60);
        continue;
      }
    }

    // 비어 있는 textarea가 있으면 채운다.
    const textarea = page.locator("textarea").first();
    if (await textarea.count()) {
      const val = await textarea.inputValue();
      if (!val) {
        await textarea.fill("스모크 테스트 답변입니다.");
        await page.waitForTimeout(30);
        continue;
      }
    }

    // 진행 버튼(다음/결과 보기/계속/시작하기 등, 비활성화 아님)이 있으면 누른다.
    const advance = page.locator("button:not([disabled])", { hasText: /^(다음|결과 보기|계속|시작하기)$/ });
    if (await advance.count()) {
      await advance.first().click();
      await page.waitForTimeout(60);
      continue;
    }

    // 객관식 옵션 버튼("직접 적기"가 아닌 첫 번째)을 클릭한다.
    const optButtons = page.locator("button[class*='-opt']").filter({ hasNotText: "직접 적기" });
    if (await optButtons.count()) {
      await optButtons.first().click();
      await page.waitForTimeout(60);
      continue;
    }

    break; // 더 진행할 방법을 찾지 못했다 — 멈춘다.
  }
  return (await page.locator("text=완료하고 Speculum으로 돌아가기").count()) > 0;
}

async function main() {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage();
  global.__page = page;
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto("http://localhost:5173/");
  await page.waitForSelector("text=시작하기");
  console.log("[ok] Start screen rendered");

  // Start -> Lectio
  await page.click("text=시작하기");
  await page.waitForSelector("text=Read Yourself");
  console.log("[ok] Lectio intro rendered");
  await page.click("text=시작하기");
  await page.waitForSelector(".lc-card-text");

  // 14장 전부 "할 수 있다" 클릭 (closed 항목 후속 질문 스킵하고 result까지 최단 경로로 확인)
  // 카드 텍스트가 바뀌는 것을 확인하고 다음 클릭을 하도록 해서 애니메이션/렌더 타이밍 이슈를 피한다.
  for (let i = 0; i < 14; i++) {
    const before = await page.locator(".lc-card-text").count() ? await page.locator(".lc-card-text").innerText() : null;
    await page.click("text=할 수 있다");
    await page.waitForFunction(
      (prevText) => {
        const el = document.querySelector(".lc-card-text");
        const summary = document.body.innerText.includes("장을 모두 보셨습니다");
        return summary || (el && el.innerText !== prevText);
      },
      before,
      { timeout: 5000 }
    );
  }
  await page.waitForSelector("text=계속");
  await page.click("text=계속");

  // closed 항목이 남아있으면(운이 나쁘면 shuffle과 무관하게 0이어야 하지만 방어적으로) q3→q4를 반복 처리한다.
  let closedGuard = 0;
  while (closedGuard < 20) {
    closedGuard++;
    const onResult = await page.locator("text=/오늘 \\d+개를 다시 살펴보셨습니다\\./").count();
    if (onResult > 0) break;
    const onQ3 = await page.locator("text=그것을 하기 어렵다고 생각하는 주된 이유는 무엇입니까?").count();
    if (onQ3 > 0) {
      await page.locator(".lc-opt").first().click();
      await page.waitForSelector(".lc-opts .lc-opt", { timeout: 5000 });
      await page.locator(".lc-opt").first().click();
      await page.locator(".lc-next").click();
      await page.waitForTimeout(80);
    } else {
      break;
    }
  }
  await page.waitForSelector("text=/오늘 \\d+개를 다시 살펴보셨습니다\\./", { timeout: 10000 });
  const resultHeading = await page.locator(".lc-q").first().innerText();
  console.log("[ok] Lectio result reached:", resultHeading);

  // localStorage 확인
  const afterLectio = await page.evaluate(() => JSON.parse(localStorage.getItem("pebbletrail.userState.v1")));
  if (!afterLectio.lectio.completedAt) throw new Error("Lectio completedAt not set in localStorage");
  if (afterLectio.lectio.items.length !== 14) throw new Error("Lectio items length != 14: " + afterLectio.lectio.items.length);
  console.log("[ok] Lectio persisted to localStorage:", afterLectio.lectio.items.length, "items");

  // Lectio 결과 화면의 "Meditatio로 계속하기" 버튼으로 이동 (자동 이동 아님 — 결과를 실제로 볼 수 있어야 하므로)
  await page.click("text=Meditatio로 계속하기");
  await page.waitForSelector("text=Read the Judgment");
  console.log("[ok] Meditatio home rendered");

  // 33문항을 순서대로 첫 번째 보기를 눌러 끝까지 진행
  // Section1/3/4는 카드 없이 바로 질문으로 들어가고, Section2는 카드 목록을 거친다.
  await page.click("text=판단은 어디서 시작되는가");

  let guard = 0;
  while (guard < 80) {
    guard++;
    const onResult = await page.locator("text=당신의 판단 흐름").count();
    if (onResult > 0) break;

    // 카드 목록 화면이면 첫 카드를 클릭해서 들어간다
    const cardRows = await page.locator(".mv-cardrow").count();
    const hasQuestion = await page.locator(".mv-q").count();
    if (hasQuestion === 0 && cardRows > 0) {
      await page.locator(".mv-cardrow").first().click();
      await page.waitForTimeout(60);
      continue;
    }

    if (hasQuestion > 0) {
      await page.locator(".mv-opt").first().click();
      await page.waitForTimeout(30);
      const nextBtn = page.locator(".mv-next");
      await nextBtn.click();
      await page.waitForTimeout(60);
      continue;
    }
    // 홈으로 돌아왔는데 아직 완료 안됐으면(그룹 사이 전환) 다음 미완료 섹션을 클릭
    const unfinished = page.locator(".mv-cardrow:not(.done)").first();
    if (await unfinished.count()) {
      await unfinished.click();
      await page.waitForTimeout(60);
    }
  }

  await page.waitForSelector("text=당신의 판단 흐름", { timeout: 5000 });
  console.log("[ok] Meditatio result reached after", guard, "steps");

  const finalState = await page.evaluate(() => JSON.parse(localStorage.getItem("pebbletrail.userState.v1")));
  if (!finalState.meditatio.completedAt) throw new Error("Meditatio completedAt not set");
  const raw = finalState.meditatio.raw;
  const answeredCount = Object.keys(raw).length;
  console.log("[ok] Meditatio answered questions:", answeredCount, "/ 33");
  console.log("[ok] Meditatio derived.defaultStrategy:", finalState.meditatio.derived.defaultStrategy);
  console.log("[ok] Meditatio derived.pressure:", JSON.stringify(finalState.meditatio.derived.pressure));
  console.log("[ok] Meditatio narrative (first 120 chars):", finalState.meditatio.derived.narrative.slice(0, 120));

  // Speculum — Meditatio 결과 화면의 "Speculum으로 이동" 버튼으로 이동
  await page.click("text=Speculum으로 이동");
  await page.waitForSelector("text=열린 Family 후보");
  console.log("[ok] Speculum routing screen rendered (Family candidates shown)");

  const speculumText = await page.locator("body").innerText();
  if (!speculumText.includes("지금 제시할 수 있는 렌즈")) throw new Error("Speculum operation candidates section missing");
  console.log("[ok] Speculum operation candidates section rendered");

  // 렌즈 후보 중 하나를 선택하면 "이 렌즈 열기" 버튼이 뜨고, 누르면 실제 18개 persona
  // 컴포넌트 중 하나가 열려야 한다 (Task #14 — 더 이상 "아직 연결 안 됨" 안내가 아니다).
  const personaCards = page.locator("button").filter({ hasText: "·" });
  const cardCount = await personaCards.count();
  if (cardCount === 0) throw new Error("No persona candidate cards rendered in Speculum");

  // 카드 후보 중 "장군"(General — AI 호출이 없어 결정론적으로 끝까지 진행 가능)이 있으면
  // 그것을 선택해서 완료까지 전체 플로우를 검증하고, 없으면 첫 번째 후보로 열림만 검증한다.
  const generalCard = page.locator("button").filter({ hasText: "장군" });
  const hasGeneral = (await generalCard.count()) > 0;
  if (hasGeneral) {
    await generalCard.first().click();
  } else {
    await personaCards.first().click();
  }
  await page.waitForSelector("text=페르소나를 선택했습니다.");
  await page.click("text=이 렌즈 열기");
  await page.waitForSelector("text=르네상스의 그 거울 · III");
  console.log("[ok] Persona card opens the real questionnaire component (no more 'not yet connected' notice)");

  if (hasGeneral) {
    // General(장군) 전체 플로우를 끝까지 진행해서 SpeculumSession이 실제로 저장되는지 확인한다.
    await page.waitForSelector("text=The General");
    await page.click("text=시작하기");
    await page.waitForSelector("text=잘 모르겠다.");
    await page.click("text=잘 모르겠다.");
    await page.waitForSelector(".gn-textarea");
    await page.fill(".gn-textarea", "스모크 테스트로 남긴 답변입니다.");
    await page.click("text=다음");
    await page.waitForSelector("text=가장 많이 쓰고 있는 것은 무엇입니까?");
    await page.click("text=시간");
    await page.waitForSelector("text=못 하고 있거나 미루고 있는 것이 있습니까?");
    await page.click("text=쉬는 것");
    await page.waitForSelector("text=지금처럼 계속하는 것이 맞다고 생각합니까?");
    await page.click("text=잘 모르겠다.");
    await page.waitForSelector(".gn-textarea");
    await page.fill(".gn-textarea", "스모크 테스트 이유입니다.");
    await page.click("text=결과 보기");
    await page.waitForSelector("text=완료하고 Speculum으로 돌아가기");
    console.log("[ok] General persona flow reached its result screen");

    await page.click("text=완료하고 Speculum으로 돌아가기");
    await page.waitForSelector("text=세션이 저장되었습니다.");
    console.log("[ok] Completing a persona shows the saved-session confirmation");

    const afterSpeculum = await page.evaluate(() => JSON.parse(localStorage.getItem("pebbletrail.userState.v1")));
    if (!Array.isArray(afterSpeculum.speculumSessions) || afterSpeculum.speculumSessions.length !== 1) {
      throw new Error("speculumSessions did not gain exactly 1 entry: " + JSON.stringify(afterSpeculum.speculumSessions));
    }
    const savedSession = afterSpeculum.speculumSessions[0];
    if (savedSession.personaId !== "general") throw new Error("saved session personaId != general: " + savedSession.personaId);
    if (!savedSession.rawAnswers || savedSession.rawAnswers.reason !== "스모크 테스트 이유입니다.") {
      throw new Error("saved session rawAnswers missing expected reason field: " + JSON.stringify(savedSession.rawAnswers));
    }
    console.log("[ok] SpeculumSession persisted to localStorage with expected personaId and rawAnswers:", savedSession.sessionId);

    await page.click("text=다른 렌즈 보기");
  } else {
    // General이 후보에 없으면, 열린 persona가 무엇이든 공용 드라이버로 최대한 끝까지 진행해본다.
    const koreanName = (await page.locator("[class*='-persona'] h1").first().innerText()).trim();
    const openedPersonaId = KOREAN_NAME_TO_ID[koreanName] ?? null;
    console.log(`[info] Opened persona: ${koreanName} (id: ${openedPersonaId ?? "unknown"}) — attempting generic auto-complete driver`);

    const completed = await autoCompletePersona(page);
    if (!completed) {
      console.log("[ok] Generic auto-complete driver could not reach the result screen for this persona (expected for some branch-heavy flows) — opening-only check still passed");
    } else {
      console.log("[ok] Generic auto-complete driver reached the result screen");
      await page.click("text=완료하고 Speculum으로 돌아가기");
      await page.waitForSelector("text=세션이 저장되었습니다.");
      console.log("[ok] Completing a persona shows the saved-session confirmation");

      const afterSpeculum = await page.evaluate(() => JSON.parse(localStorage.getItem("pebbletrail.userState.v1")));
      if (!Array.isArray(afterSpeculum.speculumSessions) || afterSpeculum.speculumSessions.length !== 1) {
        throw new Error("speculumSessions did not gain exactly 1 entry: " + JSON.stringify(afterSpeculum.speculumSessions));
      }
      const savedSession = afterSpeculum.speculumSessions[0];
      if (openedPersonaId && savedSession.personaId !== openedPersonaId) {
        throw new Error(`saved session personaId (${savedSession.personaId}) != opened persona (${openedPersonaId})`);
      }
      if (!savedSession.rawAnswers || Object.keys(savedSession.rawAnswers).length === 0) {
        throw new Error("saved session rawAnswers is empty: " + JSON.stringify(savedSession.rawAnswers));
      }
      console.log("[ok] SpeculumSession persisted to localStorage with expected personaId and non-empty rawAnswers:", savedSession.sessionId);

      await page.click("text=다른 렌즈 보기");
    }
  }

  // Studiolo — 상단 네비게이션의 "The Studiolo" 버튼으로 이동
  await page.locator("button", { hasText: "The Studiolo" }).first().click();
  await page.waitForSelector(".st-shell");
  const studioloText = await page.locator(".st-shell").innerText();
  if (!studioloText.includes("자연스럽게 가능한 행동")) throw new Error("Studiolo Lectio section missing");
  if (studioloText.includes("아직 Meditatio를 완료하지 않았습니다")) throw new Error("Studiolo did not pick up Meditatio result");
  console.log("[ok] Studiolo shows both Lectio and Meditatio results");

  // 새로고침 후 영속성 확인
  await page.reload();
  await page.waitForSelector("text=The Studiolo");
  const afterReload = await page.evaluate(() => JSON.parse(localStorage.getItem("pebbletrail.userState.v1")));
  if (!afterReload.meditatio.completedAt) throw new Error("State did not survive reload");
  console.log("[ok] State survives reload (localStorage persistence confirmed)");

  await browser.close();

  if (errors.length) {
    console.log("\n--- console/page errors during run ---");
    for (const e of errors) console.log(e);
    process.exitCode = 1;
  } else {
    console.log("\nALL CHECKS PASSED, no console errors.");
  }
}

main().catch(async (e) => {
  console.error("SMOKE TEST FAILED:", e);
  if (global.__page) {
    try {
      const body = await global.__page.locator("body").innerText();
      console.error("--- page text at failure ---\n", body.slice(0, 2000));
      await global.__page.screenshot({ path: "/tmp/failure.png" });
    } catch (e2) {
      console.error("failed to capture diagnostics", e2);
    }
  }
  process.exit(1);
});
