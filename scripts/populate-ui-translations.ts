import * as fs from 'fs';
import * as path from 'path';
import { geminiPool } from './gemini-api-manager';
import { TARGET_LANGUAGES } from './translate-project';
import { TOOL_MAPPING } from '../config/tool-mapping';
import { SEO_CONFIGS } from '../config/seo-config';

// 1. English baseline for new UI sections
export const EN_HOME_CONTENT = {
  whatIsReflextryTitle: "What is Reflextry?",
  whatIsReflextryDesc1: "Reflextry offers 50+ free browser games for reaction time, memory, typing, clicking, accuracy, and aim practice. Each test records a score for that task so you can compare your own sessions.",
  whatIsReflextryDesc2: "A browser score includes the effects of your screen, input device, browser, and test settings. It is not a direct measurement of biological latency or a clinical assessment.",
  comparableSessionsTitle: "Make your practice sessions comparable",
  comparableStep1: "Choose the same test, difficulty, and input device each time.",
  comparableStep2: "Read the scoring rules before starting. Milliseconds, accuracy, span length, and words per minute describe different tasks.",
  comparableStep3: "Repeat several trials and compare trends rather than one unusually good score.",
  comparableStep4: "Take a break if you feel tired or uncomfortable.",
  comparableFooterPre: "Read our ",
  testingMethodology: "testing methodology",
  comparableFooterMid: " for scoring formulas and hardware limitations. Your ",
  personalStatistics: "personal statistics",
  comparableFooterPost: " show your own recorded progress, not population norms.",
  betterScoreTitle: "What a better score means",
  betterScoreDesc1Pre: "Practice gains are strongest on trained tasks; broad benefits in everyday cognition are less established. See ",
  simonsReview: "Simons and colleagues’ review of brain-training research",
  betterScoreDesc1Post: ". This research does not validate Reflextry as a medical or intelligence test.",
  betterScoreDesc2Pre: "We do not publish a verified global benchmark dataset. Use your own repeated results as a practice baseline. For background and references, visit ",
  theSciencePage: "the science page",
  betterScoreDesc2Post: ".",
  faqTitle: "Frequently asked questions",
  faq1Q: "Does brain training actually work?",
  faq1A: "Practice can improve performance on the task you train. A better game score does not establish improved intelligence, safer driving, or prevention of cognitive decline. Reflextry tests are practice tools, not clinical assessments.",
  faq2Q: "How often should I practice?",
  faq2A: "Start with a short session that fits your schedule and stop when tired or uncomfortable. Compare the same test and difficulty on the same device. There is no validated Reflextry training dose or guaranteed improvement timeline.",
  faq3Q: "Can I use Reflextry for an esports warmup?",
  faq3A: "You can use the aim, tracking, and reaction games for a browser-based warmup. Their scores measure performance in these exercises, not your rank or likely performance in another game.",
  faq4Q: "Is Reflextry free?",
  faq4A: "The tests are free to play in your browser. You can start a test without creating an account.",
  aboutTheLab: "About the lab",
  aboutTheLabDesc: "Who builds Reflextry, our methodology, and how to contact us.",
  allGuides: "All guides",
  allGuidesDesc: "Memory, reflex, speed, and accuracy articles from the Cognitive Journal.",
  faqCardTitle: "FAQ",
  faqCardDesc: "Training frequency, privacy, scoring, and common product questions.",
  whatReflextryMeasures: "What Reflextry Measures",
  whatReflextryMeasuresDesc: "Free browser tests for reaction time, working memory, click speed, aim, and accuracy. Measure a baseline, practice in short sessions, and track progress on the statistics page—no account required for core tools."
};

export const EN_FOOTER_EXTRA = {
  features: "Features",
  achievements: "Achievements",
  research: "Research",
  methodology: "Methodology",
  trainingPrograms: "Training Programs",
  faq: "FAQ",
  cookiePreferences: "Cookie preferences",
  platformMethodology: "About Reflextry Platform & Methodology",
  brainTrainingTitle: "Brain Training:",
  brainTrainingText: "We built Reflextry to give gamers and competitive players a raw, unfiltered look at their baseline mechanics. No fluff, just pure performance tracking. By pushing your working memory and visual pattern recognition to the limit every day, you force your brain to build faster, stronger neural pathways—a process known as neuroplasticity. We isolate specific cognitive loads (like spatial recall and sequence memory) so you can train exactly what you're weak at.",
  esportsTitle: "Esports Latency:",
  esportsText: "In competitive gaming, 50 milliseconds is the difference between clicking a head and getting sent back to the lobby. Our Speed and Reflex arenas strip away all external game mechanics to measure your raw biological reaction time. We track your Click-Per-Second (CPS), flick-shot accuracy, and raw tracking speed. We heavily optimized our testing environment to cut out browser-level input lag, giving you a true measurement of your hardware and nervous system working together. Use these tools to warm up your fast-twitch muscles before jumping into ranked.",
  accuracyTitle: "Accuracy:",
  accuracyText: "Speed means nothing if you miss. The Accuracy Hub forces you to lock in and prioritize precision over raw velocity. Through spatial grids, angle estimation, and color matching, you refine your fine motor control. Training speed and accuracy simultaneously teaches your central nervous system to hit complex mechanical movements efficiently. We save all your session data so you can actually see your performance curve go up over time. 10 minutes of focused practice here beats 5 hours of mindless grinding.",
  clinicalRef: "Clinical Ref:",
  brainTrainingResearch: "brain training research",
  allRightsReserved: "ALL RIGHTS RESERVED.",
  lastUpdate: "LST UPDATE: JUL 2026",
  builtWith: "BUILT WITH",
  forGamers: "FOR GAMERS"
};

export const EN_CATEGORY_HUB = {
  reflex: {
    heroTitle: "Reflex Training & Reaction Games",
    heroSubtitle: "Measure your visual and auditory reaction times down to the millisecond.",
    heroDesc: "In professional sports, esports, and driving, reflex time is critical. Our reflex suite isolates different sensory pathways—visual, auditory, and directional—so you can pinpoint your fastest response times and train to lower your latency.",
    whatItCovers: "What This Arena Covers",
    whatItCoversDesc: "Visual and auditory reaction tests timed in milliseconds—simple reaction, sound cues, grid clicks, peripheral targets, and multi-stimulus choices. Built to isolate stimulus-to-response latency for practice and warm-ups.",
    benefit1Title: "Visual Reflex",
    benefit1Desc: "React to colors",
    benefit2Title: "Audio Reflex",
    benefit2Desc: "React to sounds",
    benefit3Title: "Spatial Reflex",
    benefit3Desc: "React across screen"
  },
  memory: {
    heroTitle: "Memory Training Games & Cognitive Recall",
    heroSubtitle: "Strengthen your working memory capacity, digit span, and spatial recall.",
    heroDesc: "Working memory is the mental workspace you use when following directions or solving problems. Our memory games leverage adaptive difficulty: as you improve, the challenge scales up to push your retention limits.",
    whatItCovers: "What This Arena Covers",
    whatItCoversDesc: "Spatial patterns, numeric sequences, verbal recognition, and multi-object tracking. Built to exercise your working memory buffer through progressive challenge levels.",
    benefit1Title: "Spatial Recall",
    benefit1Desc: "Tile layout memory",
    benefit2Title: "Digit Span",
    benefit2Desc: "Numeric memory retention",
    benefit3Title: "Pattern Sequence",
    benefit3Desc: "Expanding flash patterns"
  },
  speed: {
    heroTitle: "Speed Tests & Velocity Benchmarks",
    heroSubtitle: "Push your clicks per second (CPS), typing speed (WPM), and calculation agility.",
    heroDesc: "Speed benchmarks measure the raw throughput of your neuromuscular system—how many precise actions you can execute per unit of time across mouse and keyboard inputs.",
    whatItCovers: "What This Arena Covers",
    whatItCoversDesc: "Mouse clicking speed across multiple intervals, typing words per minute, rapid mental math, and visual scanning on Schulte tables.",
    benefit1Title: "Click Speed",
    benefit1Desc: "Measure raw CPS",
    benefit2Title: "Typing Speed",
    benefit2Desc: "Benchmark WPM",
    benefit3Title: "Mental Math",
    benefit3Desc: "Rapid calculations"
  },
  accuracy: {
    heroTitle: "Aim & Precision Training",
    heroSubtitle: "Refine your micro-target accuracy, hand-eye coordination, and visual estimation.",
    heroDesc: "Speed means nothing without precision. Our accuracy modules train you to lock in and hit targets cleanly with minimal error margins.",
    whatItCovers: "What This Arena Covers",
    whatItCoversDesc: "Precision micro-clicking, angle estimation, pattern matching, color discrimination, and data entry accuracy.",
    benefit1Title: "Precision Aim",
    benefit1Desc: "Micro-target clicks",
    benefit2Title: "Spatial Angles",
    benefit2Desc: "Angle estimation",
    benefit3Title: "Visual Match",
    benefit3Desc: "Pattern recognition"
  },
  gaming: {
    heroTitle: "Esports Warmup & Aim Arena",
    heroSubtitle: "Calibrate mouse flick shots, target tracking, and combat reflexes for competitive games.",
    heroDesc: "Built specifically for gamers in Counter-Strike, Valorant, Apex Legends, and Overwatch to warm up mechanical muscle memory before jumping into ranked games.",
    whatItCovers: "What This Arena Covers",
    whatItCoversDesc: "Flick shot aim, continuous target tracking, split-second combat reflexes, and dodging obstacle streams.",
    benefit1Title: "Flick Shots",
    benefit1Desc: "Target acquisition",
    benefit2Title: "Tracking",
    benefit2Desc: "Smooth target follow",
    benefit3Title: "Combat Reflex",
    benefit3Desc: "Rapid decision making"
  }
};

export const EN_ALL_TOOLS = {
  title: "All Training Tools",
  subtitle: "Explore our complete suite of cognitive and psychomotor tests. Filter by arena or browse below to start benchmarking.",
  filterAll: "All Tools",
  filterMemory: "Memory",
  filterReflex: "Reflex",
  filterSpeed: "Speed",
  filterAccuracy: "Accuracy",
  filterGaming: "Gaming",
  startTest: "Start Test"
};

/**
 * Extracts clean short title and description for each tool from seo-config.json
 */
function extractToolsFromSeoConfig(seoConfig: Record<string, any>): Record<string, { title: string; desc: string }> {
  const tools: Record<string, { title: string; desc: string }> = {};

  for (const [canonicalId, href] of Object.entries(TOOL_MAPPING)) {
    const item = seoConfig[canonicalId];
    if (item && item.title && item.description) {
      const cleanTitle = item.title.split(/\s*[-–—|]\s*/)[0].trim();
      const entry = {
        title: cleanTitle,
        desc: item.description.trim()
      };
      // Map both canonical id and short id
      tools[canonicalId] = entry;

      const pathSegments = href.split('/').filter(Boolean);
      const shortId = pathSegments[pathSegments.length - 1];
      if (shortId && shortId !== canonicalId) {
        tools[shortId] = entry;
      }
    }
  }

  return tools;
}

async function main() {
  console.log("🚀 Starting UI Translations Population for all 16 locales...");

  // 1. Process English first
  const enDictPath = path.resolve(process.cwd(), 'lib/i18n/dictionaries/en.json');
  const enDict = JSON.parse(fs.readFileSync(enDictPath, 'utf8'));

  enDict.homeContent = EN_HOME_CONTENT;
  enDict.footer = { ...enDict.footer, ...EN_FOOTER_EXTRA };
  enDict.categoryHub = EN_CATEGORY_HUB;
  enDict.allTools = EN_ALL_TOOLS;
  enDict.tools = extractToolsFromSeoConfig(SEO_CONFIGS);

  fs.writeFileSync(enDictPath, JSON.stringify(enDict, null, 2), 'utf8');
  console.log("✅ [EN] Base English dictionary updated.");

  const bundleToTranslate = {
    homeContent: EN_HOME_CONTENT,
    footerExtra: EN_FOOTER_EXTRA,
    categoryHub: EN_CATEGORY_HUB,
    allTools: EN_ALL_TOOLS
  };

  // 2. Process all target languages
  for (const target of TARGET_LANGUAGES) {
    const dictPath = path.resolve(process.cwd(), `lib/i18n/dictionaries/${target.code}.json`);
    const seoPath = path.resolve(process.cwd(), `content/translations/${target.code}/seo-config.json`);

    let dict: Record<string, any> = {};
    if (fs.existsSync(dictPath)) {
      dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    }

    // A. Tools extraction from localized seo-config.json
    if (fs.existsSync(seoPath)) {
      const seoConfig = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
      dict.tools = extractToolsFromSeoConfig(seoConfig);
      console.log(`📦 [${target.code.toUpperCase()}] Injected ${Object.keys(dict.tools).length} localized tool definitions.`);
    }

    // B. Check if sections already translated
    const hasHomeContent = dict.homeContent && dict.homeContent.whatIsReflextryTitle;
    const hasCategoryHub = dict.categoryHub && dict.categoryHub.reflex && dict.categoryHub.reflex.heroTitle;
    const hasAllTools = dict.allTools && dict.allTools.title;

    if (hasHomeContent && hasCategoryHub && hasAllTools) {
      console.log(`⏩ [${target.code.toUpperCase()}] UI sections already translated. Saving with latest tools.`);
      fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
      continue;
    }

    console.log(`🌐 [${target.code.toUpperCase()}] Translating UI Sections into ${target.name}...`);
    try {
      const translated = await geminiPool.translateJson(
        target.name,
        target.code,
        bundleToTranslate,
        'Cognitive lab, reaction tests, memory games, speed and accuracy training platform UI'
      );

      if (translated.homeContent) dict.homeContent = translated.homeContent;
      if (translated.footerExtra) dict.footer = { ...dict.footer, ...translated.footerExtra };
      if (translated.categoryHub) dict.categoryHub = translated.categoryHub;
      if (translated.allTools) dict.allTools = translated.allTools;

      fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
      console.log(`✅ [${target.code.toUpperCase()}] Successfully saved translated UI dictionary.`);
    } catch (err: any) {
      console.error(`❌ [${target.code.toUpperCase()}] Failed to translate UI sections:`, err.message);
    }
  }

  console.log("\n🎉 Finished populating all UI translations!");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
