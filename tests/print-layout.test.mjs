import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const infographicSource = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout lets category content flow instead of clipping fixed-height rows", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "print grid rows must stay content-sized so long categories can continue onto later pages",
  );
  assert.doesNotMatch(
    infographicSource,
    /className=\{`[^`]*\bh-full\b[^`]*`\}/,
    "category cards must not stretch to a fixed row height in print",
  );
  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "category cards must allow overflowing content to remain visible in printed output",
  );
  assert.doesNotMatch(
    globalCss,
    /\.print-category-column\s*\{[\s\S]*?break-inside:\s*avoid/,
    "whole category columns must be allowed to split when they exceed a page",
  );
});
