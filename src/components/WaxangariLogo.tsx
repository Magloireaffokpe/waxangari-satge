"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  linkable?: boolean;
}

const sizeMap = {
  sm: { w: 130, h: 52 },
  md: { w: 175, h: 70 },
  lg: { w: 230, h: 92 },
};

export function WaxangariLogo({
  className,
  size = "md",
  linkable = true,
}: LogoProps) {
  const { w, h } = sizeMap[size];

  const img = (
    <span
      style={{ lineHeight: 0, display: "inline-flex", alignItems: "center" }}
      className={cn(
        "mix-blend-multiply",
        "dark:mix-blend-normal dark:bg-white dark:rounded-xl dark:px-2 dark:py-1",
      )}
    >
      <Image
        src="/logo.jpeg"
        alt="Waxangari Labs"
        width={w}
        height={h}
        priority
        className="object-contain select-none block"
        style={{ width: w, height: "auto", maxHeight: h }}
      />
    </span>
  );

  if (!linkable) {
    return (
      <div className={cn("inline-flex items-center", className)}>{img}</div>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center rounded-xl transition-all duration-200",
        "hover:opacity-90 hover:scale-[1.02] active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF18] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label="Waxangari Labs – Accueil"
    >
      {img}
    </Link>
  );
}
