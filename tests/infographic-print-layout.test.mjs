import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print grid rows are content-sized instead of fixed-height clipping rows", () => {
  assert.doesNotMatch(infographicSource, /print:\[grid-auto-rows:[^\]]+\]/);
  assert.match(infographicSource, /print:auto-rows-auto/);
});

test("printed category cards can expand and reveal overflowing content", () => {
  const articleClass = infographicSource.match(/className=\{`print-category-column[^`]+`\}/)?.[0] ?? "";

  assert.match(articleClass, /overflow-hidden/);
  assert.match(articleClass, /print:h-auto/);
  assert.match(articleClass, /print:overflow-visible/);
});

test("long printed categories may fragment across pages", () => {
  const printColumnRule = globalCss.match(/\.print-category-column\s*\{[^}]+\}/)?.[0] ?? "";

  assert.match(printColumnRule, /break-inside:\s*auto/);
  assert.match(printColumnRule, /page-break-inside:\s*auto/);
});
