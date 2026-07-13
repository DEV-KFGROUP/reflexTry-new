const fs = require('fs');
const path = require('path');

const SKIP_TOOLS = ['chimp-test', 'verbal-memory', 'time-perception'];
const BASE_DIRS = ['app/memory', 'app/reflex', 'app/speed', 'app/accuracy', 'app/gaming'];

function processTool(toolDir) {
    const pagePath = path.join(toolDir, 'page.tsx');
    if (!fs.existsSync(pagePath)) return;

    let pageCode = fs.readFileSync(pagePath, 'utf8');
    
    // Find the imported Game Component
    const importMatch = pageCode.match(/import (\w+) from '.\/([^']+)'/);
    if (!importMatch) {
        console.log("No component import found in " + pagePath);
        return;
    }
    const componentName = importMatch[1];
    let componentFile = importMatch[2];
    if (!componentFile.endsWith('.tsx')) componentFile += '.tsx';
    
    const gamePath = path.join(toolDir, componentFile);
    if (!fs.existsSync(gamePath)) {
        console.log("Game file not found: " + gamePath);
        return;
    }

    let gameCode = fs.readFileSync(gamePath, 'utf8');

    // Extract ToolContent from Game
    const toolContentRegex = /<ToolContent[\s\S]*?\/>/;
    const toolContentMatch = gameCode.match(toolContentRegex);
    let extractedToolContent = "";

    if (toolContentMatch) {
        extractedToolContent = toolContentMatch[0];
        // Remove from Game
        gameCode = gameCode.replace(toolContentRegex, '');
    } else {
        console.log("No ToolContent found in " + gamePath);
        extractedToolContent = `<ToolContent
                        title={config.title}
                        description={content.description}
                        howToUse={content.howToUse}
                        howToImprove={content.howToImprove}
                        faqs={content.faqs}
                        howToPlay={[]}
                        benefits={[]}
                    />`;
    }

    // Clean up Game imports and variables
    gameCode = gameCode.replace(/import\s*{\s*ToolContent\s*}\s*from\s*['"]@\/components\/ToolContent['"];?\n?/g, '');
    gameCode = gameCode.replace(/import\s*{\s*getToolContent\s*}\s*from\s*['"]@\/lib\/tool-content['"];?\n?/g, '');
    gameCode = gameCode.replace(/const\s+content\s*=\s*getToolContent\([^)]+\);?\n?/g, '');
    // Remove wrapper div around ToolContent if it exists (heuristic)
    gameCode = gameCode.replace(/{\/\* SEO Content \*\/}\s*<div[^>]*>\s*<\/div>/g, '');
    gameCode = gameCode.replace(/<div className="w-full max-w-5xl[^>]*>\s*<\/div>/g, '');

    fs.writeFileSync(gamePath, gameCode);

    // Update page.tsx
    // Add imports
    if (!pageCode.includes('ToolContent')) {
        pageCode = pageCode.replace(
            "import { SEO_CONFIGS } from '@/config/seo-config';",
            "import { SEO_CONFIGS } from '@/config/seo-config';\nimport { ToolContent } from '@/components/ToolContent';\nimport { getToolContent } from '@/lib/tool-content';"
        );
    }

    // Add content variable inside Page function
    // Look for config definition to inject below it
    const configMatch = pageCode.match(/const config = SEO_CONFIGS\['([^']+)'\];/);
    let toolKey = "";
    if (configMatch) {
        toolKey = configMatch[1];
        if (!pageCode.includes('const content = getToolContent')) {
            pageCode = pageCode.replace(
                configMatch[0],
                `${configMatch[0]}\n    const content = getToolContent('${toolKey}', config.title);`
            );
        }
    }

    // Replace return block
    // We want to replace everything from "return (" to the end of the component with the new layout
    const returnRegex = /return\s*\(\s*(?:<>\s*)?<SchemaInjector[\s\S]*?<\w+\s*\/>\s*(?:<\/>\s*)?\);\s*}/;
    
    // Some pages might not use exactly this pattern, so let's do a more generic replacement
    const newReturn = `return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <${componentName} />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    ${extractedToolContent.replace(/^/gm, '                    ').trim()}
                </div>
            </div>
        </div>
    );
}`;

    // A robust way is to just replace everything from "return (" to the end.
    // Assuming 'return (' is the last return in the file.
    const lastReturnIndex = pageCode.lastIndexOf('return (');
    if (lastReturnIndex !== -1) {
        pageCode = pageCode.substring(0, lastReturnIndex) + newReturn;
    }

    fs.writeFileSync(pagePath, pageCode);
    console.log("Upgraded " + toolDir);
}

BASE_DIRS.forEach(baseDir => {
    if (!fs.existsSync(baseDir)) return;
    const items = fs.readdirSync(baseDir);
    items.forEach(item => {
        const fullPath = path.join(baseDir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!SKIP_TOOLS.includes(item)) {
                processTool(fullPath);
            }
        }
    });
});

