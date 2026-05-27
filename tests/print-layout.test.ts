import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout allows long category columns to grow instead of clipping content", () => {
  assert.doesNotMatch(infographicSource, /print:\[grid-auto-rows:142mm\]/);
  assert.doesNotMatch(infographicSource, /print-category-column/);
  assert.doesNotMatch(globalCss, /\.print-category-column/);

  const articleClass = infographicSource.match(/<article\s+className=\{`([^`]+)`\}/s)?.[1];
  assert.ok(articleClass, "Category article class should be present");
  assert.match(articleClass, /\bprint:overflow-visible\b/);
  assert.doesNotMatch(articleClass, /\bh-full\b/);
});
