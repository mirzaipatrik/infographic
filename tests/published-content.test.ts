import assert from "node:assert/strict";
import test from "node:test";
import { defaultData, publishedInfographicFromQuery } from "../lib/data";

test("returns parsed row content on a successful query", () => {
  const published = publishedInfographicFromQuery({ content: defaultData }, null);
  assert.equal(published.title, defaultData.title);
  assert.equal(published.categories.length, defaultData.categories.length);
});

test("throws on query errors instead of returning fallback data", () => {
  assert.throws(
    () => publishedInfographicFromQuery({ content: defaultData }, { message: "timeout" }),
    /Failed to load infographic: timeout/,
  );
});

test("throws when the published row is missing", () => {
  assert.throws(
    () => publishedInfographicFromQuery(null, null),
    /Published infographic row is missing/,
  );
});

test("throws when stored JSON is invalid", () => {
  assert.throws(
    () => publishedInfographicFromQuery({ content: { title: "nope" } }, null),
    /Published infographic content is invalid/,
  );
});
