import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { geminiPool } from './gemini-api-manager';

export interface LanguageTarget {
  code: string;
  name: string;
  nativeName: string;
}

export const TARGET_LANGUAGES: LanguageTarget[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
];

/**
 * 1. Translate UI Dictionary (lib/i18n/dictionaries/en.json -> lib/i18n/dictionaries/{lang}.json)
 */
async function translateDictionary(target: LanguageTarget) {
  const sourcePath = path.resolve(process.cwd(), 'lib/i18n/dictionaries/en.json');
  const targetPath = path.resolve(process.cwd(), `lib/i18n/dictionaries/${target.code}.json`);

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source dictionary not found at ${sourcePath}`);
    return;
  }

  const enDict = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  console.log(`\n🌐 [${target.code.toUpperCase()}] Translating UI Dictionary to ${target.name}...`);

  try {
    const translated = await geminiPool.translateJson(
      target.name,
      target.code,
      enDict,
      'Web application navigation, buttons, game labels, footer copy'
    );

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2), 'utf8');
    console.log(`✅ [${target.code.toUpperCase()}] UI Dictionary saved: ${targetPath}`);
  } catch (err: any) {
    console.error(`❌ [${target.code.toUpperCase()}] Failed to translate dictionary:`, err.message);
  }
}

/**
 * 2. Translate SEO Configs (config/seo-config.ts -> content/translations/{lang}/seo-config.json)
 */
async function translateSEOConfigs(target: LanguageTarget) {
  const targetDir = path.resolve(process.cwd(), `content/translations/${target.code}`);
  const targetFile = path.join(targetDir, 'seo-config.json');

  if (fs.existsSync(targetFile)) {
    console.log(`⏩ [${target.code.toUpperCase()}] seo-config.json already exists. Skipping.`);
    return;
  }

  const { SEO_CONFIGS } = require('../config/seo-config');
  const toolKeys = Object.keys(SEO_CONFIGS);
  console.log(`\n🔍 [${target.code.toUpperCase()}] Translating SEO Metadata for ${toolKeys.length} tools to ${target.name}...`);

  fs.mkdirSync(targetDir, { recursive: true });
  const translatedConfig: Record<string, any> = {};

  const BATCH_SIZE = 5;
  for (let i = 0; i < toolKeys.length; i += BATCH_SIZE) {
    const batchKeys = toolKeys.slice(i, i + BATCH_SIZE);
    const batchObj: Record<string, any> = {};
    for (const k of batchKeys) {
      batchObj[k] = SEO_CONFIGS[k];
    }

    console.log(`   ⏳ Translating tools [${i + 1}-${Math.min(i + BATCH_SIZE, toolKeys.length)}/${toolKeys.length}]...`);
    try {
      const translatedBatch = await geminiPool.translateJson(
        target.name,
        target.code,
        batchObj,
        'SEO page titles, meta descriptions, and localized search keywords for cognitive tools'
      );
      Object.assign(translatedConfig, translatedBatch);
      await new Promise(r => setTimeout(r, 600));
    } catch (err: any) {
      console.error(`   ❌ Failed batch at index ${i}:`, err.message);
    }
  }

  fs.writeFileSync(targetFile, JSON.stringify(translatedConfig, null, 2), 'utf8');
  console.log(`✅ [${target.code.toUpperCase()}] SEO Config saved: ${targetFile}`);
}

/**
 * 3. Translate Rich Tool Content (lib/tool-content.ts -> content/translations/{lang}/tool-content.json)
 */
async function translateToolContent(target: LanguageTarget) {
  const targetDir = path.resolve(process.cwd(), `content/translations/${target.code}`);
  const targetFile = path.join(targetDir, 'tool-content.json');

  fs.mkdirSync(targetDir, { recursive: true });

  let existingData: Record<string, any> = {};
  if (fs.existsSync(targetFile)) {
    try {
      existingData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    } catch (_) {}
  }

  const { toolContent } = require('../lib/tool-content');
  const toolKeys = Object.keys(toolContent);
  const remainingKeys = toolKeys.filter(k => !existingData[k]);

  if (remainingKeys.length === 0) {
    console.log(`⏩ [${target.code.toUpperCase()}] All ${toolKeys.length} tool contents already translated. Skipping.`);
    return;
  }

  console.log(`\n📖 [${target.code.toUpperCase()}] Translating Comprehensive Tool Content for ${remainingKeys.length} tools to ${target.name}...`);

  for (let i = 0; i < remainingKeys.length; i++) {
    const toolId = remainingKeys[i];
    const rawData = toolContent[toolId];
    console.log(`   ⏳ [${i + 1}/${remainingKeys.length}] Translating tool "${toolId}"...`);

    try {
      const translatedTool = await geminiPool.translateJson(
        target.name,
        target.code,
        rawData,
        `Comprehensive guide for cognitive game "${toolId}". Translate description, howToUse steps, howToImprove strategies, and FAQs.`
      );

      existingData[toolId] = translatedTool;
      // Progressive save so progress is never lost
      fs.writeFileSync(targetFile, JSON.stringify(existingData, null, 2), 'utf8');
      await new Promise(r => setTimeout(r, 700));
    } catch (err: any) {
      console.error(`   ❌ Failed tool "${toolId}":`, err.message);
    }
  }

  console.log(`✅ [${target.code.toUpperCase()}] Tool Content saved: ${targetFile}`);
}

/**
 * 4. Translate Blog Articles (content/blog/*.mdx -> content/translations/{lang}/blog/*.mdx)
 */
async function translateBlogPosts(target: LanguageTarget) {
  const blogDir = path.resolve(process.cwd(), 'content/blog');
  const targetBlogDir = path.resolve(process.cwd(), `content/translations/${target.code}/blog`);

  if (!fs.existsSync(blogDir)) return;

  fs.mkdirSync(targetBlogDir, { recursive: true });
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  console.log(`\n📰 [${target.code.toUpperCase()}] Translating ${files.length} Blog Articles to ${target.name}...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const targetFile = path.join(targetBlogDir, file);

    if (fs.existsSync(targetFile)) {
      continue;
    }

    console.log(`   ⏳ [${i + 1}/${files.length}] Translating article "${file}"...`);
    const sourceContent = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const { data: frontmatter, content } = matter(sourceContent);

    try {
      const prompt = `You are an expert science and gaming translator.
Translate the following Markdown/MDX article from English into ${target.name} (locale: ${target.code}).

RULES:
1. Translate the frontmatter title and description. Keep publishedAt, author, category, and tags intact.
2. Translate the entire article body into natural, fluent ${target.name}.
3. Preserve all Markdown headings (##, ###), bullet points, and internal links (e.g. [text](url)).
4. Output the complete translated MDX document directly, starting with --- and ending with the translated body. Do NOT wrap in JSON or code blocks.

Article to translate:
${sourceContent}`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
        },
      };

      const result = await geminiPool.generateContent(payload);
      let text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        text = text.trim();
        // Remove markdown code fence if wrapped
        if (text.startsWith('```markdown')) text = text.slice(11);
        if (text.startsWith('```mdx')) text = text.slice(6);
        if (text.startsWith('```')) text = text.slice(3);
        if (text.endsWith('```')) text = text.slice(0, -3);
        text = text.trim();

        fs.writeFileSync(targetFile, text, 'utf8');
      }
      await new Promise(r => setTimeout(r, 700));
    } catch (err: any) {
      console.error(`   ❌ Failed article "${file}":`, err.message);
    }
  }

  console.log(`✅ [${target.code.toUpperCase()}] Blog articles saved to: ${targetBlogDir}`);
}

/**
 * CLI Entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const langArg = args.find(a => a.startsWith('--lang='))?.split('=')[1] || args[args.indexOf('--lang') + 1];
  const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1] || args[args.indexOf('--type') + 1] || 'all';
  const showStatus = args.includes('--status');

  if (showStatus) {
    console.log('\n📊 Translation Status Overview:');
    for (const t of TARGET_LANGUAGES) {
      const dictExists = fs.existsSync(`lib/i18n/dictionaries/${t.code}.json`);
      const seoExists = fs.existsSync(`content/translations/${t.code}/seo-config.json`);
      const toolsExists = fs.existsSync(`content/translations/${t.code}/tool-content.json`);
      const blogDir = `content/translations/${t.code}/blog`;
      const blogCount = fs.existsSync(blogDir) ? fs.readdirSync(blogDir).length : 0;
      console.log(`- [${t.code.padEnd(5)}] ${t.name.padEnd(18)} : Dict: ${dictExists ? '✅' : '❌'} | SEO: ${seoExists ? '✅' : '❌'} | Guides: ${toolsExists ? '✅' : '❌'} | Blog: ${blogCount}/21`);
    }
    return;
  }

  const selectedTargets = langArg === 'all'
    ? TARGET_LANGUAGES
    : TARGET_LANGUAGES.filter(t => t.code === (langArg || 'es'));

  if (selectedTargets.length === 0) {
    console.error(`❌ Unknown language code: ${langArg}. Available: ${TARGET_LANGUAGES.map(t => t.code).join(', ')}`);
    return;
  }

  console.log(`🚀 Starting Translation pipeline for: ${selectedTargets.map(t => t.name).join(', ')}`);
  console.log(`📌 Type: ${typeArg}`);

  for (const target of selectedTargets) {
    if (typeArg === 'dict' || typeArg === 'all') {
      await translateDictionary(target);
    }
    if (typeArg === 'seo' || typeArg === 'all') {
      await translateSEOConfigs(target);
    }
    if (typeArg === 'tools' || typeArg === 'all') {
      await translateToolContent(target);
    }
    if (typeArg === 'blog' || typeArg === 'all') {
      await translateBlogPosts(target);
    }
  }

  geminiPool.printSummary();
}

main().catch(console.error);
