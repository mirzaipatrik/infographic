import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout allows long infographic content to flow instead of clipping", () => {
  assert.equal(
    infographicSource.includes("print:[grid-auto-rows:142mm]"),
    false,
    "print grid rows must not be fixed to a page-fragment height",
  );
  assert.equal(
    infographicSource.includes("print-category-column"),
    false,
    "whole category columns must not be marked unbreakable in print",
  );
  assert.equal(
    globalCss.includes(".print-category-column"),
    false,
    "global print CSS must not prevent category columns from breaking across pages",
  );
  assert.match(
    infographicSource,
    /overflow-hidden[^`]*print:overflow-visible/,
    "rounded cards may hide overflow on screen, but print must expose overflowing content",
  );
});
