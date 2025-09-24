import assert from "node:assert";
import test from "node:test";
import rehype from "rehype";

import { stashAttrs } from "./index.js";

test("default", () => {
  assert.deepStrictEqual(
    rehype()
      .use(stashAttrs, { attrs: ["href"] })
      .processSync(
        '<html><head></head><body><a href="#foobar"></a></body></html>',
      )
      .toString(),
    '<html><head></head><body><a href="#foobar" data-stash-href="#foobar"></a></body></html>',
  );
});

test("prefix", () => {
  assert.deepStrictEqual(
    rehype()
      .use(stashAttrs, { attrs: ["href"], prefix: "foobar-" })
      .processSync(
        '<html><head></head><body><a href="#foobar"></a></body></html>',
      )
      .toString(),
    '<html><head></head><body><a href="#foobar" foobar-href="#foobar"></a></body></html>',
  );
});

test("alt", () => {
  assert.deepStrictEqual(
    rehype()
      .use(stashAttrs, {
        attrs: [{ attr: "href", alt: "hoge" }],
        prefix: "foobar-",
      })
      .processSync(
        '<html><head></head><body><a href="#foobar"></a></body></html>',
      )
      .toString(),
    '<html><head></head><body><a href="#foobar" hoge="#foobar"></a></body></html>',
  );
});
