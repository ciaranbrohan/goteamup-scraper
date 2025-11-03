// scrape-month-events.js
require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("node:fs/promises");

const EMAIL = process.env.TEAMUP_EMAIL || "ciaran@t45jiujitsu.ie";
const PASSWORD = process.env.TEAMUP_PASSWORD; // set this in env, not in code

async function getMonthEvents() {
  const launchArgs = [
    "--no-sandbox",               // required on many VPS
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",    // avoids /dev/shm small tmpfs issues
    "--no-zygote",
    "--single-process",           // reduces RAM; remove if it crashes on your box
    "--disable-gpu",
  ];

  let browser;
  let page;

  // hard stop after N seconds no matter what
  const HARD_TIMEOUT_MS = 60_000;
  const hardTimeout = setTimeout(() => {
    try { browser && browser.process() && browser.process().kill("SIGKILL"); } catch {}
  }, HARD_TIMEOUT_MS);

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: launchArgs,
    });
    page = await browser.newPage();

    // Be strict with timeouts
    page.setDefaultNavigationTimeout(30_000);
    page.setDefaultTimeout(30_000);

    // Block heavy resources
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (type === "image" || type === "font" || type === "media" || type === "stylesheet") {
        return req.abort();
      }
      req.continue();
    });

    await page.goto("https://goteamup.com/providers/calendar/", { waitUntil: "domcontentloaded" });

    // Fill login more deterministically than Tab/Enter
    await page.waitForSelector("#id_email-email");
    await page.type("#id_email-email", EMAIL, { delay: 15 });

    // If the form shows a next/continue, submit it; otherwise just proceed
    await Promise.race([
      page.click('button[type="submit"]').catch(() => {}),
      page.keyboard.press("Enter").catch(() => {}),
      new Promise((r) => setTimeout(r, 500)),
    ]);

    // Password step
    await page.waitForSelector("#id_login-password");
    if (!PASSWORD) throw new Error("Missing TEAMUP_PASSWORD env var");
    await page.type("#id_login-password", PASSWORD, { delay: 15 });
    await Promise.race([
      page.click('button[type="submit"]').catch(() => {}),
      page.keyboard.press("Enter").catch(() => {}),
    ]);

    // Wait for calendar events (use a reasonable timeout)
    await page.waitForSelector(".calendar-event", { timeout: 20_000 });

    const events = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll(".calendar-event"));
      return rows.map((el) => ({
        id: el.getAttribute("href")?.replace("/providers/events/", "").replace("/", "") || null,
        title: el.querySelector(".title")?.innerHTML?.trim() || "",
        time: el.querySelector(".time-range")?.innerHTML?.trim() || "",
        instructor: el.querySelector(".instructors li")?.innerHTML?.trim() || "",
        members: el.querySelector(".users li")[0]?.innerText?.trim() || "",
      }));
    });

    return events;
  } finally {
    clearTimeout(hardTimeout);
    try { page && !page.isClosed() && (await page.close()); } catch {}
    try { browser && (await browser.close()); } catch {}
  }
}

(async () => {
  try {
    const events = await getMonthEvents();
    await fs.writeFile("month-events.json", JSON.stringify(events, null, 2));
    console.log(`Saved ${events.length} events`);
  } catch (err) {
    console.error("Scrape failed:", err.message);
    process.exitCode = 1;
  }
})();
