import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";
const dir = "public/assets/vessels";
for (const file of await readdir(dir)) {
  if (!/\.(png|jpeg)$/.test(file)) continue;
  await sharp(path.join(dir, file))
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(path.join(dir, file.replace(/\.(png|jpeg)$/, ".webp")));
}
for (const file of ["pearl-wax.png", "real-wax.jpg", "logo.png"]) {
  await sharp("public/assets/" + file)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile("public/assets/" + file.replace(/\.(png|jpg)$/, ".webp"));
}
console.log("WebP derivatives created; originals preserved.");
await sharp("public/assets/pearl-wax.png")
  .resize({ width: 800, withoutEnlargement: true })
  .avif({ quality: 48, effort: 6 })
  .toFile("public/assets/pearl-wax.avif");
