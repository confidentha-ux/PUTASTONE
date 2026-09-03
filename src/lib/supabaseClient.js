import { createClient } from "@supabase/supabase-js";

// Vite는 클라이언트에 노출할 환경변수를 VITE_ 접두어로만 번들에 포함시킨다.
// 실제 값은 여기 하드코딩하지 않는다 — Vercel 프로젝트 설정(Environment Variables)에
// VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY를 등록하고, 로컬 개발 시에는
// .env(커밋 금지, .gitignore에 이미 포함됨)에 같은 이름으로 넣어서 쓴다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const isConfigured = Boolean(supabaseUrl && supabasePublishableKey);

if (!isConfigured) {
  // 개발 중 설정을 빠뜨렸을 때 조용히 실패하지 않고 바로 알려준다. createClient에 값이 없는 채로
  // 넘기면 즉시 예외를 던져서 앱 전체가 하얗게 죽어버리므로, 여기서는 더미 URL로 초기화만 해두고
  // 실제 호출부(로그인 등)에서 정상적으로 실패하도록 한다 — 로그인 관련 기능 없이도 앱의 나머지는
  // 계속 동작해야 한다(게스트 모드, localStorage만 사용).
  console.error(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY가 설정되지 않았습니다. " +
      ".env(로컬) 또는 Vercel 프로젝트의 Environment Variables를 확인하세요. " +
      "로그인/저장 기능 없이 게스트 모드로만 동작합니다."
  );
}

// publishable 키만 쓴다 — secret 키는 여기 절대 들어오면 안 된다(브라우저 번들에 그대로 노출됨).
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabasePublishableKey || "placeholder"
);
