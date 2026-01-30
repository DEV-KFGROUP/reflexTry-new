import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: "default" | "game" | "quest";
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
        default: "rounded-lg border bg-card text-card-foreground shadow-sm",
        game: `
            rounded-xl 
            bg-card/60 
            backdrop-blur-xl 
            text-card-foreground 
            border border-white/10
            shadow-lg
            transition-all duration-300
            hover:border-speed/50
            hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]
            hover:translate-y-[-2px]
            relative
            overflow-hidden
        `,
        quest: `
            rounded-xl 
            bg-gradient-to-br from-card/80 to-card/60
            backdrop-blur-xl 
            text-card-foreground 
            border border-white/10
            shadow-lg
            transition-all duration-300
            hover:border-reflex/50
            hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]
            hover:translate-y-[-4px]
            relative
            overflow-hidden
            before:absolute before:inset-0 
            before:bg-gradient-to-br before:from-white/5 before:to-transparent
            before:opacity-0 before:hover:opacity-100
            before:transition-opacity before:duration-300
        `,
    };

    return (
        <div
            ref={ref}
            className={cn(variantStyles[variant], className)}
            {...props}
        />
    )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

