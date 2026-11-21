import assert from "node:assert/strict";
import test from "node:test";
import { hasImageSource } from "./imageSource.js";

test("accepts a non-empty image URL", () => {
  assert.equal(hasImageSource("https://example.test/image.png"), true);
});

test("rejects empty and whitespace-only sources", () => {
  assert.equal(hasImageSource(""), false);
  assert.equal(hasImageSource("   \t\n"), false);
});

test("rejects absent and non-string sources", () => {
  assert.equal(hasImageSource(null), false);
  assert.equal(hasImageSource(undefined), false);
  assert.equal(hasImageSource(42), false);
});
