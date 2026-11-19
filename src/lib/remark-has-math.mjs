/**
 * Remark plugin: flags documents that contain math.
 *
 * KaTeX's stylesheet and fonts are about 25 KB before any glyphs, so article
 * pages load them only when `remarkPluginFrontmatter.hasMath` is true. Detecting
 * it here means authors never have to remember a frontmatter flag.
 * Must run after remark-math, which creates the `math` and `inlineMath` nodes.
 */
export default function remarkHasMath() {
  return (tree, file) => {
    let found = false;
    const walk = (node) => {
      if (found) return;
      if (node.type === 'math' || node.type === 'inlineMath') {
        found = true;
        return;
      }
      node.children?.forEach(walk);
    };
    walk(tree);
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.hasMath = found;
  };
}
