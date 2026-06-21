import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 gap-2",
  {
    variants: {
      variant: {
        default: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1D4ED8] shadow-sm",
        outline: "border border-[#E5E7EB] bg-transparent text-[#0F172A] hover:bg-[#F8F9FA] dark:border-[#334155] dark:text-[#F1F5F9] dark:hover:bg-[#1E293B]",
        secondary: "border border-[#E5E7EB] bg-transparent text-[#0F172A] hover:bg-[#F8F9FA] dark:border-[#334155] dark:text-[#F1F5F9] dark:hover:bg-[#1E293B]",
        ghost: "bg-transparent text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-[#EFF6FF]/10",
        destructive: "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#B91C1C]",
        link: "text-[#2563EB] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-6 rounded-md px-2 text-xs gap-1",
        sm: "h-8 rounded-md px-3 text-xs gap-1.5",
        lg: "h-11 rounded-lg px-6 text-base gap-2.5",
        icon: "h-10 w-10",
        "icon-xs": "h-6 w-6 rounded-md",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-11 w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
