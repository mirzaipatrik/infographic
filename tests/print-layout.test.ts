import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const infographicSource = readFileSync("components/Infographic.tsx", "utf8");
const globalCss = readFileSync("app/globals.css", "utf8");

test("print columns are allowed to grow instead of clipping content", () => {
  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "category columns must override overflow-hidden while printing",
  );
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "print grid rows must not be capped to a fixed height",
  );
  assert.doesNotMatch(
    infographicSource,
    /print-category-column/,
    "full category columns should not be forced to avoid page breaks",
  );
  assert.doesNotMatch(
    globalCss,
    /\.print-category-column/,
    "full category columns should be able to paginate when content is long",
  );
});
