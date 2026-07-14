const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('page.tsx') || file.endsWith('not-found.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./app');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    // We want to replace ' | Reflextry' with '' in the file content.
    // However, some titles might be defined using template literals:
    // title: `${meta.title} | Reflextry` -> title: `${meta.title}` (or just meta.title)
    
    if (content.includes(' | Reflextry')) {
        // Special case for template literals first
        content = content.replace(/title:\s*`\$\{([^}]+)\}\s*\|\s*Reflextry`/g, "title: $1");
        
        // General replace for normal strings
        content = content.replace(/ \|\s*Reflextry/g, "");
        
        fs.writeFileSync(file, content);
        console.log("Fixed", file);
    }
}
