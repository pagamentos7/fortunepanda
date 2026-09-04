const fs = require("fs");
const puppeteer = require("puppeteer-core");

const candidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
].filter(Boolean);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

(async () => {
  const exe = candidates.find((p) => fs.existsSync(p));
  if (!exe) {
    console.error("NO_BROWSER");
    process.exit(2);
  }
  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("requestfailed", (req) => errors.push("FAIL " + req.url() + " " + req.failure()?.errorText));
  await page.setViewport({ width: 430, height: 800 });
  await page.goto("http://127.0.0.1:3000/?v=10", { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(800);

  const bootDump = await page.evaluate(() => ({
    gameJs: [...document.scripts].map((s) => s.src),
    gameType: typeof window.Game,
    skyType: typeof window.Sky,
    errorsNow: window.__skyErrs || null
  }));
  console.error("BOOT", JSON.stringify(bootDump), "PAGEERR", JSON.stringify(errors));

  const viaApi = await page.evaluate(() => {
    try {
      window.Sky.play();
      return {
        playing: window.Game?.isPlaying?.() ?? null,
        overlayHidden: document.getElementById("hub-overlay")?.classList.contains("hidden"),
        menu: document.querySelector(".game-panel")?.classList.contains("menu")
      };
    } catch (e) {
      return { err: String(e) };
    }
  });
  console.error("VIA_SKY", JSON.stringify(viaApi));

  await page.goto("http://127.0.0.1:3000/?v=10", { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(600);

  const pre = await page.evaluate(() => {
    const start = document.getElementById("start-btn");
    const overlay = document.getElementById("hub-overlay");
    const r = start.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      sky: typeof window.Sky?.play,
      game: typeof window.Game?.play,
      title: document.getElementById("hub-title")?.textContent,
      startText: start?.textContent?.trim(),
      overlayHidden: overlay.classList.contains("hidden"),
      overlayDisplay: getComputedStyle(overlay).display,
      hitTag: top?.tagName,
      hitId: top?.id,
      hitClass: typeof top?.className === "string" ? top.className : "",
      sheets: [...document.querySelectorAll(".sheet")].map((s) => ({
        id: s.id,
        hidden: s.hidden,
        display: getComputedStyle(s).display,
        pe: getComputedStyle(s).pointerEvents
      })),
      startOpacity: getComputedStyle(start).opacity,
      startPe: getComputedStyle(start).pointerEvents,
      startSize: { w: Math.round(r.width), h: Math.round(r.height) }
    };
  });

  await page.$eval("#start-btn", (el) => el.click());
  await sleep(400);
  const afterPlay = await page.evaluate(() => ({
    overlayHidden: document.getElementById("hub-overlay")?.classList.contains("hidden"),
    overlayDisplay: document.getElementById("hub-overlay")
      ? getComputedStyle(document.getElementById("hub-overlay")).display
      : "missing",
    playing: window.Game?.isPlaying?.() ?? null,
    gameType: typeof window.Game,
    panelMenu: document.querySelector(".game-panel")?.classList.contains("menu")
  }));

  await page.goto("http://127.0.0.1:3000/?v=10", { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(800);
  await page.click('[data-sheet="skins"]');
  await sleep(400);
  const sheetOpen = await page.evaluate(() => {
    const s = document.getElementById("sheet-skins");
    return {
      hidden: s.hidden,
      display: getComputedStyle(s).display,
      homeDisplay: getComputedStyle(document.getElementById("hub-home")).display,
      cards: document.querySelectorAll(".skin-card").length,
      overlayHidden: document.getElementById("hub-overlay").classList.contains("hidden")
    };
  });
  await page.click("#sheet-skins .sheet-back");
  await sleep(250);
  const sheetClosed = await page.evaluate(() => ({
    hidden: document.getElementById("sheet-skins").hidden,
    display: getComputedStyle(document.getElementById("sheet-skins")).display,
    homeDisplay: getComputedStyle(document.getElementById("hub-home")).display
  }));

  const api = await page.evaluate(async () => {
    const r = await fetch("/api/catalog");
    const j = await r.json();
    return { ok: r.ok, skins: j.skins?.length || 0 };
  });

  const report = { exe, viaApi, pre, afterPlay, sheetOpen, sheetClosed, api, errors };
  console.log(JSON.stringify(report, null, 2));

  const ok =
    viaApi.playing === true &&
    viaApi.overlayHidden === true &&
    viaApi.menu === false &&
    afterPlay.playing === true &&
    afterPlay.overlayHidden === true &&
    afterPlay.panelMenu === false &&
    pre.sheets.every((s) => s.display === "none") &&
    sheetOpen.display !== "none" &&
    sheetOpen.cards >= 5 &&
    sheetClosed.hidden === true &&
    api.ok === true;

  await browser.close();
  if (!ok) {
    console.error("FLOW_FAIL");
    process.exit(1);
  }
  console.error("FLOW_OK");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
