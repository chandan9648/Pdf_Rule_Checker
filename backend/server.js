// server.js
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import sanitize from "sanitize-filename";

import { extractPagesFromPdf } from "./src/pdfUtils.js";
import { askModelForRuleEval } from "./src/llm.js";
import { safeJsonParse, splitSentences } from "./src/helpers.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.TEMP_UPLOAD_DIR || "./uploads";
const MODEL_NAME = process.env.MODEL_NAME || "gpt-4o-mini";
const MAX_PAGE_CHARS = parseInt(process.env.MAX_PAGE_CHARS || "3500", 10);

await fs.mkdir(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = sanitize(Date.now() + "-" + file.originalname);
    cb(null, safe);
  }
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Main endpoint
app.post("/api/check", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    const rules = [req.body.rule1, req.body.rule2, req.body.rule3].filter(Boolean);
    if (rules.length === 0) return res.status(400).json({ error: "No rules provided." });

    const filePath = path.resolve(req.file.path);
    // Extract page-wise text
    const pages = await extractPagesFromPdf(filePath, MAX_PAGE_CHARS);

    const results = [];
    for (const rule of rules) {
      // 1) Deterministic local evidence search
      let localEvidence = null;
      const lowerRule = rule.toLowerCase();

      // Example heuristics: date detection, keyword presence
      for (const p of pages) {
        const sentences = splitSentences(p.text);
        for (const s of sentences) {
          // date check example
          if (lowerRule.includes("date") && /\b(19|20)\d{2}\b/.test(s)) {
            localEvidence = { sentence: s, page: p.page, reason: "regex-date" };
            break;
          }
          // keywords match
          const keywords = ["purpose", "owner", "responsible", "issued", "effective", "expiry", "email", "contact"];
          for (const kw of keywords) {
            if (lowerRule.includes(kw) && s.toLowerCase().includes(kw)) {
              localEvidence = { sentence: s, page: p.page, reason: `keyword:${kw}` };
              break;
            }
          }
          if (localEvidence) break;
        }
        if (localEvidence) break;
      }

      // 2) Ask LLM for final judgement (include localEvidence to help)
      let modelOut = null;
      try {
        modelOut = await askModelForRuleEval(MODEL_NAME, rule, pages, localEvidence);
      } catch (err) {
        console.warn("LLM call failed:", err?.message || err);
        modelOut = null;
      }

      // 3) Fallback if modelOut null
      if (!modelOut) {
        const fallback = {
          rule,
          status: localEvidence ? "pass" : "fail",
          evidence: localEvidence ? `page ${localEvidence.page}: "${localEvidence.sentence}"` : "No evidence found",
          reasoning: localEvidence ? `Matched using local heuristic (${localEvidence.reason}).` : "No local evidence found; model unavailable.",
          confidence: localEvidence ? 75 : 20
        };
        results.push(fallback);
      } else {
        // modelOut is expected to contain: rule,status,evidence,reasoning,confidence
        // Normalize minimal fields if missing
        results.push({
          rule: modelOut.rule ?? rule,
          status: (modelOut.status ?? "fail").toLowerCase(),
          evidence: modelOut.evidence ?? (localEvidence ? `page ${localEvidence.page}: "${localEvidence.sentence}"` : "No evidence found"),
          reasoning: modelOut.reasoning ?? (localEvidence ? `Matched locally: ${localEvidence.reason}` : ""),
          confidence: typeof modelOut.confidence === "number" ? Math.max(0, Math.min(100, Math.round(modelOut.confidence))) : (localEvidence ? 75 : 20)
        });
      }
    }

    // delete uploaded file
    await fs.unlink(filePath).catch(() => {});

    return res.json({ results, pagesCount: pages.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
});

// Expose the uploaded sample file path that exists in this environment (the file you uploaded)
// Developer note: using the exact path the user uploaded earlier.
app.get("/api/sample-file", (req, res) => {
  const samplePath = "/mnt/data/34309cd0-aa7a-4142-89e1-d8402bd15aaa.pdf";
  res.json({ path: `file://${samplePath}`, note: "Use this URL in file upload widgets or for testing by downloading the file first." });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
