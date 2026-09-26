"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
export default function IntentLink(props: ComponentProps<typeof Link>) {
  const router = useRouter();
  const preload = () => {
    const href = typeof props.href === "string" ? props.href : "";
    if (href.startsWith("/") && !href.startsWith("/#")) router.prefetch(href);
  };
  return (
    <Link
      {...props}
      prefetch={false}
      onMouseEnter={preload}
      onFocus={preload}
      onTouchStart={preload}
    />
  );
}
