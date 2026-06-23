import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const infographic = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout allows long category content to flow across pages", () => {
  assert.doesNotMatch(
    infographic,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "print grid rows must not have a fixed height that can clip overflowing categories",
  );
  assert.doesNotMatch(
    infographic,
    /className=\{`[^`]*\bh-full\b[^`]*`\}/,
    "category cards must not be forced to full row height in print",
  );
  assert.match(
    infographic,
    /className=\{`[^`]*\boverflow-hidden\b[^`]*\bprint:overflow-visible\b[^`]*`\}/,
    "screen overflow clipping must be disabled for print",
  );
  assert.doesNotMatch(
    globalCss,
    /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s,
    "whole category cards must be allowed to split across print pages",
  );
});
