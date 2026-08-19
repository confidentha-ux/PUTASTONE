import { chromium } from "playwright";

const errors = [];

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

  // 첫 번째 렌즈 후보를 선택하면 안내 문구가 떠야 한다 (아직 실제 persona 질문지는 연결 전)
  const personaCards = page.locator("button").filter({ hasText: "·" });
  const cardCount = await personaCards.count();
  if (cardCount === 0) throw new Error("No persona candidate cards rendered in Speculum");
  await personaCards.first().click();
  await page.waitForSelector("text=페르소나를 선택했습니다.");
  console.log("[ok] Selecting a persona candidate shows the not-yet-connected notice");

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
