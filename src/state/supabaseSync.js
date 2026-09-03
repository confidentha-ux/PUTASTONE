import { supabase } from "../lib/supabaseClient";

// 로그인된 사용자의 전체 상태를 4개 테이블에서 읽어와 로컬 reducer 상태 모양으로 합쳐 돌려준다.
// 실패하면(네트워크 오류 등) null을 돌려주고, 호출부는 로컬(localStorage) 상태를 그대로 쓴다 —
// 즉 Supabase 연결이 안 되어도 앱 자체는 계속 동작한다.
export async function loadUserStateFromSupabase(userId) {
  try {
    const [profileRes, lectioRes, meditatioRes, sessionsRes, pathsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("lectio_state").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("meditatio_state").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("speculum_sessions").select("*").eq("user_id", userId).order("session_timestamp", { ascending: true }),
      supabase.from("judgment_paths").select("*").eq("user_id", userId).order("generated_at", { ascending: true }),
    ]);

    if (profileRes.error) throw profileRes.error;

    return {
      schemaVersion: profileRes.data?.schema_version ?? 1,
      versions: profileRes.data?.versions ?? {},
      profile: { displayName: profileRes.data?.display_name ?? null },
      lectio: {
        raw: lectioRes.data?.raw ?? {},
        items: lectioRes.data?.items ?? [],
        dominantDomain: lectioRes.data?.dominant_domain ?? null,
        completedAt: lectioRes.data?.completed_at ? new Date(lectioRes.data.completed_at).getTime() : null,
      },
      meditatio: {
        raw: meditatioRes.data?.raw ?? {},
        derived: meditatioRes.data?.derived ?? null,
        completedAt: meditatioRes.data?.completed_at ? new Date(meditatioRes.data.completed_at).getTime() : null,
      },
      speculumSessions: (sessionsRes.data ?? []).map((row) => ({
        sessionId: row.session_id,
        timestamp: new Date(row.session_timestamp).getTime(),
        personaId: row.persona_id,
        personaVersion: row.persona_version,
        initialJudgment: row.initial_judgment ?? "",
        operationData: row.operation_data ?? {},
        newInformation: row.new_information ?? "",
        judgmentShift: row.judgment_shift ?? null,
        rejudgment: row.rejudgment ?? "",
        changeStrength: row.change_strength ?? null,
        reflection: row.reflection ?? "",
        rawAnswers: row.raw_answers ?? {},
        routingMeta: row.routing_meta ?? {},
      })),
      judgmentPaths: (pathsRes.data ?? []).map((row) => ({
        pathId: row.path_id,
        generatedAt: new Date(row.generated_at).getTime(),
        basedOnSessionIds: row.based_on_session_ids ?? [],
        start: row.start,
        movement: row.movement,
        criticalMoment: row.critical_moment,
        releasePoint: row.release_point,
        observedChange: row.observed_change,
      })),
      judgmentPathsGeneratedAt: pathsRes.data?.length ? Math.max(...pathsRes.data.map((p) => new Date(p.generated_at).getTime())) : null,
    };
  } catch (e) {
    console.warn("[supabaseSync] 상태 불러오기 실패, 로컬 상태를 씁니다.", e);
    return null;
  }
}

// 아래 저장 함수들은 전부 fire-and-forget이다 — 실패해도 UI를 막지 않고 콘솔 경고만 남긴다.
// (localStorage에는 이미 저장되어 있으므로 사용자가 데이터를 잃지는 않는다.)

export async function saveLectioToSupabase(userId, { raw, items, dominantDomain }) {
  const { error } = await supabase.from("lectio_state").upsert({
    user_id: userId,
    raw: raw ?? {},
    items,
    dominant_domain: dominantDomain,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  if (error) console.warn("[supabaseSync] Lectio 저장 실패", error);
}

export async function saveMeditatioAnswerToSupabase(userId, raw) {
  const { error } = await supabase.from("meditatio_state").upsert({
    user_id: userId,
    raw,
    updated_at: new Date().toISOString(),
  });
  if (error) console.warn("[supabaseSync] Meditatio 답변 저장 실패", error);
}

export async function saveMeditatioCompleteToSupabase(userId, derived) {
  const { error } = await supabase.from("meditatio_state").upsert({
    user_id: userId,
    derived,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  if (error) console.warn("[supabaseSync] Meditatio 완료 저장 실패", error);
}

export async function saveSpeculumSessionToSupabase(userId, session) {
  const { error } = await supabase.from("speculum_sessions").insert({
    user_id: userId,
    session_id: session.sessionId,
    session_timestamp: new Date(session.timestamp).toISOString(),
    persona_id: session.personaId,
    persona_version: session.personaVersion,
    initial_judgment: session.initialJudgment,
    operation_data: session.operationData,
    new_information: session.newInformation,
    judgment_shift: session.judgmentShift,
    rejudgment: session.rejudgment,
    change_strength: session.changeStrength,
    reflection: session.reflection,
    raw_answers: session.rawAnswers,
    routing_meta: session.routingMeta,
  });
  if (error) console.warn("[supabaseSync] Speculum 세션 저장 실패", error);
}

export async function saveJudgmentPathsToSupabase(userId, paths) {
  const rows = paths.map((p) => ({
    user_id: userId,
    path_id: p.pathId,
    generated_at: new Date().toISOString(),
    based_on_session_ids: p.basedOnSessionIds ?? [],
    start: p.start,
    movement: p.movement,
    critical_moment: p.criticalMoment,
    release_point: p.releasePoint,
    observed_change: p.observedChange,
  }));
  const { error } = await supabase.from("judgment_paths").insert(rows);
  if (error) console.warn("[supabaseSync] Judgment Paths 저장 실패", error);
}
