"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | "primary"
        | "secondary"
        | "outline"
        | "ghost"
        | "game"
        | "mission"
        | "speed"
        | "reflex"
        | "memory"
        | "wisdom"
        | "accuracy";
    size?: "sm" | "md" | "lg" | "xl";
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, style, ...props }, ref) => {
        const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
            primary:
                "bg-[#161614] text-[#FAF9F6] border border-[#161614] hover:bg-[#2C2B27] hover:border-[#2C2B27]",
            secondary:
                "bg-white text-[#161614] border border-[#E6E3DB] hover:bg-[#FAF9F6] hover:border-[#D8D4C9]",
            outline:
                "bg-white text-[#3F3E39] border border-[#E6E3DB] hover:bg-[#FAF9F6] hover:text-[#161614] hover:border-[#161614]",
            ghost:
                "bg-transparent text-[#57554E] border border-transparent hover:bg-[#F3F1EB] hover:text-[#161614] shadow-none",
            game:
                "bg-white text-[#161614] border border-[#E6E3DB] hover:bg-[#FAF9F6] hover:border-[#161614]",
            mission:
                "bg-[#161614] text-[#FAF9F6] border border-[#161614] hover:bg-[#2C2B27] hover:border-[#2C2B27]",
            speed:
                "bg-white text-[#161614] border border-[#E6E3DB] hover:border-[#161614] hover:bg-[#FAF9F6]",
            reflex:
                "bg-white text-[#161614] border border-[#E6E3DB] hover:border-[#161614] hover:bg-[#FAF9F6]",
            memory:
                "bg-white text-[#161614] border border-[#E6E3DB] hover:border-[#161614] hover:bg-[#FAF9F6]",
            wisdom:
                "bg-white text-[#161614] border border-[#E6E3DB] hover:border-[#161614] hover:bg-[#FAF9F6]",
            accuracy:
                "bg-white text-[#161614] border border-[#E6E3DB] hover:border-[#161614] hover:bg-[#FAF9F6]",
        };

        const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
            sm: "px-4 py-2 text-sm",
            md: "px-5 py-2.5 text-sm sm:text-base",
            lg: "px-6 py-3 text-base",
            xl: "px-8 py-4 text-lg",
        };

        // Filter out asChild prop to prevent it from being passed to DOM
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { asChild, ...restProps } = props;

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    variantClasses[variant],
                    sizes[size],
                    className
                )}
                style={style}
                {...restProps}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
