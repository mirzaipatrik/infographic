import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");

test("print layout does not clip overflowing category content", () => {
  assert.equal(
    infographicSource.includes("print:[grid-auto-rows:142mm]"),
    false,
    "fixed print rows can silently clip user-authored content",
  );
  assert.equal(
    infographicSource.includes("print-category-column"),
    false,
    "whole-column break avoidance can prevent long categories from flowing across print pages",
  );
  assert.match(
    infographicSource,
    /overflow-hidden[^\n`]*print:overflow-visible/,
    "category cards should keep rounded overflow on screen while allowing print overflow to remain visible",
  );
});
