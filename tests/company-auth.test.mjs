import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(read("package.json"));
const access = read("config/auth/company-access.ts");
const permissions = read("lib/auth/permissions.ts");
const guards = read("lib/auth/guards.ts");
const navigation = read("config/winnie-navigation.ts");
const dashboard = read("app/manager/page.tsx");
const modulePage = read("app/manager/[module]/page.tsx");
const shell = read("components/winnie/manager-shell.tsx");
const login = read("components/winnie/manager-login.tsx");
const restricted = read("components/winnie/restricted-state.tsx");
const sessionProvider = read("components/winnie/session-provider.tsx");
const managerShell = read("components/winnie/manager-shell.tsx");
const apiSession = read("app/api/manager/session/route.ts");
const apiModule = read("app/api/manager/modules/[module]/route.ts");

test("Google company authentication has an explicit server-side allowlist", () => {
  assert.equal(packageJson.dependencies["next-auth"], "4.24.15");
  assert.match(access, /WINNIE_AUTH_ALLOWED_DOMAINS/);
  assert.match(access, /WINNIE_AUTH_ALLOWED_EMAILS/);
  assert.match(access, /WINNIE_AUTH_ROLE_MAP_JSON/);
  assert.match(access, /isCompanyAccountAllowed/);
  assert.match(access, /return false/);
  assert.doesNotMatch(access, /admin@|example\.com/);
});

test("roles and permissions are separate from Google identity", () => {
  for (const role of ["ADMIN", "MANAGER", "STAFF"]) assert.match(permissions, new RegExp(`\\b${role}\\b`));
  assert.match(permissions, /rolePermissions/);
  assert.match(permissions, /ADMIN:\s*allPermissions/);
  assert.match(permissions, /MANAGER:[\s\S]*member_credit\.view/);
  assert.doesNotMatch(permissions, /MANAGER:[\s\S]*member_credit\.manage/);
  assert.doesNotMatch(permissions, /STAFF:[\s\S]*member_credit\.view/);
  assert.doesNotMatch(permissions, /MANAGER:[\s\S]*permissions\.manage/);
});

test("server guards protect authentication and permissions", () => {
  assert.match(guards, /getServerSession\(authOptions\)/);
  assert.match(guards, /redirect\("\/manager\/login"\)/);
  assert.match(guards, /requireWinniePermission/);
  assert.match(guards, /requireWinnieRole/);
  assert.match(guards, /manager\/restricted/);
  assert.match(guards, /status: 401/);
  assert.match(guards, /status: 403/);
  assert.match(dashboard, /requireWinniePermission\("dashboard\.view"\)/);
  assert.match(modulePage, /requireWinniePermission\(item\.permission\)/);
});

test("navigation is permission-driven and hides inaccessible modules", () => {
  assert.match(navigation, /permission: "member_credit\.view"/);
  assert.match(navigation, /permission: "finance\.view"/);
  assert.match(shell, /winnieNavigationItems\.filter/);
  assert.match(shell, /hasPermission\(user\.permissions/);
  assert.match(shell, /roleLabel\(user\.role\)/);
});

test("login, session refresh and restricted access copy are present", () => {
  assert.match(login, /Winnie AI Manager/);
  assert.match(login, /Mezzanail Internal Management System/);
  assert.match(login, /Continue with Google/);
  assert.match(login, /Authorized Mezzanail staff only/);
  assert.match(sessionProvider, /refetchOnWindowFocus/);
  assert.match(sessionProvider, /refetchInterval/);
  assert.match(restricted, /Access Restricted/);
  assert.match(restricted, /Your Google account is recognized/);
  assert.match(managerShell, /My Profile/);
  assert.equal(existsSync(new URL("../app/manager/profile/page.tsx", import.meta.url)), true);
});

test("sensitive actions expose audit-ready metadata without business mutations", () => {
  const guard = read("components/winnie/sensitive-action-guard.tsx");
  assert.match(guard, /actorUserId/);
  assert.match(guard, /action/);
  assert.match(guard, /target/);
  assert.match(guard, /timestamp/);
  assert.match(guard, /does not change any business data/);
});

test("manager APIs are no-store and server-authorized", () => {
  assert.match(apiSession, /getWinnieSession/);
  assert.match(apiSession, /Cache-Control.*no-store/);
  assert.match(apiModule, /authorizeWinnieApi\(item\.permission\)/);
  assert.match(apiModule, /status: 404/);
  assert.match(apiModule, /Cache-Control.*no-store/);
});

test("manager routes and NextAuth handler exist", () => {
  assert.equal(existsSync(new URL("../app/manager/login/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../app/api/auth/[...nextauth]/route.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../types/next-auth.d.ts", import.meta.url)), true);
});
