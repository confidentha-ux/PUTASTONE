// src/personas/index.js
// 18개 Speculum Persona 컴포넌트를 personaRegistry.js의 id(=PERSONA_IDS)와 연결하는 매핑.
// Task #14 — "18개 Speculum 페르소나 코드를 실제로 화면에 연결"의 결과물.
//
// 각 컴포넌트는 claude/speculum-*.jsx(Project 문서) 원본을 거의 그대로 옮긴 것이며,
// 다음 두 가지만 기계적으로 바뀌었다:
//   1) 브라우저에서 API 키 없이 Anthropic API를 직접 호출하던 로컬 callClaude()를
//      src/speculum/aiStub.js의 mockCallClaude()로 교체 (서버 프록시가 붙기 전 임시 조치)
//   2) 결과 화면에 onComplete(answers) prop을 호출하는 "완료하고 Speculum으로 돌아가기"
//      버튼 추가 (기존 "처음부터 다시" 버튼은 그대로 유지 — 자동 이동시키지 않는다는
//      프로젝트 원칙을 지키기 위해 두 버튼 모두 사용자의 명시적 클릭이 필요하다)
//
// 원본 소스에 두 군데 오타(내부 컴포넌트 이름이 실제 페르소나와 다르게 붙어 있던 것)가
// 있어 이식하면서 바로잡았다:
//   - speculum-gatekeeper.jsx(수문장) 원본은 내부적으로 GuardianLens로 export되어 있었다
//     (진짜 Guardian/파수꾼 파일과 이름이 겹침) → GatekeeperLens로 수정.
//   - speculum-chronicler.jsx(기록자) 원본은 내부적으로 DetectiveLens로 export되어 있었다
//     → ChroniclerLens로 수정.
// CSS 클래스 프리픽스(gd-, dt- 등)는 원본 그대로 두었다 — 로직에 영향이 없고, 프리픽스까지
// 바꾸면 스타일 규칙을 통째로 다시 옮겨야 해서 원본과의 대조가 어려워지기 때문이다.

import PatronLens from "./patron";
import NovelistLens from "./novelist";
import OracleLens from "./oracle";
import TimeTravelerLens from "./timeTraveler";
import MerchantLens from "./merchant";
import GuardianLens from "./guardian";
import WitnessLens from "./witness";
import GeneralLens from "./general";
import ArtisanLens from "./artisan";
import SurveyorLens from "./surveyor";
import PioneerLens from "./pioneer";
import PortraitistLens from "./portraitist";
import ChroniclerLens from "./chronicler";
import GatekeeperLens from "./gatekeeper";
import StewardLens from "./steward";
import AnatomistLens from "./anatomist";
import MagistrateLens from "./magistrate";
import MagicianLens from "./magician";

// PERSONA_REGISTRY(src/speculum/personaRegistry.js)의 18개 id와 정확히 같은 키를 쓴다.
export const PERSONA_COMPONENTS = {
  patron: PatronLens,
  novelist: NovelistLens,
  oracle: OracleLens,
  timeTraveler: TimeTravelerLens,
  merchant: MerchantLens,
  guardian: GuardianLens,
  witness: WitnessLens,
  general: GeneralLens,
  artisan: ArtisanLens,
  surveyor: SurveyorLens,
  pioneer: PioneerLens,
  portraitist: PortraitistLens,
  chronicler: ChroniclerLens,
  gatekeeper: GatekeeperLens,
  steward: StewardLens,
  anatomist: AnatomistLens,
  magistrate: MagistrateLens,
  magician: MagicianLens,
};

export function getPersonaComponent(personaId) {
  return PERSONA_COMPONENTS[personaId] ?? null;
}
