import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");

test("print layout does not clip overflowing category content", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "fixed print grid rows can silently truncate long user-authored categories",
  );
  assert.match(infographicSource, /print:h-auto/);
  assert.match(infographicSource, /print:overflow-visible/);
});
