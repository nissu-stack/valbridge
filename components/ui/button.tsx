import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border text-[0.7rem] font-medium uppercase tracking-[0.17em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "border-[var(--gold)] bg-[var(--gold)] text-[var(--obsidian)] hover:border-[var(--gold-light)] hover:bg-[var(--gold-light)]",
        outline: "border-[var(--line)] bg-transparent text-[var(--cream)] hover:border-[var(--gold)] hover:bg-[rgba(201,150,43,0.08)] hover:text-[var(--gold-light)]",
        ghost: "border-transparent bg-transparent text-[var(--gold-light)] hover:border-[var(--line)] hover:bg-[rgba(201,150,43,0.08)]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4",
        lg: "h-14 px-8",
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
