import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const infographicSource = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout lets category columns grow with user-authored content", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "print grid rows must not be fixed because taller category content gets clipped",
  );

  assert.match(
    infographicSource,
    /print:h-auto/,
    "category columns should opt out of full-height stretching when printed",
  );

  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "category columns should not clip overflowing print content",
  );

  assert.doesNotMatch(
    globalCss,
    /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s,
    "full category columns must be allowed to fragment across printed pages",
  );
});
