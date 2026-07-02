import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const infographicSource = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalStyles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout allows overfull category content to flow instead of clipping", () => {
  assert.equal(
    infographicSource.includes("print:[grid-auto-rows:142mm]"),
    false,
    "print grid rows must not be fixed to a single page fragment",
  );

  assert.equal(
    infographicSource.includes("print:overflow-visible"),
    true,
    "category cards must allow overflowing content to remain printable",
  );

  assert.equal(
    globalStyles.includes(".print-category-column"),
    false,
    "whole category cards must not opt out of page fragmentation",
  );
});
