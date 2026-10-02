import Link from "next/link";

interface CategoryContentProps {
    category: "memory" | "reflex" | "speed" | "accuracy" | "gaming";
}

const CATEGORY_CONTENT: Record<string, {
    title: string;
    intro: string;
    sections: { heading: string; text: string }[];
    tools: { name: string; href: string; description: string }[];
}> = {
    memory: {
        title: "Memory Training Games — Strengthen Your Working Memory",
        intro: "Working memory is the cognitive system responsible for temporarily holding and manipulating information. It is the mental workspace you use when following directions, solving math problems in your head, or remembering a phone number long enough to dial it. Unlike long-term memory, working memory has a limited capacity — most adults can hold between 5 and 9 items simultaneously. The games in this arena are specifically designed to push that limit.",
        sections: [
            {
                heading: "The Science Behind Memory Training",
                text: "Research in cognitive neuroscience has demonstrated that working memory capacity is not fixed. A landmark 2008 study by Jaeggi et al., published in the Proceedings of the National Academy of Sciences, showed that intensive working memory training can lead to improvements in fluid intelligence — the ability to reason and solve new problems. Our memory games leverage adaptive difficulty: as you improve, the challenge scales up, forcing your brain to continuously adapt through neuroplasticity."
            },
            {
                heading: "Types of Memory We Train",
                text: "Our Memory Arena targets multiple memory systems. Visuospatial memory is tested through games like Visual Memory and Sequence Memory, where you must recall the positions and order of visual stimuli. Verbal memory is challenged in our Verbal Memory test, which requires you to distinguish between previously seen and novel words. Numeric memory is pushed in Number Memory, where you reproduce increasingly long digit strings. Each system engages different brain regions — visuospatial tasks activate the right hemisphere and parietal cortex, while verbal tasks engage Broca's area and the left prefrontal cortex."
            },
            {
                heading: "Who Benefits from Memory Training?",
                text: "Students preparing for standardized tests find that stronger working memory directly correlates with better reading comprehension and mathematical problem-solving. Older adults can use memory training to build cognitive reserve — a buffer against age-related cognitive decline. Competitive gamers rely on spatial memory to track enemy positions, ability cooldowns, and minimap information simultaneously. Healthcare professionals use working memory constantly when managing multiple patient cases and medication schedules."
            }
        ],
        tools: [
            { name: "Sequence Memory", href: "/memory/sequence", description: "Memorize and reproduce expanding pattern sequences." },
            { name: "Chimp Test", href: "/memory/chimp-test", description: "Recall number positions after they disappear." },
            { name: "Number Memory", href: "/memory/number", description: "Remember increasingly long digit strings." },
            { name: "Visual Memory", href: "/memory/visual", description: "Recall highlighted tile patterns on a grid." },
            { name: "Verbal Memory", href: "/memory/verbal-memory", description: "Identify seen vs. new words under time pressure." },
        ]
    },
    reflex: {
        title: "Reflex Tests — Measure and Improve Your Reaction Time",
        intro: "Reaction time is the interval between a stimulus appearing and your physical response. It reflects the speed of your entire sensory-motor processing chain: photoreceptors in your eyes detect light, neural signals travel along the optic nerve to the visual cortex, the prefrontal cortex makes a decision, and motor signals descend through the spinal cord to your muscles. The average human visual reaction time is approximately 250 milliseconds, but elite athletes and competitive gamers routinely achieve 150–180ms through deliberate training.",
        sections: [
            {
                heading: "How Reaction Time Works",
                text: "Your reaction time is governed by three stages: perception (detecting the stimulus), cognition (deciding what to do), and motor execution (performing the action). Each stage can be trained independently. Perception speed improves with stimulus familiarity — the more you practice reacting to a green flash, the faster your visual cortex recognizes it. Cognitive processing accelerates when decision-making becomes automatic (moving from controlled to automatic processing). Motor execution improves through myelination of frequently used neural pathways, which literally increases the speed of signal transmission."
            },
            {
                heading: "Factors That Affect Reaction Time",
                text: "Several variables influence your reaction time on any given day. Sleep deprivation can add 20–50ms to your baseline — studies show that 24 hours without sleep impairs reaction time more than a blood alcohol level of 0.10%. Caffeine typically reduces reaction time by 10–20ms for 3–5 hours. Physical fitness correlates with faster processing speed. Age plays a role: reaction time peaks between ages 18–25 and gradually slows thereafter, though training can significantly offset this decline. Even ambient temperature affects performance — cold hands reduce fine motor speed."
            },
            {
                heading: "Real-World Applications",
                text: "Fast reaction time is critical in driving, where a 100ms difference at 60 mph translates to 8.8 additional feet of stopping distance. In competitive esports, professional Counter-Strike players with sub-170ms reaction times gain a measurable advantage in aim duels. Athletes in sports like table tennis, boxing, and motorsport undergo dedicated reaction training as part of their conditioning programs. Medical professionals use reaction time tests as screening tools for concussion assessment and cognitive decline."
            }
        ],
        tools: [
            { name: "Reaction Time Test", href: "/reflex/reaction", description: "Measure your raw visual reaction speed." },
            { name: "Sound Reaction", href: "/reflex/sound", description: "React to audio stimuli as fast as possible." },
            { name: "Grid Shot", href: "/reflex/grid", description: "Click randomly appearing targets on a grid." },
            { name: "Direction Test", href: "/reflex/direction", description: "Match arrow directions under time pressure." },
            { name: "Multi-Stimulus", href: "/reflex/multi-stimulus", description: "Process conflicting signals and react correctly." },
        ]
    },
    speed: {
        title: "Speed Tests — Push Your Clicks Per Second and Typing Speed",
        intro: "Speed benchmarks measure the raw throughput of your neuromuscular system — how many precise actions you can execute per unit of time. In the context of computer interaction, two primary metrics dominate: Clicks Per Second (CPS) for mouse actions and Words Per Minute (WPM) for typing. These aren't just gaming metrics; typing speed directly impacts professional productivity, and click speed affects everything from spreadsheet navigation to graphic design workflows.",
        sections: [
            {
                heading: "Understanding CPS (Clicks Per Second)",
                text: "The average untrained person clicks at 5–7 CPS. Competitive Minecraft PvP players regularly achieve 10–14 CPS using techniques like jitter clicking (tensing forearm muscles to create rapid micro-vibrations) or butterfly clicking (alternating two fingers on the mouse button). While these techniques are primarily gaming-focused, the finger dexterity and fine motor control they develop transfer to any precision mouse task. Our Click Speed test measures your CPS across different time intervals — 1 second, 5 seconds, and 10 seconds — because sustained speed is harder than burst speed."
            },
            {
                heading: "Typing Speed and Professional Impact",
                text: "The average adult types at 40 WPM, while professional typists achieve 65–75 WPM. Court reporters and transcriptionists routinely sustain 200+ WPM using stenotype machines. For standard keyboard typists, reaching 80–100 WPM eliminates typing as a bottleneck in knowledge work — your fingers can keep up with your thoughts. Our typing tests use common English passages calibrated for word-length variety, and measure both gross WPM (total words typed) and net WPM (adjusted for errors) to give you an accurate picture of usable speed."
            },
            {
                heading: "Mental Math Speed",
                text: "Our Math Speed test challenges your numerical processing and mental arithmetic. The ability to perform rapid calculations draws on working memory (holding numbers), procedural memory (knowing arithmetic rules), and processing speed (executing the computation). Regular practice with timed arithmetic improves what psychologists call 'number sense' — an intuitive feel for quantities and operations that forms the foundation of mathematical reasoning."
            }
        ],
        tools: [
            { name: "Click Speed Test", href: "/speed/click", description: "Measure your clicks per second." },
            { name: "Typing Speed Test", href: "/speed/typing", description: "Test your words per minute." },
            { name: "Math Speed", href: "/speed/math", description: "Solve arithmetic problems under time pressure." },
            { name: "Number Rush", href: "/speed/number-rush", description: "Click numbers in ascending order rapidly." },
            { name: "Quick Sort", href: "/speed/quick-sort", description: "Categorize items left or right at maximum speed." },
        ]
    },
    accuracy: {
        title: "Accuracy Tests — Train Your Precision and Visual Perception",
        intro: "Accuracy measures how close your actions come to an intended target. In cognitive science, accuracy and speed exist in a fundamental trade-off described by the Fitts–Posner speed-accuracy trade-off: moving faster increases error rates. The goal of accuracy training is to shift this curve — maintaining the same precision at higher speeds, or achieving greater precision at the same speed. Our accuracy tests target visual perception, fine motor control, and spatial reasoning.",
        sections: [
            {
                heading: "Visual-Spatial Intelligence",
                text: "Visual-spatial intelligence is your ability to perceive, analyze, and mentally manipulate visual information. Pattern Matching tests evaluate your capacity to identify regularities in visual data — a skill used in everything from reading X-rays in radiology to spotting trends in data visualization. Mental Rotation challenges your ability to manipulate 3D objects in your mind's eye, which draws on the parietal cortex and is strongly correlated with performance in STEM fields, especially engineering and architecture."
            },
            {
                heading: "Fine Motor Control and Precision",
                text: "Precision Click tests measure your ability to accurately position a cursor on small targets — a fundamental skill for graphic designers, surgeons using robotic instruments, and anyone who spends hours navigating complex software interfaces. Fine motor control depends on the cerebellum (which coordinates movement), the motor cortex (which plans movement), and proprioceptive feedback from your hand muscles. Regular practice builds muscle memory that allows precise movements to become automatic, freeing cognitive resources for higher-level thinking."
            },
            {
                heading: "Color Perception and Estimation",
                text: "Our Color Match and Angle Estimation tools train perceptual calibration — the accuracy with which you can judge visual properties. Color matching ability is essential for designers, photographers, and anyone working with visual media. Angle estimation develops the spatial reasoning used in geometry, navigation, and mechanical tasks. These skills improve through feedback-driven practice: when you receive immediate, accurate feedback on your estimates, your brain recalibrates its internal models to reduce systematic bias."
            }
        ],
        tools: [
            { name: "Pattern Matching", href: "/accuracy/pattern-matching", description: "Identify the missing piece of visual patterns." },
            { name: "Precision Click", href: "/accuracy/precision-click", description: "Click tiny targets with pixel-perfect accuracy." },
            { name: "Angle Estimation", href: "/accuracy/angle-estimation", description: "Visually estimate exact degree measurements." },
            { name: "Color Match", href: "/accuracy/color-match", description: "Adjust RGB sliders to recreate target colors." },
            { name: "Data Entry", href: "/accuracy/data", description: "Type complex sequences without errors." },
        ]
    },
    gaming: {
        title: "Gaming Arena — Esports Warm-Up and Performance Training",
        intro: "Competitive gaming demands a unique combination of cognitive and physical skills: rapid target acquisition (aim), sustained visual tracking, decision-making under pressure, and extended mental endurance. Professional esports athletes train these skills with the same rigor as traditional athletes — structured warm-up routines, measurable performance metrics, and progressive overload. Our Gaming Arena provides browser-based tools that isolate specific gaming mechanics for targeted practice.",
        sections: [
            {
                heading: "Aim Training Mechanics",
                text: "Aim in FPS games breaks down into several distinct mechanics. Tracking is the ability to keep your crosshair on a moving target — critical in games like Overwatch and Apex Legends. Flicking is the rapid snap of your crosshair from one position to another, essential for AWP/sniper play in Counter-Strike. Grid click targets the ability to rapidly reacquire targets at varying distances, which trains the motor planning system in your brain to execute precise ballistic movements. Our aim trainer provides all three modalities with adjustable target sizes and speeds."
            },
            {
                heading: "The Science of Esports Performance",
                text: "Research published in the journal PLOS ONE found that professional League of Legends players demonstrate significantly faster visuomotor processing speeds compared to non-gamers. A 2020 study in Nature Human Behaviour showed that action video game players exhibit enhanced attention allocation and perceptual decision-making. These advantages aren't purely genetic — they develop through thousands of hours of deliberate practice. Our tools compress the mechanical practice component, allowing gamers to achieve more targeted training per minute than playing the actual game."
            },
            {
                heading: "Optimal Warm-Up Protocol",
                text: "Sports science research shows that a 5–10 minute warm-up improves performance and reduces injury risk. The same applies to esports. A structured warm-up should progress from slow, controlled movements to game-speed reactions. We recommend starting with 2 minutes of Grid Click at a comfortable pace, then 3 minutes of Aim Trainer with progressively smaller targets, followed by 2 minutes of Flick Shot at maximum speed. This protocol activates the neuromuscular pathways you'll use in-game, primes your visual attention system, and brings your reaction time to its daily baseline."
            }
        ],
        tools: [
            { name: "Aim Trainer", href: "/gaming/aim", description: "Track and click moving targets." },
            { name: "Flick Shot", href: "/gaming/flick-shot", description: "Snap your crosshair to targets instantly." },
            { name: "Target Tracking", href: "/gaming/target-tracking", description: "Keep your crosshair locked on evasive targets." },
            { name: "Endless Dodge", href: "/gaming/endless-dodge", description: "Avoid incoming obstacles for as long as possible." },
            { name: "Rhythm Tap", href: "/gaming/rhythm-tap", description: "Hit notes precisely on the beat." },
        ]
    }
};

export function CategorySEOContent({ category }: CategoryContentProps) {
    const data = CATEGORY_CONTENT[category];
    if (!data) return null;

    return (
        <article className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 space-y-8">
                <header>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{data.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{data.intro}</p>
                </header>

                {data.sections.map((section, idx) => (
                    <section key={idx} className="space-y-3">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">{section.heading}</h2>
                        <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                    </section>
                ))}

                <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-foreground">Available Tools</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {data.tools.map((tool) => (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                            >
                                <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </article>
    );
}
