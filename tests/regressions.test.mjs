import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const infographicSource = await readFile(
  new URL("../components/Infographic.tsx", import.meta.url),
  "utf8",
);
const globalsSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout allows category content to flow instead of clipping", () => {
  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:/,
    "printed category grid must not use a fixed row height",
  );
  assert.match(
    infographicSource,
    /overflow-hidden[^`]*print:overflow-visible/,
    "printed category cards must reveal overflow if content exceeds one page",
  );
  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s,
    "whole categories must be allowed to split across pages when content is long",
  );
});
