import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../lib/infographic.ts", import.meta.url), "utf8");

test("cached loader throws via publishedInfographicFromQuery instead of returning defaultData", () => {
  const cachedFn = source.slice(
    source.indexOf("async function getPublishedInfographicCached"),
    source.indexOf("export async function getPublishedInfographic"),
  );

  assert.match(cachedFn, /publishedInfographicFromQuery/);
  assert.doesNotMatch(
    cachedFn,
    /return defaultData/,
    "returning defaultData inside 'use cache' persists demo content for the cache lifetime",
  );
});

test("uncached wrapper is the only place that falls back to defaultData", () => {
  const wrapper = source.slice(source.indexOf("export async function getPublishedInfographic"));
  assert.match(wrapper, /return defaultData/);
  assert.match(wrapper, /catch/);
});
