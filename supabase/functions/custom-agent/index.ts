import { createClient } from "npm:@supabase/supabase-js@2";

// --- Configuration (server-side only) ---
const ENTER_API_BASE_URL = (
  Deno.env.get("ENTER_API_BASE_URL") ?? "https://enter.converge.ai"
).replace(/\/+$/, "");
const ENTER_API_KEY = Deno.env.get("ENTER_API_KEY") ?? "";
const ALLOWED_AGENT_IDS = new Set([
  "ff08b4ab-1410-4d0d-9a88-ff4103ea0e64", // RetainIQ Qwen reasoning agent
]);

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// The structured output contract the UI renders (Deep-Dive payload).
const DIAGNOSTIC_SCHEMA = {
  diagnostic_id: "DGN-<generated>",
  model: "qwen-max-reasoning",
  hallucination_guard: "enabled",
  confidence: 0.0,
  employee: {
    id: "<employee_code>",
    name: "<employee_name>",
    role: "<employee_role>",
  },
  telemetry: {
    overtime_spike: { hours: 0, baseline: 0, trend: "rising|stable|falling" },
    sentiment_drop: { score: 0, baseline: 0, anomaly: true },
    peer_review_gap: { delta: 0, anomaly: true },
  },
  risk_assessment: {
    score: 0,
    grade: "LOW|ELEVATED|CRITICAL",
    confidence_interval: [0, 0],
  },
  root_causes: ["cause_a", "cause_b"],
  recommended_actions: [
    {
      action: "action_key",
      owner: "owner_role",
      due: "YYYY-MM-DD",
      priority: "P0|P1|P2",
    },
  ],
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorJson(code: string, message: string, status: number) {
  return json({ error_code: code, message }, status);
}

async function authenticate(req: Request) {
  const token =
    req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token) {
    throw new Response(
      JSON.stringify({ error_code: "UNAUTHORIZED", message: "Missing session token." }),
      { status: 401, headers: corsHeaders }
    );
  }
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await userClient.auth.getUser();
  if (error || !data.user) {
    throw new Response(
      JSON.stringify({ error_code: "UNAUTHORIZED", message: "Invalid session token." }),
      { status: 401, headers: corsHeaders }
    );
  }
  return { user: data.user, userClient };
}

function requireKey() {
  if (!ENTER_API_KEY) {
    throw errorJson(
      "ENTER_API_KEY_MISSING",
      "Enter API key secret is missing.",
      500
    );
  }
  return ENTER_API_KEY;
}

function enterUrl(pathname: string) {
  return `${ENTER_API_BASE_URL}/code/api/v1${pathname}`;
}

function enterHeaders() {
  return {
    Authorization: `Bearer ${requireKey()}`,
    "Content-Type": "application/json",
  };
}

async function createThread(agentId: string) {
  const upstream = await fetch(enterUrl(`/agents/${agentId}/threads`), {
    method: "POST",
    headers: enterHeaders(),
    body: JSON.stringify({}),
  });
  const body = await upstream.json().catch(() => ({}));
  return { status: upstream.status, body };
}

async function persistThread(
  userId: string,
  agentId: string,
  thread: { thread_id?: string; version?: number; name?: string | null },
  userClient: ReturnType<typeof createClient>
) {
  if (!thread.thread_id) return;
  const { error } = await userClient.from("agent_threads").insert({
    user_id: userId,
    agent_id: agentId,
    thread_id: String(thread.thread_id),
    version: Number(thread.version ?? 1),
    title: thread.name ?? null,
  });
  if (error) {
    console.error("agent_threads insert failed", error.code ?? error.message);
  }
}

/** Extract text from an array of stored AG-UI events. */
function extractTextFromEvents(events: unknown[]): string {
  let lastText = "";
  for (const raw of events ?? []) {
    let evt: { type?: string; message?: { content?: unknown } } = raw as never;
    if (typeof raw === "string") {
      try {
        evt = JSON.parse(raw);
      } catch {
        continue;
      }
    }
    const type = String(evt?.type ?? "").toLowerCase();
    const content = evt?.message?.content;
    if ((type.includes("message") || type.includes("text")) && content) {
      if (Array.isArray(content)) {
        const text = content
          .filter(
            (p: { type?: string; text?: string }) =>
              p?.type === "text" && typeof p.text === "string"
          )
          .map((p: { text: string }) => p.text)
          .join("\n");
        if (text) lastText = text;
      } else if (typeof content === "string" && content) {
        lastText = content;
      }
    }
  }
  return lastText;
}

function extractJson(text: string): unknown | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

function buildPrompt(emp: Record<string, unknown>): string {
  const context = {
    employee: {
      employee_code: emp.employee_code,
      name: emp.name,
      role: emp.role,
      tenure: emp.tenure,
      risk_score: emp.risk_score,
      status: emp.status,
    },
    telemetry: {
      overtime_spike_hours: Number(emp.overtime_spike),
      sentiment_drop_score: emp.sentiment_drop,
      peer_sentiment: emp.peer_sentiment,
      attendance_pattern: emp.attendance_pattern,
      skill_matrix: emp.skill_matrix,
    },
  };
  return [
    "You are the RetainIQ Qwen reasoning engine. Analyze the employee telemetry below",
    "and produce a structured retention-risk diagnostic.",
    "",
    "Reply with ONLY a single JSON object matching the schema below exactly.",
    "No markdown fences, no commentary, no trailing prose.",
    "",
    "Employee context (JSON):",
    JSON.stringify(context, null, 2),
    "",
    "Required output schema (replace the placeholder values with your analysis):",
    JSON.stringify(DIAGNOSTIC_SCHEMA, null, 2),
  ].join("\n");
}

/**
 * Phase 1: create the thread, fire the run, and return immediately.
 * The turn keeps executing in Enter Serving even after we disconnect.
 */
async function startDiagnose(
  agentId: string,
  userId: string,
  userClient: ReturnType<typeof createClient>,
  employeeId: string
) {
  const { data: emp, error: empError } = await userClient
    .from("employees")
    .select("*")
    .eq("employee_code", employeeId)
    .maybeSingle();
  if (empError || !emp) {
    throw errorJson("EMPLOYEE_NOT_FOUND", "Employee not found.", 404);
  }

  const thread = await createThread(agentId);
  if (thread.status >= 400) {
    throw errorJson("AGENT_THREAD_FAILED", "Failed to create agent thread.", 502);
  }
  await persistThread(userId, agentId, thread.body, userClient);
  const threadId = String(thread.body.thread_id);

  const prompt = buildPrompt(emp);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);
  try {
    const upstream = await fetch(enterUrl(`/agents/${agentId}/run`), {
      method: "POST",
      headers: { ...enterHeaders(), Accept: "text/event-stream" },
      signal: controller.signal,
      body: JSON.stringify({
        threadId,
        messages: [
          { id: `user-${Date.now()}`, role: "user", content: prompt },
        ],
        state: {},
        context: [],
        tools: [],
        forwardedProps: {},
      }),
    });
    if (!upstream.ok) {
      throw errorJson("AGENT_RUN_FAILED", "Agent run failed to start.", 502);
    }
    // Confirm the stream started, then disconnect; the turn continues in Serving.
    if (upstream.body) {
      const reader = upstream.body.getReader();
      await reader.read().catch(() => undefined);
      await reader.cancel().catch(() => undefined);
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      // Timed out waiting for the stream — the run may still have started.
    } else {
      throw err;
    }
  } finally {
    clearTimeout(timer);
  }

  return { threadId };
}

/**
 * Phase 2: short poll — returns instantly. Reports "running" until the turn
 * is terminal, then extracts the assistant JSON payload.
 */
async function pollDiagnose(
  agentId: string,
  threadId: string
) {
  const threadRes = await fetch(
    enterUrl(`/agents/${agentId}/threads/${threadId}`),
    { headers: enterHeaders() }
  );
  if (!threadRes.ok) {
    throw errorJson("AGENT_THREAD_FAILED", "Failed to read agent thread.", 502);
  }
  const thread = await threadRes.json().catch(() => ({}));

  if (thread?.running) {
    return { status: "running" };
  }
  const latest = Number(thread?.latest_history_turn_id ?? 0);
  if (latest <= 0) {
    return { status: "running" };
  }

  const turnsRes = await fetch(
    enterUrl(`/agents/${agentId}/threads/${threadId}/turns?start_turn=${latest}&end_turn=${latest}`),
    { headers: enterHeaders() }
  );
  if (!turnsRes.ok) {
    return { status: "running" };
  }
  const turnsBody = await turnsRes.json().catch(() => ({}));
  const turns = Array.isArray(turnsBody)
    ? turnsBody
    : (turnsBody as { turns?: unknown[] }).turns ?? [];
  const turn = turns[turns.length - 1] as
    | { status?: string; events?: unknown[] }
    | undefined;
  if (!turn) {
    return { status: "running" };
  }
  if (turn.status === "error" || turn.status === "failed") {
    return { status: "error", message: "Agent reported an error during the run." };
  }
  if (turn.status === "cancelled") {
    return { status: "error", message: "Agent run was cancelled." };
  }

  const text = extractTextFromEvents(turn.events ?? []);
  const payload = extractJson(text) ?? {
    raw_response: text,
    parse_status: "failed",
  };
  return { status: "done", payload };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return errorJson("METHOD_NOT_ALLOWED", "POST only.", 405);
  }

  try {
    const { user, userClient } = await authenticate(req);
    const body = await req.json().catch(() => ({}));
    const agentId = String(
      body.agentId ?? "ff08b4ab-1410-4d0d-9a88-ff4103ea0e64"
    );
    if (!ALLOWED_AGENT_IDS.has(agentId)) {
      return errorJson("AGENT_NOT_ALLOWED", "Agent not configured for this project.", 403);
    }

    const action = String(body.action ?? "");
    if (action === "startDiagnose") {
      const employeeId = String(body.employeeId ?? "");
      if (!employeeId) {
        return errorJson("BAD_REQUEST", "employeeId is required.", 400);
      }
      return json(await startDiagnose(agentId, user.id, userClient, employeeId));
    }

    if (action === "pollDiagnose") {
      const threadId = String(body.threadId ?? "");
      if (!threadId) {
        return errorJson("BAD_REQUEST", "threadId is required.", 400);
      }
      return json(await pollDiagnose(agentId, threadId));
    }

    if (action === "createThread") {
      const thread = await createThread(agentId);
      if (thread.status >= 400) return json(thread.body, thread.status);
      await persistThread(user.id, agentId, thread.body, userClient);
      return json(thread.body, thread.status);
    }

    return errorJson("BAD_REQUEST", "Unknown action.", 400);
  } catch (err) {
    if (err instanceof Response) {
      const body = await err.json().catch(() => null);
      console.error("custom-agent rejected request", err.status, body?.error_code);
      return err;
    }
    console.error("custom-agent proxy failed", err);
    return errorJson("PROXY_FAILED", "Custom-agent proxy failed.", 500);
  }
});
