const fs = require('fs');
const path = require('path');

const categories = ['accuracy', 'gaming', 'memory', 'reflex', 'speed'];
const rootDir = path.join(__dirname, '..', 'app');

function updatePageTsx(filePath, category) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has SchemaInjector
    if (content.includes('SchemaInjector')) {
        console.log(`Skipping (already updated): ${filePath}`);
        return;
    }

    // Replace StructuredData import
    content = content.replace(
        "import { StructuredData } from '@/components/StructuredData';",
        "import { SchemaInjector } from '@/components/SchemaInjector';"
    );
    // Might have double quotes
    content = content.replace(
        'import { StructuredData } from "@/components/StructuredData";',
        'import { SchemaInjector } from "@/components/SchemaInjector";'
    );

    // Update structured-data import
    content = content.replace(
        "import { generateToolStructuredData } from '@/lib/structured-data';",
        "import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';"
    );
    content = content.replace(
        'import { generateToolStructuredData } from "@/lib/structured-data";',
        'import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";'
    );

    // Find the URL
    const urlMatch = content.match(/`(\/[^\/]+\/[^`]+)`/);
    if (!urlMatch) {
        console.log(`Could not find URL in ${filePath}`);
        return;
    }
    const url = urlMatch[1];
    const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);

    // Find the component name
    const componentMatch = content.match(/<([A-Za-z0-9]+)\s*\/>/);
    if (!componentMatch) {
        console.log(`Could not find component in ${filePath}`);
        return;
    }
    const componentName = componentMatch[1];

    // Build the replacement for the render function
    const replacementBlock = `
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "${categoryCapitalized} Tools", url: "/${category}" },
        { name: config.title, url: \`${url}\` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        \`${url}\`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <${componentName} />
        </>
    );`;

    // Replace the return block
    // It currently looks like:
    // return (
    //     <>
    //         <StructuredData type="WebApplication" data={structuredData} />
    //         <ComponentName />
    //     </>
    // );
    const regex = /return\s*\(\s*<>\s*<StructuredData[^>]+>\s*<[A-Za-z0-9]+\s*\/>\s*<\/>\s*\);/s;
    if (!regex.test(content)) {
        console.log(`Could not match return block in ${filePath}`);
        // try less strict regex
        const regex2 = /return\s*\(\s*<>\s*<StructuredData[^>]+>\s*<[A-Za-z0-9]+\s*\{[^}]*\}\s*\/>\s*<\/>\s*\);/s;
        if (regex2.test(content)) {
             // ... handles props, but let's see if we fail first
        }
        return;
    }

    content = content.replace(regex, replacementBlock.trim());

    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
}

categories.forEach(category => {
    const categoryPath = path.join(rootDir, category);
    if (!fs.existsSync(categoryPath)) return;

    const items = fs.readdirSync(categoryPath);
    items.forEach(item => {
        const itemPath = path.join(categoryPath, item);
        if (fs.statSync(itemPath).isDirectory()) {
            const pageTsxPath = path.join(itemPath, 'page.tsx');
            if (fs.existsSync(pageTsxPath)) {
                updatePageTsx(pageTsxPath, category);
            }
        }
    });
});
