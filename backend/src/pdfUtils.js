// pdfUtils.js
import fs from "fs";
import path from "path";
import { getDocument } from "pdfjs-dist";
import { TextDecoder } from "util";

// pdfjs-dist expects a Node-compatible fetch; getDocument accepts file path in Node
export async function extractPagesFromPdf(filePath, maxPageChars = 3500) {
  // returns array: [{page:1, text: '...'}, ...]
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = getDocument({ data });
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;
  const pages = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(i => i.str);
    let text = strings.join(" ").replace(/\s+/g, " ").trim();
    // trim to maxPageChars to avoid mega prompts
    if (text.length > maxPageChars) text = text.slice(0, maxPageChars) + " ...";
    pages.push({ page: i, text });
  }
  return pages;
}
