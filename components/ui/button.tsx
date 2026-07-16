import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-[var(--gold)] text-[var(--obsidian)] hover:bg-[var(--gold-light)]",
        outline: "border border-[var(--gold)] bg-transparent text-[var(--gold-light)] hover:bg-[rgba(201,150,43,0.12)]",
        ghost: "bg-transparent text-[var(--gold-light)] hover:bg-[rgba(201,150,43,0.08)]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 px-3.5",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
