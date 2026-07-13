import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("share links parse URLSearchParams values without double-decoding user text", () => {
  const data = {
    title: "Community Efforts",
    subtitle: "100% complete",
    neighborhood: "A%20B neighborhood",
    year: "2026",
    categories: [],
  };
  const encoded = encodeURIComponent(JSON.stringify(data));
  const params = new URLSearchParams(`data=${encoded}`);
  const valueFromUrl = params.get("data");

  assert.deepEqual(JSON.parse(valueFromUrl), data);
  assert.throws(() => decodeURIComponent(valueFromUrl), URIError);

  const percentEscapeData = { ...data, subtitle: "Literal A%20B marker" };
  const percentEscapeParams = new URLSearchParams(
    `data=${encodeURIComponent(JSON.stringify(percentEscapeData))}`,
  );
  const percentEscapeValue = percentEscapeParams.get("data");
  assert.equal(
    JSON.parse(decodeURIComponent(percentEscapeValue)).subtitle,
    "Literal A B marker",
    "double-decoding silently corrupts literal percent escape sequences",
  );
  assert.deepEqual(JSON.parse(percentEscapeValue), percentEscapeData);

  assert.doesNotMatch(
    pageSource,
    /decodeURIComponent\(\s*encoded\s*\)/,
    "URLSearchParams.get already returns a decoded value; decoding again breaks literal percent text",
  );
  assert.match(pageSource, /JSON\.parse\(\s*encoded\s*\)/);
});
