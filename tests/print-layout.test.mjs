import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographic = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout allows category cards to grow instead of clipping content", () => {
  assert.match(infographic, /print:overflow-visible/);
  assert.doesNotMatch(infographic, /print:\[grid-auto-rows:/);
  assert.doesNotMatch(infographic, /print-category-column/);
});

test("print page-break avoidance stays scoped to subcategory cards", () => {
  assert.doesNotMatch(globals, /\.print-category-column/);
  assert.match(infographic, /print:break-inside-avoid/);
});
