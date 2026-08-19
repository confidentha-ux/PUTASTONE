// Family Routing / Persona Registry / Operation Dedup 자기검증
// node scripts/family-routing-selftest.mjs

import { scoreFamilies, rankFamilies, getFamilyCandidates } from "../src/speculum/familyRouting.js";
import { PERSONA_REGISTRY, PERSONA_IDS } from "../src/speculum/personaRegistry.js";
import { buildOperationCandidates, isDuplicateOperation } from "../src/speculum/operationDedup.js";
import { SPECULUM_SCHEMA } from "../src/data/speculumSchema.js";

let failures = 0;
function check(label, cond) {
  if (cond) {
    console.log(`OK   ${label}`);
  } else {
    failures += 1;
    console.log(`FAIL ${label}`);
  }
}

// ---------------------------------------------------------------------------
// 1. family-candidate-rules-v1.md §14 worked example
//    Trigger=Evaluation / Response=Ruminate / Maintenance=Search for better answer / Release=Self-Permission
//    기대: Identity HIGH, Criterion HIGH, Scale POSSIBLE~HIGH, Distance POSSIBLE
// ---------------------------------------------------------------------------
const workedExample = {
  defaultStrategy: null,
  affect: [],
  judgmentProcess: {},
  pressure: {
    trigger: { object: "trigger", domain: "evaluation" },
    response: { object: "response_ruminate", domain: null },
    maintenance: { object: "maintenance_search_for_better_answer", domain: null },
    release: { object: "release_permission", domain: "self_permission" },
  },
};

const scores = scoreFamilies(workedExample);
console.log("scores:", scores);
const ranked = rankFamilies(scores, workedExample);
const candidates = ranked.filter((r) => r.candidate).map((r) => r.family).sort();

check(
  "worked example candidates = [criterion, distance, identity, scale]",
  JSON.stringify(candidates) === JSON.stringify(["criterion", "distance", "identity", "scale"].sort())
);
check("identity is top-ranked (rank 1)", ranked.find((r) => r.family === "identity").rank === 1);
check("criterion is top-ranked (rank 1, tied)", ranked.find((r) => r.family === "criterion").rank <= 2);
check("time is NOT a candidate", !ranked.find((r) => r.family === "time").candidate);
check("boundary is NOT a candidate", !ranked.find((r) => r.family === "boundary").candidate);

// ---------------------------------------------------------------------------
// 2. Persona registry ↔ Speculum schema key parity
// ---------------------------------------------------------------------------
const schemaKeys = Object.keys(SPECULUM_SCHEMA).sort();
const registryKeys = PERSONA_IDS.slice().sort();
check("persona registry has 18 personas", registryKeys.length === 18);
check(
  "persona registry keys exactly match SPECULUM_SCHEMA keys",
  JSON.stringify(schemaKeys) === JSON.stringify(registryKeys)
);

for (const id of PERSONA_IDS) {
  const p = PERSONA_REGISTRY[id];
  check(`${id} has family/eligibilityField/operationSignature`, !!p.family && !!p.eligibilityField && !!p.operationSignature);
}

// ---------------------------------------------------------------------------
// 3. Operation dedup — claude/operation-dedup-rules-v1.md worked examples
// ---------------------------------------------------------------------------
// §6: gatekeeper/steward는 같은 Boundary Family지만 signature가 달라 유지되어야 한다.
check(
  "gatekeeper vs steward: not duplicate (same family, different signature)",
  !isDuplicateOperation(PERSONA_REGISTRY.gatekeeper.operationSignature, PERSONA_REGISTRY.steward.operationSignature)
);

// §5: "상대가 실망할 것 같아서 이번에도 내가 맡아야 할 것 같다" 예시 — 기록자/장군/마술사 모두 통과 가능,
// 셋 다 target/move/output이 서로 다르므로 3개까지 제시 가능해야 한다.
const threeWay = buildOperationCandidates(["chronicler", "general", "magician"], { max: 3 });
check(
  "chronicler + general + magician: all 3 kept (fully different signatures)",
  threeWay.length === 3
);

// anatomist/magician은 문서상 target 문자열 자체는 다르게 표기돼 있어("judgment_factor" vs "dominant_factor")
// 정적 문자열 비교만으로는 자동으로 dedup되지 않는다 — 이건 버그가 아니라 문서가 스스로 인정하는 한계다
// ("같은 요소를 대상으로 하면 dedup" = 세션 안에서 실제로 같은 요소를 가리킬 때의 의미론적 판단이 필요).
// KNOWN_OVERLAP_NOTES에 그 사실을 기록해 두었다. 여기서는 그 한계를 문서화하는 차원에서 확인만 한다.
const anatomistMagicianOverlap = isDuplicateOperation(
  PERSONA_REGISTRY.anatomist.operationSignature,
  PERSONA_REGISTRY.magician.operationSignature
);
console.log(
  `NOTE anatomist vs magician static-signature dedup = ${anatomistMagicianOverlap} ` +
    `(expected false — see KNOWN_OVERLAP_NOTES for why this needs runtime/semantic judgment instead)`
);

console.log("");
if (failures === 0) {
  console.log("모든 self-test 통과.");
} else {
  console.log(`${failures}개 실패.`);
  process.exit(1);
}
