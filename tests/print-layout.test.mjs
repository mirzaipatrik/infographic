import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const infographic = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout does not clip oversized category content", () => {
  assert.doesNotMatch(
    infographic,
    /print:\[grid-auto-rows:/,
    "printed grid rows must size to content instead of a fixed page slice",
  );
  assert.doesNotMatch(
    globals,
    /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s,
    "category columns must be allowed to fragment when they outgrow a printed page",
  );
  assert.match(infographic, /print:h-auto/, "category columns must not keep the screen h-full height when printing");
  assert.match(
    infographic,
    /print:overflow-visible/,
    "printed category columns must reveal content that exceeds the screen card bounds",
  );
});
