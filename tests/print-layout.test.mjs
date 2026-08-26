import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const infographicSource = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalsSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print category cards can grow instead of clipping overflowing content", () => {
  assert.match(
    infographicSource,
    /print:h-auto/,
    "category cards need print:h-auto so long printable content can expand",
  );
  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "category cards must not hide overflowing content in print/PDF output",
  );
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:/,
    "fixed print grid row heights can silently clip long user-authored categories",
  );
  assert.doesNotMatch(
    infographicSource,
    /print-category-column/,
    "full-card print break avoidance can prevent long categories from paginating",
  );
  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column/,
    "print CSS must not keep an entire category card unbreakable",
  );
});
