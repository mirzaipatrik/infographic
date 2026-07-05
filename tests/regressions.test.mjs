import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

test("print layout allows long category columns to flow across pages", async () => {
  const infographic = await readFile("components/Infographic.tsx", "utf8");
  const globals = await readFile("app/globals.css", "utf8");

  assert.match(
    infographic,
    /print:overflow-visible/,
    "category cards need visible overflow in print so user content is not clipped",
  );
  assert.doesNotMatch(
    infographic,
    /print:\[grid-auto-rows:142mm\]/,
    "fixed print row heights clip long user-authored category content",
  );
  assert.doesNotMatch(
    infographic,
    /print-category-column[^`]*h-full/,
    "full-height print category cards inherit the fixed row clipping behavior",
  );
  assert.doesNotMatch(
    globals,
    /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s,
    "whole category columns must be allowed to split across printed pages",
  );
});
