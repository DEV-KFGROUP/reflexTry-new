"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "asChild"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "game" | "mission" | "speed" | "reflex" | "memory" | "wisdom" | "accuracy";
    size?: "sm" | "md" | "lg" | "xl";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, style, ...props }, ref) => {
        const variantStyles: Record<string, { background?: string; boxShadow?: string }> = {
            primary: {
                background: "#0f172a",
            },
            secondary: {
                background: "#ffffff",
            },
            speed: {
                background: "#ffffff",
            },
            reflex: {
                background: "#ffffff",
            },
            memory: {
                background: "#ffffff",
            },
            wisdom: {
                background: "#ffffff",
            },
            accuracy: {
                background: "#ffffff",
            },
            game: {
                background: "#ffffff",
            },
            outline: {},
            ghost: {},
            mission: {},
        };

        const variantClasses = {
            primary: "text-white font-semibold border border-slate-900 hover:bg-slate-800",
            secondary: "text-slate-900 font-semibold border border-border hover:bg-slate-50",
            outline: "border border-border text-slate-700 hover:bg-slate-50 bg-transparent font-medium",
            ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent font-medium",
            game: "text-slate-900 font-semibold border border-border hover:bg-slate-50",
            mission: `
                bg-white
                text-slate-900
                border border-border
                hover:bg-slate-50
            `,
            speed: "text-slate-900 font-semibold border border-border hover:bg-slate-50",
            reflex: "text-slate-900 font-semibold border border-border hover:bg-slate-50",
            memory: "text-slate-900 font-semibold border border-border hover:bg-slate-50",
            wisdom: "text-slate-900 font-semibold border border-border hover:bg-slate-50",
            accuracy: "text-slate-900 font-semibold border border-border hover:bg-slate-50",
        };

        const sizes = {
            sm: "px-6 py-3 text-sm",
            md: "px-8 py-4 text-base",
            lg: "px-10 py-5 text-lg",
            xl: "px-14 py-6 text-xl",
        };

        // Filter out asChild prop to prevent it from being passed to DOM
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { asChild, ...restProps } = props as ButtonProps & { asChild?: boolean };

        return (
            <motion.button
                ref={ref}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "rounded-xl font-semibold transition duration-200 cursor-pointer active:scale-[0.97] flex items-center justify-center gap-2 shadow-sm",
                    variantClasses[variant],
                    sizes[size],
                    className
                )}
                style={{
                    ...variantStyles[variant],
                    ...style,
                }}
                {...restProps}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
