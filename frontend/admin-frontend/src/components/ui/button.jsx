import React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  default: "bg-[#1d4ed8] text-white hover:bg-[#1e40af] shadow-xs",
  destructive: "bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-xs",
  outline: "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f3f4f6]",
  secondary: "bg-[#f1f4fb] text-[#374151] hover:bg-[#e2e8f0]",
  ghost: "bg-transparent text-[#374151] hover:bg-[#f3f5f9]",
  link: "text-[#1d4ed8] underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-6 text-sm",
  icon: "h-8 w-8 p-0",
};

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        data-variant={variant}
        data-size={size}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant] || buttonVariants.default,
          buttonSizes[size] || buttonSizes.default,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
