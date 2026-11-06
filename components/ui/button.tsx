import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-btn text-white shadow-btn hover:scale-[1.03] hover:shadow-float",
        dark: "bg-navy text-white hover:bg-steel",
        outline: "border border-steel bg-white text-steel hover:bg-steel hover:text-white",
        ghost: "text-navy hover:bg-steel/10",
        danger: "bg-danger text-white hover:brightness-95",
      },
      size: { md: "h-11 px-5 text-sm", sm: "h-9 px-3 text-[13px]", lg: "h-12 px-6 text-base" },
      full: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

type Variants = VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, full, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & Variants) {
  return <button className={cn(buttonVariants({ variant, size, full }), className)} {...props} />
}

export function ButtonLink({ className, variant, size, full, ...props }: React.ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size, full }), className)} {...props} />
}
