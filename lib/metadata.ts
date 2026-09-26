import type { Metadata } from "next";
export function pageMeta(
  title: string,
  description: string,
  path: string,
): Metadata {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title,
    description,
    alternates: base ? { canonical: new URL(path, base).href } : undefined,
    openGraph: {
      title: title + " · Barkat",
      description,
      type: "website",
      ...(base ? { url: new URL(path, base).href } : {}),
    },
  };
}
