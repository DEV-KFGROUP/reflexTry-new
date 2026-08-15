/**
 * AEO Enrichment — "People Also Ask" optimized Q&A pairs
 * 
 * These supplement existing FAQs with question patterns that match 
 * voice-search, Google Featured Snippets, and AI Overview query formats.
 * Each entry is structured for maximum extraction by answer engines.
 */

export interface PAAQuestion {
    question: string;
    answer: string;
    keyPoints?: string[];
}

export const PAA_QUESTIONS: Record<string, PAAQuestion[]> = {
    "reaction-time": [
        {
            question: "What is the average human reaction time?",
            answer: "The average human visual reaction time is between 200 and 250 milliseconds. This measures how quickly your brain detects a visual stimulus, processes it through the visual cortex, and sends a motor signal to your muscles. Factors like age, fatigue, sleep quality, and caffeine intake can shift this baseline by 20-50ms in either direction.",
            keyPoints: [
                "Visual reaction baseline: 200ms - 250ms",
                "Auditory reaction is typically 30-50ms faster",
                "Elite gamers & athletes: 150ms - 180ms"
            ]
        },
        {
            question: "How can I test my reaction time online for free?",
            answer: "You can test your reaction time for free at Reflextry.com using the Reaction Time Test. The test measures visual reaction time in milliseconds — wait for the screen to change color, then click as fast as you can. Your result is compared against global averages from over 1.4 million completed tests across 140+ countries.",
            keyPoints: [
                "No account or download required",
                "Results measured in milliseconds",
                "Compare against global benchmarks"
            ]
        },
        {
            question: "How can I improve my reaction time?",
            answer: "Consistent daily practice of 10-15 minutes is the most effective way to lower your reaction time. The key is neuroplasticity — your brain physically rewires itself through repetition. Start with basic visual reaction tests, then progress to multi-stimulus and choice reaction tests. Sleep, hydration, and limiting screen fatigue also have measurable effects on baseline reaction speed.",
        }
    ],
    "cps-speed": [
        {
            question: "What is a good clicks per second score?",
            answer: "A good CPS (clicks per second) score using standard clicking is 7-8 CPS. The average is 6-7 CPS. Advanced techniques can push this higher: jitter clicking reaches 10-14 CPS, and butterfly clicking can reach 15-20 CPS. The world record for CPS is above 20 clicks per second using specialized techniques.",
            keyPoints: [
                "Average CPS: 6-7 clicks/sec",
                "Good CPS: 7-8 clicks/sec",
                "Jitter clicking: 10-14 CPS",
                "Butterfly clicking: 15-20 CPS"
            ]
        },
        {
            question: "How do I click faster in Minecraft PvP?",
            answer: "To click faster in Minecraft PvP, practice jitter clicking (tensing your forearm to vibrate your finger rapidly) or butterfly clicking (alternating two fingers on the mouse button). Start with a CPS test to establish your baseline, then practice daily. A consistent 8-10 CPS with good aim is more effective than 15+ CPS with poor accuracy.",
        }
    ],
    "typing-wpm": [
        {
            question: "What is the average typing speed?",
            answer: "The average typing speed is approximately 40 words per minute (WPM) with about 92% accuracy. Professional typists and programmers typically achieve 70-100+ WPM with greater than 97% accuracy. The fastest typists in the world exceed 200 WPM in short bursts, though sustained speeds above 150 WPM are exceptionally rare.",
            keyPoints: [
                "Average: 40 WPM with ~92% accuracy",
                "Professional: 70-100+ WPM",
                "World-class: 150+ WPM sustained"
            ]
        },
        {
            question: "How can I increase my typing speed?",
            answer: "To increase your typing speed: (1) learn proper touch typing technique — use all 10 fingers and never look at the keyboard; (2) practice with a typing test daily for 15-20 minutes; (3) focus on accuracy first, speed follows naturally; (4) gradually increase difficulty with longer passages. Most people can improve from 40 WPM to 60+ WPM within 4-8 weeks of consistent practice.",
        }
    ],
    "working-memory": [
        {
            question: "What is working memory capacity?",
            answer: "Working memory capacity is the number of items you can hold and manipulate in conscious awareness simultaneously. Cognitive psychologist George Miller established the classic limit of 7 ± 2 items in 1956. Modern research by Nelson Cowan suggests the true limit is closer to 4 distinct chunks under strict cognitive load. Working memory is critical for reading comprehension, mental math, and following complex instructions.",
            keyPoints: [
                "Classic limit: 7 ± 2 items (Miller's Law)",
                "Modern estimate: ~4 chunks (Cowan's model)",
                "Can be trained through targeted exercises"
            ]
        },
        {
            question: "Can you actually improve working memory?",
            answer: "Yes. Research published in the Proceedings of the National Academy of Sciences (Jaeggi et al., 2008) demonstrated that intensive working memory training can lead to improvements in fluid intelligence. Targeted exercises like the N-Back test, Sequence Memory, and Chimp Test force adaptive challenge — as you improve, difficulty scales up, driving neuroplastic adaptation in the prefrontal cortex and parietal regions.",
        }
    ],
    "aim-precision": [
        {
            question: "What is a good aim accuracy in FPS games?",
            answer: "In competitive FPS gaming, an aim accuracy above 90% on tracking targets and 85%+ on flick shots is considered good. Elite players maintain 95%+ accuracy combined with sub-300ms target acquisition time. Professional esports players in games like Valorant and CS2 train aim mechanics daily using dedicated aim trainers to maintain consistent accuracy under competitive pressure.",
            keyPoints: [
                "Good accuracy: 85-90%",
                "Elite accuracy: 95%+ with fast acquisition",
                "Pros train 30-60 min daily on aim mechanics"
            ]
        },
        {
            question: "What is the best free aim trainer online?",
            answer: "Reflextry offers a free browser-based aim trainer with multiple modes including flick shot, target tracking, and grid shot exercises. Unlike downloadable aim trainers, it runs directly in your browser with no installation required. It includes difficulty scaling, accuracy tracking, and benchmarks against global averages from competitive FPS players.",
        }
    ],
    "sequence-memory": [
        {
            question: "What is a good score on the Sequence Memory test?",
            answer: "A good score on the Sequence Memory test is Level 9-11, which means correctly reproducing a spatial sequence of 9-11 steps. The average score is Level 7-8. Elite scores reach Level 12 and above. This test measures visuospatial working memory — the same cognitive system used for navigation, tracking objects, and spatial problem-solving.",
            keyPoints: [
                "Average: Level 7-8",
                "Good: Level 9-11",
                "Elite: Level 12+"
            ]
        }
    ],
    "chimp-test": [
        {
            question: "What is the Chimp Test?",
            answer: "The Chimp Test is a working memory assessment inspired by research on primate cognition at Kyoto University. Numbers are briefly displayed on a grid, then hidden — you must tap them in ascending order from memory. The test is named after the finding that young chimpanzees can outperform adult humans on this specific spatial memory task, demonstrating remarkable eidetic-like recall.",
        }
    ],
    "schulte-table": [
        {
            question: "What is a Schulte Table test?",
            answer: "A Schulte Table is a 5×5 grid containing numbers 1-25 in random positions. The goal is to find and click each number in sequential order as fast as possible. It was developed by German psychiatrist Walter Schulte to measure visual search speed and attention. A good time is under 30 seconds, while elite performers complete it in under 15 seconds.",
            keyPoints: [
                "5×5 grid, numbers 1-25",
                "Average completion: 30-45 seconds",
                "Good: Under 30 seconds",
                "Elite: Under 15 seconds"
            ]
        }
    ]
};
