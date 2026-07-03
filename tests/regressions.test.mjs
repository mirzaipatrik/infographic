import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const infographicSource = await readFile(
  new URL("../components/Infographic.tsx", import.meta.url),
  "utf8",
);
const globalsSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout does not clip oversized category content", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "fixed print grid rows can truncate user-authored category content",
  );
  assert.doesNotMatch(
    infographicSource,
    /\bh-full\b/,
    "full-height category cards inherit fixed row heights and can hide overflow",
  );
  assert.match(
    infographicSource,
    /overflow-hidden[^`]*print:overflow-visible/,
    "screen-only card clipping must be disabled for print pagination",
  );
  assert.doesNotMatch(
    infographicSource,
    /print-category-column/,
    "category-level break avoidance prevents long categories from flowing across pages",
  );
  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column/,
    "category-level break avoidance prevents long categories from flowing across pages",
  );
});
