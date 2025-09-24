import type * as hast from "hast";
import { getAttribute } from "hast-util-get-attribute";
import type * as unified from "unified";
import { visit } from "unist-util-visit";

export type Options = {
  attrs: (string | { attr: string; alt: string })[];
  prefix: string;
};
export const DEFAULT_PREFIX = "data-stash-";
export const stashAttrs: unified.Plugin<[Partial<Options>?]> = ({
  attrs: userAttrs,
  prefix: userPrefix,
} = {}) => {
  const prefix = userPrefix ?? DEFAULT_PREFIX;
  const fns = (userAttrs ?? [])
    .map((attr) =>
      typeof attr === "string" ? { attr, alt: prefix + attr } : attr,
    )
    .map(({ attr, alt }) => (elem: hast.Element) => {
      const val = getAttribute(elem, attr);
      if (val !== null) {
        (elem.properties ?? {})[alt] = val;
      }
    });
  return (root) => {
    visit(root as hast.Root, "element", (elem) => {
      fns.forEach((fn) => fn(elem));
    });
  };
};
