import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographic = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout lets long category content paginate instead of clipping", () => {
  assert.match(
    infographic,
    /print:overflow-visible/,
    "category cards must expose overflow in print so user-authored content is not clipped",
  );

  assert.doesNotMatch(
    infographic,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "print grid rows must not be fixed because tall categories can exceed a single row",
  );

  assert.doesNotMatch(
    infographic,
    /print-category-column/,
    "category cards must not opt out of page breaks as a whole",
  );

  assert.doesNotMatch(
    globals,
    /\.print-category-column/,
    "global print CSS must not prevent a full category card from breaking across pages",
  );
});
