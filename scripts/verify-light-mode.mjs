import { spawn } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";

const baseUrl = process.argv[2] || "http://127.0.0.1:3020";
const chromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const chromePath = chromePaths.find(existsSync);

if (!chromePath) {
  throw new Error("Google Chrome was not found.");
}

const profilesRoot = resolve(tmpdir());
const profilePath = mkdtempSync(join(profilesRoot, "mezzanail-light-mode-"));
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${profilePath}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const delay = (milliseconds) =>
  new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

async function waitForDevToolsPort() {
  const activePortPath = join(profilePath, "DevToolsActivePort");
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (existsSync(activePortPath)) {
      return readFileSync(activePortPath, "utf8").split(/\r?\n/)[0];
    }
    await delay(50);
  }
  throw new Error("Chrome DevTools did not start.");
}

async function createPageSession(port) {
  const target = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  ).then((response) => response.json());
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });

  let commandId = 0;
  const pendingCommands = new Map();
  const eventWaiters = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pendingCommands.has(message.id)) {
      const { resolveCommand, rejectCommand } = pendingCommands.get(message.id);
      pendingCommands.delete(message.id);
      if (message.error) rejectCommand(new Error(message.error.message));
      else resolveCommand(message.result);
      return;
    }
    const waiters = eventWaiters.get(message.method);
    if (waiters?.length) {
      const resolveEvent = waiters.shift();
      resolveEvent(message.params);
    }
  });

  const command = (method, params = {}) =>
    new Promise((resolveCommand, rejectCommand) => {
      commandId += 1;
      pendingCommands.set(commandId, { resolveCommand, rejectCommand });
      socket.send(JSON.stringify({ id: commandId, method, params }));
    });

  const waitForEvent = (method) =>
    new Promise((resolveEvent) => {
      const waiters = eventWaiters.get(method) || [];
      waiters.push(resolveEvent);
      eventWaiters.set(method, waiters);
    });

  return { command, socket, targetId: target.id, waitForEvent };
}

const scenarios = [
  {
    name: "iPhone Safari",
    width: 390,
    height: 844,
    mobile: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  },
  {
    name: "Android Chrome",
    width: 412,
    height: 915,
    mobile: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
  },
  {
    name: "Desktop Chrome",
    width: 1440,
    height: 1000,
    mobile: false,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  },
];

try {
  const port = await waitForDevToolsPort();
  const results = [];

  for (const scenario of scenarios) {
    const { command, socket, targetId, waitForEvent } = await createPageSession(port);
    await command("Page.enable");
    await command("Runtime.enable");
    await command("Network.enable");
    await command("Emulation.setDeviceMetricsOverride", {
      width: scenario.width,
      height: scenario.height,
      deviceScaleFactor: scenario.mobile ? 3 : 1,
      mobile: scenario.mobile,
    });
    await command("Emulation.setEmulatedMedia", {
      media: "screen",
      features: [{ name: "prefers-color-scheme", value: "dark" }],
    });
    await command("Network.setUserAgentOverride", {
      userAgent: scenario.userAgent,
    });

    let loaded = waitForEvent("Page.loadEventFired");
    await command("Page.navigate", { url: baseUrl });
    await loaded;
    await delay(250);

    await command("Runtime.evaluate", {
      expression:
        'localStorage.setItem("theme","dark");document.documentElement.classList.add("dark")',
    });

    loaded = waitForEvent("Page.loadEventFired");
    await command("Page.reload", { ignoreCache: true });
    await loaded;
    await delay(500);

    const evaluation = await command("Runtime.evaluate", {
      expression: `({
        htmlClass: document.documentElement.className,
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        bodyBackground: getComputedStyle(document.body).backgroundColor,
        bodyColor: getComputedStyle(document.body).color,
        storedTheme: localStorage.getItem("theme"),
        prefersDark: matchMedia("(prefers-color-scheme: dark)").matches,
        viewportWidth: window.innerWidth
      })`,
      returnByValue: true,
    });
    results.push({ device: scenario.name, ...evaluation.result.value });
    socket.close();
    await fetch(`http://127.0.0.1:${port}/json/close/${targetId}`);
  }

  console.table(results);

  for (const result of results) {
    if (!result.prefersDark) throw new Error(`${result.device} did not emulate Dark.`);
    if (result.htmlClass.split(/\s+/).includes("dark")) {
      throw new Error(`${result.device} retained the dark class.`);
    }
    if (!result.htmlClass.split(/\s+/).includes("light")) {
      throw new Error(`${result.device} is missing the light class.`);
    }
    if (result.colorScheme !== "light") {
      throw new Error(`${result.device} has color-scheme ${result.colorScheme}.`);
    }
    if (result.storedTheme !== null) {
      throw new Error(`${result.device} retained the legacy theme setting.`);
    }
    if (result.bodyBackground !== "rgb(255, 255, 255)") {
      throw new Error(`${result.device} has background ${result.bodyBackground}.`);
    }
    if (result.bodyColor !== "rgb(17, 17, 17)") {
      throw new Error(`${result.device} has text colour ${result.bodyColor}.`);
    }
  }
} finally {
  chrome.kill();
  await delay(200);
  const resolvedProfile = realpathSync(profilePath);
  const allowedPrefix = `${profilesRoot}${sep}`.toLowerCase();
  if (!resolvedProfile.toLowerCase().startsWith(allowedPrefix)) {
    throw new Error(`Refusing to remove unexpected profile path: ${resolvedProfile}`);
  }
  try {
    rmSync(resolvedProfile, { recursive: true, force: true });
  } catch {
    // Chrome may briefly retain a profile file on Windows; it is safe to leave it.
  }
}
