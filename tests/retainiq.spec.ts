import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { skillAlignment, riskLevel } from "../src/lib/workforce";

const config = readFileSync(
  new URL("../src/integrations/supabase/client.ts", import.meta.url),
  "utf8",
);
const url = config.match(/SUPABASE_URL = "([^"]+)"/)![1];
const key = config.match(/SUPABASE_PUBLISHABLE_KEY = "([^"]+)"/)![1];

test("skill overlap uses unique normalized skills and consistent boundaries", () => {
  expect(
    skillAlignment(
      [" React ", "react", "TypeScript"],
      ["react", "REACT", "SQL"],
    ).match,
  ).toBe(50);
  expect(skillAlignment([], []).match).toBe(0);
  expect(skillAlignment(["SQL"], ["sql"]).gaps).toEqual([]);
  expect([30, 31, 70, 71].map(riskLevel)).toEqual([
    "Low",
    "Elevated",
    "Elevated",
    "Critical",
  ]);
});

test("public auth modes, mobile layout and keyboard controls", async ({
  page,
}) => {
  await page.goto("/auth?mode=signup");
  await expect(
    page.getByRole("heading", { name: "A better future starts here." }),
  ).toBeVisible();
  await page
    .getByLabel("Password", { exact: true })
    .fill("Example-password-only");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("button", { name: "Send reset link" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.goto("/deep-dive?employee=EMP-0187");
  await expect(page).toHaveURL(/\/auth/);
});

test("authenticated employee journey, real database cases and denied privilege escalation", async ({
  page,
}) => {
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const email = `retainiq-qa-${randomUUID().slice(0, 8)}@example.com`;
  const password = `${randomUUID()}Aa9!`;
  const signup = await client.auth.signUp({
    email,
    password,
    options: { data: { full_name: "RetainIQ QA Review" } },
  });
  expect(
    signup.error,
    "QA signup should succeed without exposing credentials",
  ).toBeNull();
  expect(
    signup.data.session,
    "Live workflow tests require an authenticated QA session",
  ).not.toBeNull();
  const identity = signup.data.user!.id;
  await page.goto("/auth");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in to your workspace" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/", { timeout: 30_000 });
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByText("Risk Radar")
    .click();
  await page.getByLabel("Search employees").fill("David");
  await expect(page.getByText("David Kim", { exact: true })).toBeVisible();
  await expect(page.getByText("Maya Chen", { exact: true })).toHaveCount(0);
  await page.getByText("David Kim", { exact: true }).click();
  await expect(page).toHaveURL(/employee=EMP-0187/);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByText("Mobility Matcher")
    .click();
  await expect(page).toHaveURL(/mobility-matcher\?employee=EMP-0187/);
  await expect(
    page.getByText("Principal ML Engineer", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByText("Action Center")
    .click();
  await page.getByRole("button", { name: "Create retention case" }).click();
  await expect(
    page.getByRole("button", { name: "Record completion", exact: true }),
  ).toHaveCount(4, { timeout: 30_000 });
  await page
    .getByRole("button", { name: "Record completion", exact: true })
    .first()
    .click();
  await page
    .getByLabel("What was completed? Add supporting evidence.")
    .fill(
      "QA verification only: manual confirmation recorded on a sample employee.",
    );
  await page.getByRole("button", { name: "Save recorded update" }).click();
  await expect(
    page.getByText("Human-recorded completion", { exact: true }),
  ).toBeVisible({ timeout: 15_000 });
  await page.reload();
  await expect(
    page.getByText("Human-recorded completion", { exact: true }),
  ).toBeVisible();
  const employee = await client
    .from("employees")
    .select("id")
    .eq("employee_code", "EMP-0187")
    .single();
  expect(employee.error).toBeNull();
  const cases = await Promise.all(
    Array.from({ length: 4 }, () =>
      client.rpc("start_retention_case", { p_employee_id: employee.data!.id }),
    ),
  );
  expect(cases.every((result) => !result.error)).toBe(true);
  expect(new Set(cases.map((result) => result.data)).size).toBe(1);
  const roleUpdate = await client
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", identity);
  expect(
    roleUpdate.error,
    "A member must not self-promote to admin",
  ).not.toBeNull();
  const directComplete = await client
    .from("workflows")
    .update({ status: "completed" })
    .eq("id", cases[0].data)
    .select("id");
  expect(
    directComplete.data?.length ?? 0,
    "Direct writes cannot complete a case",
  ).toBe(0);
  const tasks = await client
    .from("retention_tasks")
    .select("id")
    .eq("workflow_id", cases[0].data)
    .order("position");
  const remoteUpdate = await client.rpc("record_retention_task", {
    p_task_id: tasks.data![1].id,
    p_completed: true,
    p_evidence:
      "QA realtime check: sample action recorded through a separate client.",
  });
  expect(remoteUpdate.error).toBeNull();
  await expect(
    page.getByText("Human-recorded completion", { exact: true }),
  ).toHaveCount(2, { timeout: 20_000 });
  const forgedMapping = await client
    .from("agent_threads")
    .insert({
      agent_id: "ff08b4ab-1410-4d0d-9a88-ff4103ea0e64",
      thread_id: `qa-forged-${randomUUID()}`,
      user_id: identity,
      server_recorded: true,
    });
  expect(
    forgedMapping.error,
    "User-supplied thread ownership must not be trusted",
  ).not.toBeNull();
  const invalidNote = await client.rpc("record_retention_task", {
    p_task_id: tasks.data![0].id,
    p_completed: true,
    p_evidence: "short",
  });
  expect(invalidNote.error).not.toBeNull();
  await page.goto("/deep-dive?employee=NOT-AN-EMPLOYEE");
  await expect(
    page.getByText("No employee selected", { exact: true }),
  ).toBeVisible();
  await page.goto("/deep-dive?employee=EMP-0187");
  await page.getByRole("button", { name: "Run Qwen diagnostic" }).click();
  await expect(
    page
      .getByText("Diagnostic not available", { exact: true })
      .or(page.getByText("Recorded observations", { exact: true })),
  ).toBeVisible({ timeout: 110_000 });
  const failed = await page
    .getByText("Diagnostic not available", { exact: true })
    .isVisible();
  console.log(
    `Authenticated live agent outcome: ${failed ? await page.getByRole("alert").innerText() : "validated diagnostic received"}`,
  );
  await expect(page.getByText("cached_analysis")).toHaveCount(0);
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/auth/);
  await client.auth.signOut();
});
