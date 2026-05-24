import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCssSource = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print grid rows are sized by content", () => {
  assert.doesNotMatch(infographicSource, /print:\[grid-auto-rows:/);
});

test("category shells do not clip overflowing content in print", () => {
  const articleClass = infographicSource.match(/<article\s+className=\{`([^`]+)`\}/s)?.[1];

  assert.ok(articleClass, "expected CategoryColumn article class to be present");
  assert.doesNotMatch(articleClass, /(?:^|\s)h-full(?:\s|$)/);
  assert.match(articleClass, /(?:^|\s)print:overflow-visible(?:\s|$)/);
});

test("printed categories can fragment across pages", () => {
  assert.doesNotMatch(infographicSource, /print-category-column/);
  assert.doesNotMatch(
    globalCssSource,
    /\.print-category-column\s*\{[\s\S]*?break-inside:\s*avoid/,
  );
});
