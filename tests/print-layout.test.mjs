import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout does not clip overflowing category content", () => {
  assert.ok(
    infographicSource.includes("print:h-auto") && infographicSource.includes("print:overflow-visible"),
    "printed category columns must be allowed to grow and show overflowing content",
  );
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "printed grid rows must not be fixed to a page fraction because long content is clipped",
  );
  assert.doesNotMatch(
    globalCss,
    /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s,
    "printed category columns must be allowed to fragment across pages",
  );
});
