import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalsSource = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout allows oversized category content to flow instead of clipping", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:\d+(?:\.\d+)?mm\]/,
    "fixed millimeter print rows can hide user-authored content that exceeds the row height",
  );
  assert.match(
    infographicSource,
    /print:h-auto/,
    "category cards need an auto print height so long content can expand",
  );
  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "category cards must not keep screen overflow clipping when printed",
  );
  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s,
    "oversized category cards must be allowed to break across printed pages",
  );
});
