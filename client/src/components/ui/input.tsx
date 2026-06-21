import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-[#E5E7EB] bg-transparent px-3 py-2 text-sm shadow-xs transition-all outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-[3px] focus-visible:ring-[#2563EB]/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#DC2626] aria-invalid:ring-[3px] aria-invalid:ring-[#DC2626]/10 dark:border-[#334155] dark:placeholder:text-[#64748B] dark:focus-visible:border-[#2563EB] dark:aria-invalid:border-[#DC2626]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
