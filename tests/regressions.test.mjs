import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const pageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const infographicSource = readFileSync(
  new URL("../components/Infographic.tsx", import.meta.url),
  "utf8",
);
const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("share links parse after URLSearchParams performs its single decode", () => {
  const data = {
    title: "100% participation",
    subtitle: "Literal percent signs must survive share links",
  };
  const url = new URL(`https://example.test/?data=${encodeURIComponent(JSON.stringify(data))}`);
  const decodedBySearchParams = url.searchParams.get("data");

  assert.deepEqual(JSON.parse(decodedBySearchParams), data);
  assert.throws(() => decodeURIComponent(decodedBySearchParams), URIError);
  assert.doesNotMatch(pageSource, /decodeURIComponent\(\s*encoded\s*\)/);
});

test("print category layout does not constrain columns to a clipping height", () => {
  assert.doesNotMatch(infographicSource, /print:\[grid-auto-rows:/);
  assert.doesNotMatch(infographicSource, /print-category-column/);
  assert.match(infographicSource, /print:overflow-visible/);
  assert.doesNotMatch(globalCss, /\.print-category-column\s*\{[^}]*break-inside/s);
});
