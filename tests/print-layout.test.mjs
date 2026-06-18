import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographicSource = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalsCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("printed infographic categories are allowed to grow instead of clipping content", () => {
  assert.match(
    infographicSource,
    /print:overflow-visible/,
    "category cards must not keep overflow hidden in print",
  );
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:/,
    "print grid rows must not be fixed-height because user-authored content is unbounded",
  );
  assert.doesNotMatch(
    infographicSource,
    /print-category-column/,
    "the whole category card should not opt into unbreakable print pagination",
  );
  assert.doesNotMatch(
    globalsCss,
    /\.print-category-column/,
    "global print CSS should not prevent category cards from paginating",
  );
});
