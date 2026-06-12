import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const infographicSource = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalsSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print categories are allowed to flow instead of clipping content", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:/,
    "the print grid must not force fixed row heights",
  );
  assert.doesNotMatch(
    infographicSource,
    /print-category-column/,
    "the whole category column must not opt out of page breaks",
  );
  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "category shells should let overflowing print content remain visible",
  );
  assert.match(
    infographicSource,
    /print:break-inside-avoid/,
    "individual subcategory cards can still stay together when they fit",
  );
  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column\s*\{/,
    "print break avoidance should not apply to an entire category column",
  );
});
