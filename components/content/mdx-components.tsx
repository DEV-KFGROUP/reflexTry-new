import { MDXRemote } from 'next-mdx-remote/rsc';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const components = {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className={cn(
                "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-foreground",
                className
            )}
            {...props}
        />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2
            className={cn(
                "scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 text-foreground",
                className
            )}
            {...props}
        />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3
            className={cn(
                "scroll-m-20 text-2xl font-semibold tracking-tight mb-4 mt-6 text-foreground",
                className
            )}
            {...props}
        />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p
            className={cn("leading-7 text-foreground [&:not(:first-child)]:mt-6", className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
            className={cn(
                "mt-6 border-l-2 pl-6 italic text-muted-foreground",
                className
            )}
            {...props}
        />
    ),
    pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
        <pre
            className={cn(
                "mb-4 mt-6 overflow-x-auto rounded-lg border border-border bg-slate-100 py-4 px-4 text-slate-900",
                className
            )}
            {...props}
        />
    ),
    Card: Card,
    CardContent: CardContent,
    CardHeader: CardHeader,
    CardTitle: CardTitle,
    CardDescription: CardDescription,
    // Add other components like Callout, Table, etc. here
};

export function MDXContent({ source }: { source: string }) {
    return (
        <MDXRemote
            source={source}
            components={components}
        />
    );
}
