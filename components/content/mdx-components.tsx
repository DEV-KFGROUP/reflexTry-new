import { MDXRemote } from 'next-mdx-remote/rsc';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const components = {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className={cn(
                "scroll-m-20 font-serif text-3xl sm:text-4xl font-medium tracking-[-0.02em] mb-6 text-[#161614]",
                className
            )}
            {...props}
        />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2
            className={cn(
                "scroll-m-20 border-b border-[#E6E3DB] pb-2 font-serif text-2xl sm:text-3xl font-medium tracking-[-0.02em] first:mt-0 mb-4 mt-10 text-[#161614]",
                className
            )}
            {...props}
        />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3
            className={cn(
                "scroll-m-20 font-serif text-xl sm:text-2xl font-medium tracking-tight mb-3 mt-7 text-[#161614]",
                className
            )}
            {...props}
        />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p
            className={cn("leading-7 text-[#3F3E39] [&:not(:first-child)]:mt-5", className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul className={cn("my-5 ml-6 list-disc text-[#3F3E39] [&>li]:mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
            className={cn(
                "my-7 border-y border-[#E6E3DB] py-5 px-2 font-serif italic text-lg text-[#3F3E39]",
                className
            )}
            {...props}
        />
    ),
    pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
        <pre
            className={cn(
                "mb-4 mt-6 overflow-x-auto rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] py-4 px-4 text-[#161614] font-mono text-sm",
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
};

export function MDXContent({ source }: { source: string }) {
    return (
        <MDXRemote
            source={source}
            components={components}
        />
    );
}
