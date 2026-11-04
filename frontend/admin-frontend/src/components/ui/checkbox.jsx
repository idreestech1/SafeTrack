import React, { useEffect, useRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef(
  ({ className, checked = false, onCheckedChange, disabled = false, ...props }, ref) => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = checked === "indeterminate";
      }
    }, [checked]);

    const isChecked = checked === true;
    const isIndeterminate = checked === "indeterminate";

    return (
      <label
        className={cn(
          "relative inline-flex items-center justify-center w-4 h-4 rounded border cursor-pointer select-none transition-colors shrink-0",
          isChecked || isIndeterminate
            ? "bg-[#1d4ed8] border-[#1d4ed8] text-white"
            : "border-[#cbd5e1] bg-white hover:border-[#94a3b8]",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
      >
        <input
          type="checkbox"
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          checked={isChecked}
          disabled={disabled}
          onChange={(e) => {
            onCheckedChange?.(e.target.checked);
          }}
          className="sr-only opacity-0 absolute inset-0 w-full h-full cursor-pointer m-0 p-0"
          {...props}
        />
        {isChecked && <Check size={11} strokeWidth={3} />}
        {isIndeterminate && <Minus size={11} strokeWidth={3} />}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;

