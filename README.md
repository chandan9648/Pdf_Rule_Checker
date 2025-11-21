# PDF Rule Checker (Full stack)

This repository contains a simple full-stack app that:
- Accepts a PDF and 3 rules.
- Extracts per-page text using pdfjs.
- Runs deterministic heuristics and asks an LLM for judgement.
- Returns PASS/FAIL per rule with evidence, reasoning, and confidence.

Quick start

1. Backend
   - cd backend
   - cp .env.example .env (then set OPENAI_API_KEY)
   - npm install
   - npm run dev

2. Frontend
   - cd frontend
   - npm install
   - npm run dev
   - Open the port shown by Vite (default: http://localhost:5173)

Notes
- For quick testing you may download the sample PDF the server exposes via GET /api/sample-file. The server will respond with `file:///mnt/data/34309cd0-aa7a-4142-89e1-d8402bd15aaa.pdf` which is the file path of the spec you uploaded earlier.
- The backend deletes uploaded files after processing.
- The LLM may occasionally return non-JSON — backend tries to handle this gracefully and falls back to local heuristics.

Security
- Do not use untrusted model outputs as sole source of truth in production.
- Make sure to secure your OpenAI key and rate-limit calls in production.

Happy testing!
