import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalsSource = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout lets long category content flow instead of clipping it", () => {
  assert.ok(
    infographicSource.includes("print:h-auto"),
    "category cards must be allowed to grow to their printed content height",
  );
  assert.ok(
    infographicSource.includes("print:overflow-visible"),
    "category cards must not hide overflowing content in printed/PDF output",
  );
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "fixed print grid row heights can silently truncate user-authored category content",
  );
  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column\s*\{[\s\S]*?break-inside:\s*avoid/,
    "entire category columns must be allowed to split across pages when content is long",
  );
});
