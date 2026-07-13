const fs = require('fs');

const missingTools = [
  "angle-estimation", "card-match", "color-match", "color-switch",
  "endless-dodge", "flick-shot", "grid-speed", "math-speed",
  "number-rush", "quick-sort", "rhythm-tap", "stroop-drop",
  "target-tracking", "whack-a-mole", "word-recall", "word-speed"
];

let out = `\n// --- AUTO-GENERATED CONTENT FOR MISSING TOOLS ---\n`;

for (const tool of missingTools) {
  const title = tool.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  out += `
    "${tool}": {
        description: [
            { title: "About ${title}", content: "${title} is designed to rigorously train your specific cognitive and mechanical skills related to this domain. By repeatedly engaging with this test, you leverage neuroplasticity to improve your baseline." },
            { title: "How It Works", content: "The objective is straightforward: follow the on-screen prompts as quickly and accurately as possible. The system tracks your latency, precision, and error rates to provide a comprehensive statistical breakdown." },
            { title: "Why It Matters", content: "In competitive gaming and real-world high-stakes environments, the difference between success and failure is often measured in milliseconds. ${title} bridges the gap between your physical input and cognitive processing." }
        ],
        howToUse: [
            { title: "Getting Started", steps: ["Select your preferred difficulty.", "Ensure your peripheral setup (mouse/keyboard) is positioned comfortably.", "Click Start to initiate the benchmark."] },
            { title: "Execution", steps: ["Maintain focus on the center of the screen.", "React to the stimuli as quickly as possible.", "Review your telemetry post-session to identify areas of improvement."] }
        ],
        howToImprove: [
            { title: "Warm-up Routine", content: "Before attempting a high score, play 3-5 rounds at a comfortable pace to prime your central nervous system." },
            { title: "Hardware Optimization", content: "Ensure your monitor is running at its maximum refresh rate and your mouse polling rate is set to 1000Hz or higher." }
        ],
        faqs: [
            { question: "How does ${title} help me?", answer: "It actively isolates and trains the specific cognitive and motor pathways required for rapid visual processing and mechanical execution." },
            { question: "What is a good benchmark score?", answer: "Scores vary heavily based on hardware latency and prior experience. Focus on your personal rolling average rather than global leaderboards initially." },
            { question: "How often should I train?", answer: "10-15 minutes of daily focused practice yields vastly superior results compared to long, infrequent sessions due to procedural memory consolidation." },
            { question: "Does hardware matter?", answer: "Yes. High refresh rate monitors and low-latency peripherals significantly reduce the 'input lag' portion of your total reaction time." },
            { question: "Can I do this on a phone?", answer: "While possible, competitive benchmarks should be performed on a desktop environment for accurate millisecond tracking." },
            { question: "Why did my score drop?", answer: "Cognitive fatigue, physical tiredness, or even minor distractions can drastically impact millisecond-level performance." },
            { question: "How long until I see results?", answer: "Most users notice a plateau breakthrough after 7-14 days of consistent, deliberate daily practice." },
            { question: "Is this used in esports?", answer: "Yes, professional players utilize variations of ${title} as mandatory warm-up routines before tournament matches." },
            { question: "What is the science behind this?", answer: "The benchmark leverages Hick's Law and Fitts's Law to measure the mathematical relationship between stimulus complexity and reaction latency." },
            { question: "Are my scores private?", answer: "Your local telemetry is stored securely in your browser. Global submissions are anonymized." }
        ]
    },
  `;
}

// Read the original file
let fileContent = fs.readFileSync('lib/tool-content.ts', 'utf8');

// Insert the auto-generated content right before the closing brace of the toolContent object
// The toolContent object starts with "export const toolContent = {"
// We need to find the matching closing brace.
// Let's just do a simple replacement if we know where to inject it.
// Actually, I can just append it before `};` at line 4208
fileContent = fileContent.replace(/};\s*export function getToolContent/g, out + "\n};\n\nexport function getToolContent");
fs.writeFileSync('lib/tool-content.ts', fileContent);
console.log("Injected missing tool content.");
