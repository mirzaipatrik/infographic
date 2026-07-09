import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalsSource = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout lets long category content flow instead of clipping", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:/,
    "printed category rows must not use a fixed height that can truncate user-authored content",
  );

  assert.match(
    infographicSource,
    /print:h-auto/,
    "printed category cards should size to their content",
  );

  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "printed category cards should expose overflowing content instead of clipping it",
  );

  assert.doesNotMatch(
    infographicSource,
    /print-category-column/,
    "category cards should not opt into whole-card print fragmentation avoidance",
  );

  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column/,
    "global print CSS should not prevent large category cards from fragmenting across pages",
  );
});
