const fs = require('fs');
const path = require('path');

const staticPages = ['about', 'faq', 'contact', 'blog', 'science', 'terms', 'privacy', 'cookies'];
const rootDir = path.join(__dirname, '..', 'app');

function updatePageTsx(filePath, pageName) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('SchemaInjector')) {
        console.log(`Skipping (already updated): ${filePath}`);
        return;
    }

    // Add imports
    const imports = `import { SchemaInjector } from "@/components/SchemaInjector";\nimport { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";\n`;
    
    // We need to inject imports after the existing imports
    const lastImportIndex = content.lastIndexOf("import ");
    const endOfLastImport = content.indexOf("\n", lastImportIndex) + 1;
    
    content = content.slice(0, endOfLastImport) + imports + content.slice(endOfLastImport);

    // Capitalize for Breadcrumb
    const pageCapitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    // Find component name
    const componentMatch = content.match(/<([A-Za-z0-9]+)\s*\/>/);
    if (!componentMatch) {
        console.log(`Could not find component in ${filePath}`);
        return;
    }
    const componentName = componentMatch[1];

    const returnReplacement = `
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "${pageCapitalized}", url: "/${pageName}" },
    ]);
    
    // For these static pages, we don't have the config object imported, 
    // but we can generate a basic WebPage schema with the title.
    const webPageSchema = generateWebPageSchema(
        "${pageCapitalized} | Reflextry",
        "Learn more about Reflextry and our brain training tools.",
        "/${pageName}"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <${componentName} />
        </>
    );`;

    const returnRegex = /return\s*<[A-Za-z0-9]+\s*\/>;/s;
    if (returnRegex.test(content)) {
        content = content.replace(returnRegex, returnReplacement.trim());
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    } else {
        console.log(`Could not match return block in ${filePath}`);
    }
}

staticPages.forEach(page => {
    const pageTsxPath = path.join(rootDir, page, 'page.tsx');
    if (fs.existsSync(pageTsxPath)) {
        updatePageTsx(pageTsxPath, page);
    }
});
