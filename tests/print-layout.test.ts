import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("print layout does not impose a fixed row height that can clip categories", async () => {
  const component = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(component, /print:\[grid-auto-rows:/);
  assert.match(component, /print:h-auto/);
  assert.match(component, /print:overflow-visible/);
});

test("print category columns may fragment across pages when content is long", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.print-category-column\s*\{[^}]*break-inside:\s*auto;/s);
  assert.match(css, /\.print-category-column\s*\{[^}]*height:\s*auto !important;/s);
  assert.match(css, /\.print-category-column\s*\{[^}]*overflow:\s*visible !important;/s);
});
