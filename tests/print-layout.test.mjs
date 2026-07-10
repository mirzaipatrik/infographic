import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const infographicSource = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalsSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print category cards can grow instead of clipping overflowing content", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:/,
    "print grid rows must not be fixed because tall user-authored categories get clipped",
  );

  assert.match(
    infographicSource,
    /print:h-auto/,
    "category cards should drop screen-only full-height stretching in print",
  );

  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "category cards must not hide overflowing print content",
  );

  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s,
    "whole category cards should be allowed to fragment across pages when content is tall",
  );
});
