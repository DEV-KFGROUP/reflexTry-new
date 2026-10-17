import * as fs from 'fs';
import * as path from 'path';
import { geminiPool } from './gemini-api-manager';

const DICT_DIR = path.join(process.cwd(), 'lib', 'i18n', 'dictionaries');

const LOCALES: { code: string; name: string }[] = [
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'id', name: 'Indonesian' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh-CN', name: 'Simplified Chinese' },
  { code: 'zh-TW', name: 'Traditional Chinese' },
  { code: 'nl', name: 'Dutch' },
];

const ENGLISH_PAGES_DATA = {
  about: {
    identityProfile: "Identity Profile",
    heroTitle: "About",
    heroTitleHighlight: "Us",
    heroSubtitle: "A no-nonsense platform for measuring and pushing your mechanical limits. Built by competitive players for anyone who wants to get sharper.",
    missionLabel: "Mission Statement",
    missionTitle: "Our Mission",
    missionDesc: "Our mission is simple: democratize the exact same high-level reaction and cognitive testing tools used by pro esports teams. Improvement starts with raw, honest data. We built Reflextry so you can find your exact baseline, lock in, and beat it.",
    originLabel: "Origin Log",
    originTitle: "Our Story",
    originP1: "Reflextry began as a small side project: a browser script to measure click latency without installing another desktop trainer. That one tool turned into a question we kept hearing—can we put memory, reflex, speed, accuracy, and aim drills in one place, free to try, with scores you can track yourself?",
    originP2: "We built the site in Surat, India, as a small two-person team. Every module ships as a real interactive test in the browser—not a download wall, not a paywalled “premium battery.” Progress lives in your session and statistics tools so you can see trends without creating an account for core practice.",
    originP3: "Today Reflextry is used by gamers warming up before ranked, students drilling working memory, and curious visitors checking reaction time or color vision. We keep expanding the suite carefully: new tests only ship when scoring rules are clear and the UI explains what the number means.",
    coreValuesLabel: "Core Values",
    valAccuracyTitle: "Accuracy",
    valAccuracyDesc: "No fluff, just precise measurements and reliable testing to track your true mechanical baseline.",
    valInnovationTitle: "Innovation",
    valInnovationDesc: "Constantly pushing new modules to test the absolute limits of human reaction time.",
    valAccessibilityTitle: "Accessibility",
    valAccessibilityDesc: "Professional-grade testing and performance tracking tools, completely free for everyone.",
    valUserFirstTitle: "User First",
    valUserFirstDesc: "We build what the community asks for. If a game mode sucks, we fix it.",
    whatWeOfferLabel: "What We Offer",
    offerBrainTitle: "Brain Training Games",
    offerBrainDesc: "Push your working memory and pattern recognition with cognitive loads designed to force neuroplasticity.",
    offerReflexTitle: "Reaction & Speed Tests",
    offerReflexDesc: "Measure your raw physical latency down to the exact millisecond in our aim, click, and reaction arenas.",
    offerTrackingTitle: "Progress Tracking",
    offerTrackingDesc: "Automatically log your session data and watch your performance curve go up over time.",
    offerLeaderboardTitle: "Achievements & Leaderboards",
    offerLeaderboardDesc: "Unlock ranks, grind daily challenges, and see where you stack up against players worldwide.",
    ctaTitle: "Ready to Find Your Baseline?",
    ctaDesc: "No account needed. Just pick a tool, lock in, and test your speed.",
    ctaStart: "Start Reaction Test",
    ctaExplore: "Explore All Tools"
  },
  faqPage: {
    heroTitle: "Frequently Asked Questions",
    heroSubtitle: "Everything you need to know about the tests, training benefits, and scoring.",
    catGettingStarted: "Getting Started",
    catBrainTraining: "Brain Training",
    catMemoryTraining: "Memory Training",
    catReactionTime: "Reaction Time",
    catSpeedAim: "Speed & Aim",
    catPrivacyScores: "Privacy & Scores",
    q1: "What exactly is Reflextry?",
    a1: "It's a free platform built to measure and improve your raw mechanical skills—things like reaction time, working memory, and clicking accuracy. No downloads or sign-ups required. Just pick a tool and start testing your limits.",
    q2: "Do I have to create an account?",
    a2: "Nope. Everything is completely free and accessible right now. We'll be adding optional accounts later if you want to save your progress across devices or compete on global leaderboards, but the core tools will always be open.",
    q3: "Where should I start?",
    a3: "If you play shooters, hit the Aim Trainer or Reaction Time Test. If you're here for cognitive training, try Sequence Memory or Number Memory. We recommend just trying a few out to see where your baseline is at.",
    q4: "Does brain training actually do anything?",
    a4: "Yes, it's called 'near transfer' in neuroscience. If you practice remembering number sequences daily, your brain physically adapts (neuroplasticity) and you get better at holding information in your short-term memory. It's like going to the gym, but for your central nervous system.",
    q5: "How long until I see results?",
    a5: "If you grind for 10-20 minutes a day, you'll start seeing your scores go up within 2 to 3 weeks. Consistency matters way more than doing a massive 2-hour session once a week.",
    q6: "How do I stop forgetting things immediately?",
    a6: "The quickest hack is 'chunking'—grouping items together (like remembering a phone number in blocks rather than single digits). Also, your brain deletes things it thinks are useless, so you have to actively focus and force recall to make it stick.",
    q7: "Working memory vs long-term memory?",
    a7: "Working memory is your brain's RAM—it holds what you're thinking about right now. Long-term memory is the hard drive. Our tools strictly train your RAM, so you can process more things simultaneously without dropping the ball.",
    q8: "What is a 'good' reaction time?",
    a8: "The global average visual reaction time sits around 200–250ms. Competitive gamers frequently clock in at 150–190ms. Anything under 150ms is top 1% human capability.",
    q9: "Does my monitor or mouse cause input lag?",
    a9: "Yes. A 60Hz monitor adds ~16ms of frame delay compared to a 144Hz (~7ms) or 240Hz (~4ms) panel. Wireless mice with poor polling rates can also add latency. For pure test accuracy, use a gaming mouse and high-refresh display.",
    q10: "Can I train my CPS (Clicks Per Second)?",
    a10: "Yes. Standard clicking usually caps around 6–8 CPS. Techniques like jitter clicking or butterfly clicking can push you past 12–16 CPS.",
    q11: "Is my score saved if I close the browser?",
    a11: "Your scores and session records are stored locally in your browser's local storage. They persist across reloads on the same device and browser.",
    q12: "Do you sell or collect my personal data?",
    a12: "No. We do not track or sell personal identifying data. All cognitive and reaction test metrics belong to you."
  },
  contact: {
    heroTitle: "Get in",
    heroTitleHighlight: "Touch",
    heroSubtitle: "Questions, feature suggestions, partnership requests, or bug reports? We read every message.",
    generalInquiries: "General Inquiries",
    generalInquiriesDesc: "For general inquiries, partnerships, and press.",
    technicalSupport: "Technical Support",
    technicalSupportDesc: "For bug reports, device issues, or scoring questions.",
    feedbackTitle: "Feedback & Ideas",
    feedbackDesc: "Suggest a new module or improvements to existing games.",
    formName: "Your Name",
    formNamePlaceholder: "e.g. Alex Chen",
    formEmail: "Email Address",
    formEmailPlaceholder: "you@example.com",
    formSubject: "Subject",
    formSubjectPlaceholder: "How can we help?",
    formMessage: "Message",
    formMessagePlaceholder: "Tell us what's on your mind...",
    formSubmit: "Send Message",
    formSending: "Sending...",
    successMsg: "Message sent successfully!",
    errorMsg: "Failed to send message. Please try again."
  },
  leaderboard: {
    heroTitle: "Global Leaderboard",
    heroSubtitle: "Compete against players worldwide and track your progress across all Reflextry challenges. Establish your baseline and reach for the top tier.",
    personalBests: "Personal Bests",
    personalBestsDesc: "Your top scores locally",
    globalRankings: "Global Rankings",
    globalRankingsDesc: "Compare worldwide",
    trackProgress: "Track Progress",
    trackProgressDesc: "See your improvements",
    myScores: "My Scores",
    global: "Global",
    rank: "Rank",
    player: "Player",
    score: "Score",
    date: "Date",
    testNow: "Test Now",
    noScoresYet: "No scores recorded yet. Complete a test to see your ranking!"
  },
  statistics: {
    heroTitle: "Personal Statistics",
    heroSubtitle: "Track your historical performance curves, consistency scores, and personal bests.",
    totalSessions: "Total Sessions",
    bestPerformance: "Best Performance",
    averageScore: "Average Score",
    scoreTrend: "Score Trend",
    noData: "No session data recorded yet. Play a game to view your stats!",
    downloadData: "Export Data",
    selectTest: "Select Test",
    clearHistory: "Clear History"
  },
  challenges: {
    heroTitle: "Daily Challenges",
    heroSubtitle: "Complete your daily cognitive exercises to build consistency, earn streak rewards, and level up.",
    streak: "Current Streak",
    days: "Days",
    todayChallenge: "Today's Challenge",
    target: "Target:",
    completed: "Completed!",
    startChallenge: "Start Challenge",
    streakReward: "Streak Multiplier",
    howItWorks: "How Daily Challenges Work",
    howItWorksP1: "A new challenge is generated every 24 hours. Clear the objective to maintain your daily streak.",
    howItWorksP2: "Consistent daily training promotes neuroplastic adaptation and prevents cognitive plateauing."
  },
  achievements: {
    heroTitle: "Achievements & Trophies",
    heroSubtitle: "Unlock prestigious medals as you break reaction speed barriers and achieve cognitive milestones.",
    totalUnlocked: "Total Unlocked",
    unlocked: "Unlocked",
    locked: "Locked",
    rarityCommon: "Common",
    rarityRare: "Rare",
    rarityEpic: "Epic",
    rarityLegendary: "Legendary"
  }
};

async function main() {
  console.log('🚀 Starting translation of all remaining pages (about, faqPage, contact, leaderboard, statistics, challenges, achievements)...');

  // 1. Update English first
  const enPath = path.join(DICT_DIR, 'en.json');
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  for (const [sectionKey, sectionObj] of Object.entries(ENGLISH_PAGES_DATA)) {
    enJson[sectionKey] = { ...enJson[sectionKey], ...sectionObj };
  }
  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2), 'utf8');
  console.log('✅ Updated en.json');

  // 2. Translate for each locale
  for (const locale of LOCALES) {
    const filePath = path.join(DICT_DIR, `${locale.code}.json`);
    if (!fs.existsSync(filePath)) continue;
    const targetJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Check if all sections already exist
    const needsTranslation = Object.keys(ENGLISH_PAGES_DATA).some(
      sec => !targetJson[sec] || Object.keys(targetJson[sec]).length < Object.keys((ENGLISH_PAGES_DATA as any)[sec]).length
    );

    if (!needsTranslation) {
      console.log(`⏩ [${locale.code}] Already has all page translations.`);
      continue;
    }

    console.log(`\n🌐 Translating pages for locale: [${locale.code} - ${locale.name}]...`);

    try {
      const translatedObj = await geminiPool.translateJson(
        locale.name,
        locale.code,
        ENGLISH_PAGES_DATA,
        'Cognitive & reflex performance web platform UI and pages'
      );

      for (const [secKey, secVal] of Object.entries(translatedObj)) {
        targetJson[secKey] = { ...targetJson[secKey], ...(secVal as object) };
      }

      fs.writeFileSync(filePath, JSON.stringify(targetJson, null, 2), 'utf8');
      console.log(`✅ Successfully translated and updated ${locale.code}.json`);
    } catch (err: any) {
      console.error(`❌ Error translating for [${locale.code}]:`, err.message);
    }
  }

  geminiPool.printSummary();
  console.log('\n🎉 Finished translating all website pages across all 16 languages!');
}

main();
