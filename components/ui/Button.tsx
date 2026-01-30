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
        // Explicit background colors for each variant
        const variantStyles: Record<string, { background?: string; boxShadow?: string }> = {
            primary: {
                background: "linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)",
            },
            secondary: {
                background: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
            },
            speed: {
                background: "linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)",
                boxShadow: "0 0 20px rgba(0, 229, 255, 0.4)",
            },
            reflex: {
                background: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
            },
            memory: {
                background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)",
            },
            wisdom: {
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
            },
            accuracy: {
                background: "linear-gradient(135deg, #00e676 0%, #00c853 100%)",
                boxShadow: "0 0 20px rgba(0, 230, 118, 0.4)",
            },
            game: {
                background: "linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #00e5ff 100%)",
                boxShadow: "0 0 25px rgba(0, 229, 255, 0.5)",
            },
            outline: {},
            ghost: {},
            mission: {},
        };

        const variantClasses = {
            primary: "text-white font-bold border-none hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]",
            secondary: "text-white font-bold border-none hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
            outline: "border-2 border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff]/20 hover:text-white bg-transparent",
            ghost: "text-gray-400 hover:text-white hover:bg-white/10 bg-transparent",
            game: "text-white font-bold border-none",
            mission: `
                bg-slate-900/80 
                text-white 
                border-2 border-[#00e5ff]/50
                backdrop-blur-sm
                hover:border-[#00e5ff]
                hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]
            `,
            speed: "text-white font-bold border-none",
            reflex: "text-white font-bold border-none",
            memory: "text-white font-bold border-none",
            wisdom: "text-white font-bold border-none",
            accuracy: "text-white font-bold border-none",
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "rounded-full font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2",
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
