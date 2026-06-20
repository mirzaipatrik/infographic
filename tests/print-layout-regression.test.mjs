import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

const infographicSource = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout lets long category content expand instead of clipping", () => {
  assert.match(
    infographicSource,
    /overflow-hidden[^`]*print:overflow-visible/,
    "print styles must override screen overflow clipping on category cards",
  );

  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:/,
    "print grid rows must auto-size to user content",
  );

  assert.doesNotMatch(
    globalCss,
    /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s,
    "entire category cards must be allowed to fragment across printed pages",
  );
});
