import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";

const CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const viewports = [
  { name: "desktop", width: 1536, height: 1024, mobile: false },
  { name: "tablet", width: 1024, height: 1366, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const targetUrl = process.argv[2] ?? "http://127.0.0.1:3010/";
const outputDir = path.resolve("test-results");

function availableBrowser() {
  const browser = CHROME_PATHS.find((candidate) => existsSync(candidate));
  if (!browser) throw new Error("Chrome or Edge is required for homepage visual capture.");
  return browser;
}

async function reservePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => {
        if (error) reject(error);
        else if (port) resolve(port);
        else reject(new Error("Unable to reserve a Chrome debugging port."));
      });
    });
  });
}

async function waitForJson(url, attempts = 80) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {
      // Chrome may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 125));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function openPage(port) {
  const response = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  );
  if (!response.ok) throw new Error(`Unable to create Chrome page: ${response.status}`);
  return response.json();
}

function connectCdp(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  let commandId = 0;
  const pending = new Map();
  const listeners = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
      return;
    }
    const handlers = listeners.get(message.method) ?? [];
    handlers.forEach((handler) => handler(message.params));
  });

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  function send(method, params = {}) {
    commandId += 1;
    const id = commandId;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  function once(method) {
    return new Promise((resolve) => {
      const handlers = listeners.get(method) ?? [];
      const handler = (params) => {
        listeners.set(method, handlers.filter((item) => item !== handler));
        resolve(params);
      };
      listeners.set(method, [...handlers, handler]);
    });
  }

  return { socket, ready, send, once };
}

async function captureViewport(cdp, viewport) {
  const blankLoaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url: "about:blank" });
  await blankLoaded;

  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
    screenWidth: viewport.width,
    screenHeight: viewport.height,
  });
  await cdp.send("Emulation.setTouchEmulationEnabled", {
    enabled: viewport.mobile,
    maxTouchPoints: viewport.mobile ? 5 : 1,
  });

  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__mnVitals = { cls: 0, lcp: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__mnVitals.cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__mnVitals.lcp = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    `,
  });

  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url: targetUrl });
  await loaded;
  await cdp.send("Runtime.evaluate", {
    expression: "document.fonts.ready",
    awaitPromise: true,
    returnByValue: true,
  });
  await new Promise((resolve) => setTimeout(resolve, 1800));
  await cdp.send("Runtime.evaluate", {
    expression: `(async () => {
      const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
      const step = Math.max(400, window.innerHeight * 0.75);
      for (let top = 0; top < document.documentElement.scrollHeight; top += step) {
        window.scrollTo(0, top);
        await delay(90);
      }
      document.querySelector("#studio")?.scrollIntoView({ block: "center" });
      await delay(900);
      await Promise.all([...document.images].map(async (image) => {
        if (!image.complete) {
          await Promise.race([
            new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            }),
            delay(2500),
          ]);
        }
        try {
          await Promise.race([image.decode(), delay(2500)]);
        } catch {
          // A failed decorative image is still reported by the screenshot.
        }
      }));
      window.scrollTo(0, 0);
      await delay(350);
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });

  const { result } = await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const root = document.documentElement;
      const targets = [...document.querySelectorAll("a, button")]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            label: (element.getAttribute("aria-label") || element.textContent || "").trim().slice(0, 80),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            visible: style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0,
          };
        })
        .filter((item) => item.visible && (item.width < 44 || item.height < 44));
      return {
        title: document.title,
        h1Count: document.querySelectorAll("h1").length,
        sectionHeadings: [...document.querySelectorAll(".homepage-quiet h2")].map((node) => node.textContent.trim()),
        viewportWidth: root.clientWidth,
        pageWidth: root.scrollWidth,
        horizontalOverflow: Math.max(0, root.scrollWidth - root.clientWidth),
        pageHeight: Math.max(root.scrollHeight, document.body.scrollHeight),
        bannerResources: performance.getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((name) => name.includes("7th-anniversary")),
        studioImage: (() => {
          const image = document.querySelector(".studio-image img");
          return image ? {
            complete: image.complete,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            currentSrc: image.currentSrc,
          } : null;
        })(),
        vitals: window.__mnVitals,
        smallTargets: targets,
      };
    })()`,
    returnByValue: true,
  });

  const metrics = await cdp.send("Page.getLayoutMetrics");
  const contentHeight = Math.ceil(metrics.cssContentSize.height);
  const screenshot = await cdp.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: viewport.width,
      height: contentHeight,
      scale: 1,
    },
  });

  const screenshotPath = path.join(outputDir, `homepage-${viewport.name}.png`);
  await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));

  if (viewport.name === "desktop") {
    await cdp.send("Runtime.evaluate", {
      expression: `document.querySelector("#studio")?.scrollIntoView({ block: "center" })`,
      returnByValue: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 650));
    const studioScreenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(outputDir, "homepage-studio-section.png"),
      Buffer.from(studioScreenshot.data, "base64"),
    );
  }

  return {
    viewport,
    screenshot: screenshotPath,
    screenshotHeight: contentHeight,
    ...result.value,
  };
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const port = await reservePort();
  const profileDir = await mkdtemp(path.join(os.tmpdir(), "mn-homepage-qa-"));
  const browser = availableBrowser();
  const processHandle = spawn(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-background-networking",
      "--hide-scrollbars",
      "--no-first-run",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      "about:blank",
    ],
    { stdio: "ignore", windowsHide: true },
  );

  try {
    await waitForJson(`http://127.0.0.1:${port}/json/version`);
    const page = await openPage(port);
    const cdp = connectCdp(page.webSocketDebuggerUrl);
    await cdp.ready;
    await Promise.all([
      cdp.send("Page.enable"),
      cdp.send("Runtime.enable"),
      cdp.send("Performance.enable"),
    ]);

    const results = [];
    for (const viewport of viewports) {
      results.push(await captureViewport(cdp, viewport));
    }
    cdp.socket.close();

    const reportPath = path.join(outputDir, "homepage-visual-metrics.json");
    await writeFile(reportPath, `${JSON.stringify({ targetUrl, results }, null, 2)}\n`);
    console.log(JSON.stringify({ reportPath, results }, null, 2));
  } finally {
    processHandle.kill();
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      await rm(profileDir, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 200,
      });
    } catch (error) {
      console.warn(`Temporary Chrome profile could not be removed: ${error.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
