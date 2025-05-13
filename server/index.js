const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const browser = await puppeteer.launch({
      headless: "new", // Puppeteer v20+
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
    const screenshot = await page.screenshot({ fullPage: true });

    await browser.close();
    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (err) {
    console.error("Screenshot error:", err);
    res.status(500).send("Failed to capture screenshot");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Screenshot server running at http://localhost:${PORT}`);
});
