import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print category cards can grow and flow across pages", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "print grid rows must not be fixed, or edited category content can be clipped",
  );
  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "category cards need visible overflow in print so long content is not hidden",
  );
  assert.doesNotMatch(
    globalCss,
    /\.print-category-column\s*\{[^}]*break-inside\s*:\s*avoid/s,
    "whole category columns must be allowed to fragment across printed pages",
  );
});
