import React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-[#1d4ed8] text-white",
  secondary: "bg-[#e2e8f0] text-[#334155]",
  destructive: "bg-[#dc2626] text-white",
  outline: "border border-[#e2e8f0] text-[#1f2937]",
  success: "bg-[#dcfce7] text-[#166534]",
};

export function Badge({
  className,
  variant = "default",
  ...props
}) {
  return (
    <span
      data-variant={variant}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors leading-none",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}
