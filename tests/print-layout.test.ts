import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalStyles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout does not constrain category cards to a fixed row height", () => {
  assert.equal(infographicSource.includes("print:[grid-auto-rows:"), false);
});

test("print category cards can expand instead of clipping long content", () => {
  assert.equal(infographicSource.includes("print:overflow-visible"), true);
  assert.equal(infographicSource.includes("print-category-column"), false);
  assert.equal(globalStyles.includes(".print-category-column"), false);
});
