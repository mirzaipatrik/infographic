import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const infographicSource = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalsSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout does not clamp category content to fixed grid rows", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "print grid rows must remain content-sized so long categories can flow across pages",
  );
});

test("category cards keep overflow visible in print", () => {
  assert.match(
    infographicSource,
    /overflow-hidden[^`"]*print:overflow-visible/,
    "screen overflow clipping must be disabled for print output",
  );
});

test("print pagination is not blocked at the whole-category level", () => {
  assert.doesNotMatch(
    infographicSource,
    /print-category-column/,
    "whole category cards should not opt out of print pagination",
  );
  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column\s*\{/,
    "global print CSS should not prevent category cards from splitting across pages",
  );
});
