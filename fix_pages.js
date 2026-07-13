const fs = require('fs');
const files = [
  { path: 'app/accuracy/pattern-matching/page.tsx', tool: 'pattern-matching' },
  { path: 'app/accuracy/precision-click/page.tsx', tool: 'precision-click' },
  { path: 'app/reflex/multi-stimulus/page.tsx', tool: 'multi-stimulus' },
  { path: 'app/reflex/sequence-reaction/page.tsx', tool: 'sequence-reaction' }
];

files.forEach(({path, tool}) => {
  let content = fs.readFileSync(path, 'utf8');
  // Find where structuredData is declared, inject content above it
  content = content.replace(
    /const structuredData = generateToolStructuredData/g,
    `const content = getToolContent('${tool}', config.title);\n    const structuredData = generateToolStructuredData`
  );
  fs.writeFileSync(path, content);
  console.log('Fixed ' + path);
});
