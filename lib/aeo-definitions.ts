export interface DefinedTermItem {
    id: string;
    name: string;
    description: string;
    inDefinedTermSet: string;
    termCode: string;
    urlPath: string;
    alternateNames?: string[];
    quickAnswer: string;
    benchmarkData?: {
        average: string;
        good: string;
        elite: string;
        unit: string;
    };
}

export const AEO_DEFINITIONS: Record<string, DefinedTermItem> = {
    "reaction-time": {
        id: "reaction-time",
        name: "Visual Reaction Time",
        description: "The time interval between the presentation of a visual stimulus and the initiation of a physical motor response.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "VRT-01",
        urlPath: "/reflex/reaction",
        alternateNames: ["Reflex Speed", "Response Time", "Visual Latency"],
        quickAnswer: "The average visual reaction time for humans is 200 to 250 milliseconds. Elite esports athletes, drivers, and pilots often achieve reaction times between 150ms and 180ms.",
        benchmarkData: {
            average: "215ms - 260ms",
            good: "180ms - 210ms",
            elite: "Sub-180ms",
            unit: "milliseconds (ms)"
        }
    },
    "cps-speed": {
        id: "cps-speed",
        name: "Clicks Per Second (CPS)",
        description: "A motor speed metric measuring the number of mouse button clicks executed within a 1-second timeframe.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "CPS-01",
        urlPath: "/speed/click",
        alternateNames: ["Click Speed", "CPS Rate", "Mouse Click Rate"],
        quickAnswer: "Average human click speed using standard single clicking is 6 to 7 CPS. Advanced techniques like jitter clicking reach 10-14 CPS, while butterfly clicking can reach 15-20 CPS.",
        benchmarkData: {
            average: "6.0 - 7.5 CPS",
            good: "8.0 - 11.0 CPS",
            elite: "12.0+ CPS",
            unit: "clicks per second"
        }
    },
    "typing-wpm": {
        id: "typing-wpm",
        name: "Typing WPM (Words Per Minute)",
        description: "A standardized measure of typing speed calculated as 5 keystrokes per word adjusted for uncorrected errors.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "WPM-01",
        urlPath: "/speed/typing",
        alternateNames: ["Typing Speed", "Net WPM", "Keystrokes Per Minute"],
        quickAnswer: "The average typing speed is 40 words per minute (WPM) with approximately 92% accuracy. Professional typists and programmers typically achieve 70 to 100+ WPM with >97% accuracy.",
        benchmarkData: {
            average: "38 - 45 WPM",
            good: "65 - 85 WPM",
            elite: "100+ WPM",
            unit: "words per minute"
        }
    },
    "working-memory": {
        id: "working-memory",
        name: "Working Memory Capacity",
        description: "The cognitive system with a limited capacity responsible for temporarily holding and manipulating information in conscious awareness.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "WM-01",
        urlPath: "/memory",
        alternateNames: ["Short-term Memory Span", "Digit Span", "Spatial Span"],
        quickAnswer: "Human working memory capacity is traditionally 7 ± 2 items (Miller's Law) or approximately 4 distinct chunks of information under strict cognitive load.",
        benchmarkData: {
            average: "Level 7 - 8",
            good: "Level 9 - 11",
            elite: "Level 12+",
            unit: "memory sequence items"
        }
    },
    "aim-precision": {
        id: "aim-precision",
        name: "FPS Aim Precision & Flick Accuracy",
        description: "The motor control metric quantifying mouse cursor placement accuracy and flick movement latency in target acquisition.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "AIM-01",
        urlPath: "/gaming/aim",
        alternateNames: ["Mouse Precision", "Flick Shot Speed", "Target Tracking Accuracy"],
        quickAnswer: "Target acquisition accuracy above 95% combined with a sub-300ms reaction time per target represents top-tier aim mechanics in competitive FPS gaming.",
        benchmarkData: {
            average: "75% - 85% Accuracy",
            good: "86% - 94% Accuracy",
            elite: "95%+ Accuracy",
            unit: "hit accuracy percentage"
        }
    },
    // ── Expanded definitions (Phase 2) ──
    "sequence-memory": {
        id: "sequence-memory",
        name: "Sequence Memory (Corsi Block Test)",
        description: "A visuospatial working memory assessment requiring sequential recall of expanding spatial light patterns on a grid.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "SEQ-01",
        urlPath: "/memory/sequence",
        alternateNames: ["Corsi Block Test", "Simon Game", "Pattern Sequence Test"],
        quickAnswer: "The average Sequence Memory score is Level 7-8. A good score is Level 9-11, and elite performers reach Level 12+. This test is based on the Corsi Block-Tapping Task, a standard neuropsychological assessment for spatial working memory.",
        benchmarkData: {
            average: "Level 7 - 8",
            good: "Level 9 - 11",
            elite: "Level 12+",
            unit: "sequence steps"
        }
    },
    "number-memory": {
        id: "number-memory",
        name: "Number Memory (Digit Span)",
        description: "A standardized measure of short-term verbal/numerical memory capacity based on the forward digit span paradigm.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "NM-01",
        urlPath: "/memory/number",
        alternateNames: ["Digit Span Test", "Number Recall", "Digit Memory"],
        quickAnswer: "The average number memory span is 7-9 digits. Most adults can reliably recall 7 digits, while trained individuals may exceed 12+ digits using mnemonic chunking strategies.",
        benchmarkData: {
            average: "7 - 9 digits",
            good: "10 - 12 digits",
            elite: "13+ digits",
            unit: "digit count"
        }
    },
    "visual-memory": {
        id: "visual-memory",
        name: "Visual Memory (Spatial Grid Recall)",
        description: "A spatial pattern recognition test measuring the ability to encode and recall briefly-presented grid patterns.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "VM-01",
        urlPath: "/memory/visual",
        alternateNames: ["Grid Memory Test", "Pattern Recall", "Photographic Memory Test"],
        quickAnswer: "Average visual memory scores reach Level 8-10 on expanding grid tests. Good scores are Level 11-13, and elite scores exceed Level 14. Visual memory engages the right hemisphere and parietal cortex.",
        benchmarkData: {
            average: "Level 8 - 10",
            good: "Level 11 - 13",
            elite: "Level 14+",
            unit: "grid complexity level"
        }
    },
    "chimp-test": {
        id: "chimp-test",
        name: "Chimp Test (Primate Memory Benchmark)",
        description: "A working memory assessment inspired by Kyoto University primate cognition research, testing rapid spatial number recall.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "CT-01",
        urlPath: "/memory/chimp-test",
        alternateNames: ["Chimpanzee Memory Test", "Spatial Number Recall"],
        quickAnswer: "The average Chimp Test score is 7-8 numbers recalled correctly. Young chimpanzees at Kyoto University can recall 9 numbers in sequence faster than most adult humans, demonstrating superior eidetic-like spatial recall.",
        benchmarkData: {
            average: "7 - 8 numbers",
            good: "9 - 11 numbers",
            elite: "12+ numbers",
            unit: "numbers recalled"
        }
    },
    "audio-reaction": {
        id: "audio-reaction",
        name: "Auditory Reaction Time",
        description: "The latency between an auditory stimulus (sound cue) and the initiation of a motor response.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "ART-01",
        urlPath: "/reflex/sound",
        alternateNames: ["Sound Reaction Time", "Audio Reflex Speed"],
        quickAnswer: "The average auditory reaction time is 140-160 milliseconds, approximately 30-50ms faster than visual reaction time. This is because auditory signals reach the brain through a shorter neural pathway via the auditory cortex.",
        benchmarkData: {
            average: "140ms - 160ms",
            good: "120ms - 140ms",
            elite: "Sub-120ms",
            unit: "milliseconds (ms)"
        }
    },
    "schulte-table": {
        id: "schulte-table",
        name: "Schulte Table (Visual Search Speed)",
        description: "A 5×5 grid attention test developed by German psychiatrist Walter Schulte to measure visual search speed, peripheral vision, and cognitive processing.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "ST-01",
        urlPath: "/speed/schulte-table",
        alternateNames: ["Schulte Grid", "Number Search Test", "Attention Grid"],
        quickAnswer: "A good Schulte Table completion time is under 30 seconds for a 5×5 grid. The average is 30-45 seconds. Elite performers complete it in under 15 seconds using peripheral vision rather than focused scanning.",
        benchmarkData: {
            average: "30 - 45 seconds",
            good: "20 - 30 seconds",
            elite: "Under 15 seconds",
            unit: "seconds"
        }
    },
    "verbal-memory": {
        id: "verbal-memory",
        name: "Verbal Memory (Word Recognition)",
        description: "A verbal working memory test measuring the ability to distinguish previously seen words from novel words under increasing cognitive load.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "VBM-01",
        urlPath: "/memory/verbal-memory",
        alternateNames: ["Word Memory Test", "Verbal Recognition", "Word Recall Test"],
        quickAnswer: "The average verbal memory score is 50-70 words correctly identified. Good scores reach 80-100 words, while elite performers exceed 120+ words. This test engages Broca's area and the left prefrontal cortex.",
        benchmarkData: {
            average: "50 - 70 words",
            good: "80 - 100 words",
            elite: "120+ words",
            unit: "words correct"
        }
    },
    "mental-math": {
        id: "mental-math",
        name: "Mental Math Speed",
        description: "A cognitive processing speed test measuring rapid mental arithmetic performance under time pressure.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "MM-01",
        urlPath: "/speed/math",
        alternateNames: ["Mental Arithmetic Test", "Math Speed Test", "Rapid Calculation"],
        quickAnswer: "Average mental math speed is 15-20 problems solved per minute for basic arithmetic. Good performance is 25-35 problems per minute, while elite mental calculators exceed 40+ problems per minute.",
        benchmarkData: {
            average: "15 - 20 per minute",
            good: "25 - 35 per minute",
            elite: "40+ per minute",
            unit: "problems per minute"
        }
    },
    "n-back": {
        id: "n-back",
        name: "N-Back Test (Working Memory Updating)",
        description: "A clinical-standard continuous performance test measuring working memory updating and cognitive control by requiring comparison of current stimuli to those presented N steps earlier.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "NB-01",
        urlPath: "/memory/n-back",
        alternateNames: ["Dual N-Back", "Working Memory Updating Test"],
        quickAnswer: "Most adults can reliably perform the 2-Back task. A 3-Back score above 80% accuracy is considered good. The N-Back test is the gold standard for working memory training and has been shown to improve fluid intelligence in peer-reviewed research.",
        benchmarkData: {
            average: "2-Back at 70-80%",
            good: "3-Back at 80%+",
            elite: "4-Back+ at 75%+",
            unit: "N level and accuracy"
        }
    },
    "color-blindness": {
        id: "color-blindness",
        name: "Color Blindness Test (Ishihara-style)",
        description: "An online color vision screening test based on the Farnsworth-Munsell color discrimination paradigm, detecting common red-green and blue-yellow deficiencies.",
        inDefinedTermSet: "https://www.reflextry.com/science#glossary",
        termCode: "CB-01",
        urlPath: "/accuracy/color-blindness",
        alternateNames: ["Color Vision Test", "Ishihara Test Online", "Color Deficiency Screen"],
        quickAnswer: "Approximately 8% of males and 0.5% of females have some form of color vision deficiency. The most common type is red-green color blindness (deuteranopia/protanopia). Online screening tests can detect potential deficiencies but should be confirmed by an ophthalmologist.",
    }
};

