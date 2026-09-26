import { readdir, copyFile } from "node:fs/promises";
import path from "node:path";
// Next's segmented prefetch URLs use dotted names; generic static hosts need aliases.
async function walk(dir, root = null, parts = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (root) await walk(file, root, [...parts, entry.name]);
      else if (entry.name.startsWith("__next."))
        await walk(file, dir, [entry.name]);
      else await walk(file);
    } else if (root && entry.name.endsWith(".txt"))
      await copyFile(file, path.join(root, [...parts, entry.name].join(".")));
  }
}
await walk("out");
console.log("Static prefetch aliases ready.");
