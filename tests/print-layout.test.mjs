import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const infographic = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout can grow instead of clipping category content", () => {
  assert.equal(
    infographic.includes("print:[grid-auto-rows:"),
    false,
    "print grid rows must not use fixed heights",
  );
  assert.match(
    infographic,
    /print:h-auto\s+print:overflow-visible/,
    "category cards must allow overflow in print output",
  );
  assert.equal(
    globalCss.includes(".print-category-column") && globalCss.includes("break-inside: avoid"),
    false,
    "whole category cards must be allowed to break across pages",
  );
});
