import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const infographic = readFileSync("components/Infographic.tsx", "utf8");
const globalCss = readFileSync("app/globals.css", "utf8");

test("print layout does not cap category rows to a fixed height", () => {
  assert.doesNotMatch(infographic, /print:\[grid-auto-rows:/);
});

test("category columns can expose overflowing print content instead of clipping it", () => {
  assert.match(infographic, /print:overflow-visible/);
});

test("print styles do not prevent full category columns from paginating", () => {
  assert.doesNotMatch(globalCss, /\.print-category-column/);
});
