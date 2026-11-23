export interface NewToolContentEntry {
    description: { title: string; content: string }[];
    howToUse: { title: string; steps: string[] }[];
    howToImprove: { title: string; content: string }[];
    faqs: { question: string; answer: string }[];
}

export interface NewToolSEOEntry {
    title: string;
    description: string;
    keywords: string[];
}

export interface NewToolAEOEntry {
    question: string;
    answer: string;
    keyPoints: string[];
}

export interface NewToolExtrasEntry {
    benefits: string[];
    howToPlay: string[];
}

export const NEW_PACKS_SEO: Record<string, NewToolSEOEntry> = {
    "gravity-lab": {
        title: "Gravity & Orbit Lab - Physics Simulator | Reflextry",
        description:
            "Explore gravity acceleration on Earth, Moon, Mars, and Jupiter. Drop objects with air resistance and launch orbital probes to learn physics visually.",
        keywords: [
            "gravity simulator online",
            "planet gravity lab",
            "free fall physics game",
            "orbital velocity simulator",
            "interactive physics for students",
            "gravity drop experiment",
        ],
    },
    "laser-reflection": {
        title: "Laser Reflection Optics - Mirror Puzzle | Reflextry",
        description:
            "Rotate mirrors and guide a laser beam onto targets using the Law of Reflection. Interactive optics puzzle for students learning light physics.",
        keywords: [
            "laser reflection game",
            "optics mirror puzzle online",
            "law of reflection simulator",
            "light physics game for kids",
            "angle of incidence game",
        ],
    },
    "projectile-cannon": {
        title: "Projectile Cannon - Trajectory Simulator | Reflextry",
        description:
            "Adjust launch angle, velocity, wind, and gravity to hit moving targets. Visualize parabolic trajectories and velocity vectors in real time.",
        keywords: [
            "projectile motion game",
            "cannon physics simulator",
            "trajectory calculator game",
            "parabolic motion interactive",
            "physics angle launcher",
        ],
    },
    "torque-balance": {
        title: "Seesaw Torque Balance - Lever Math Game | Reflextry",
        description:
            "Place masses along a lever beam to balance rotational torque and practice multiplication, ratios, and mechanical advantage visually.",
        keywords: [
            "torque balance game",
            "seesaw physics simulator",
            "lever balance math game",
            "rotational equilibrium interactive",
            "kids multiplication balance",
        ],
    },
    "solar-gravity-3d": {
        title: "3D Solar Gravity & Orbit Simulator | Reflextry",
        description:
            "Launch satellites through a 3D gravitational field with curved spacetime visualization, planetary orbits, and slingshot velocity challenges.",
        keywords: [
            "3d gravity simulator",
            "3d solar system physics game",
            "orbital mechanics 3d webgl",
            "gravity slingshot game",
            "spacetime curvature visualizer",
        ],
    },
    "spatial-aim-3d": {
        title: "3D FPS Spatial Aim & Reaction Arena | Reflextry",
        description:
            "Train 3D depth perception, flick speed, and millisecond reaction time in a real-time WebGL target chamber with near, mid, and far drones.",
        keywords: [
            "3d aim trainer browser",
            "3d fps reaction test",
            "webgl spatial aim game",
            "depth perception aim trainer",
            "3d flick shot warmup",
        ],
    },
    "reaction-duel-2p": {
        title: "2-Player Reaction Duel - Reflex Battle | Reflextry",
        description:
            "Challenge a friend on one keyboard or touchscreen in a best-of-5 millisecond reaction duel with false-start detection and split timing.",
        keywords: [
            "2 player reaction game",
            "two player reflex battle",
            "split screen reaction test",
            "classroom quick draw game",
            "2p reflex duel online",
        ],
    },
    "math-tug-of-war": {
        title: "2-Player Math Tug-of-War - Math Battle | Reflextry",
        description:
            "Compete head-to-head solving rapid arithmetic and algebra prompts to pull the physics rope across the victory line. Great for classrooms.",
        keywords: [
            "2 player math game",
            "math tug of war online",
            "classroom mental math battle",
            "two player arithmetic race",
            "kids math competition game",
        ],
    },
    "cannon-battle-2p": {
        title: "2-Player Gravity Cannon Physics Battle | Reflextry",
        description:
            "Take turns dialing launch angle and velocity across changing wind and planetary gravity to strike your rival's outpost in 2D physics combat.",
        keywords: [
            "2 player cannon game",
            "2p physics artillery battle",
            "turn based projectile game",
            "gravity cannon duel online",
            "split screen physics game",
        ],
    },
    "speed-reading": {
        title: "Speed Reading & Comprehension WPM Test | Reflextry",
        description:
            "Measure real reading speed with paced highlighting or RSVP mode followed by comprehension questions to calculate true effective WPM.",
        keywords: [
            "speed reading test wpm",
            "reading comprehension speed test",
            "rsvp speed reading trainer",
            "effective wpm calculator",
            "study reading speed tool",
        ],
    },
    "ten-key": {
        title: "10-Key Numpad Speed Test - KPH Drill | Reflextry",
        description:
            "Benchmark your numeric keypad speed in Keystrokes Per Hour (KPH) and accuracy with invoice, currency, and data-entry drills.",
        keywords: [
            "10 key speed test",
            "numpad typing test kph",
            "data entry 10 key test",
            "accounting keypad test",
            "numeric keypad trainer online",
        ],
    },
    "focus-sprint": {
        title: "Focus Sprint & Reaction Fatigue Tracker | Reflextry",
        description:
            "Pair timed deep-work or study sprints with pre- and post-sprint millisecond reaction benchmarks to measure mental focus and fatigue.",
        keywords: [
            "pomodoro focus tracker",
            "mental fatigue reaction test",
            "study focus sprint timer",
            "workplace cognitive check",
            "focus performance benchmark",
        ],
    },
};

export const NEW_PACKS_RELATED: Record<string, { id: string; title: string; href: string }[]> = {
    "gravity-lab": [
        { id: "projectile-cannon", title: "Projectile Cannon Physics", href: "/stem/projectile-cannon" },
        { id: "solar-gravity-3d", title: "3D Solar Gravity Simulator", href: "/lab-3d/solar-gravity" },
        { id: "torque-balance", title: "Seesaw Torque Balance", href: "/stem/torque-balance" },
    ],
    "laser-reflection": [
        { id: "angle-estimation", title: "Angle Estimation", href: "/accuracy/angle-estimation" },
        { id: "projectile-cannon", title: "Projectile Cannon Physics", href: "/stem/projectile-cannon" },
        { id: "gravity-lab", title: "Gravity & Orbit Lab", href: "/stem/gravity-lab" },
    ],
    "projectile-cannon": [
        { id: "gravity-lab", title: "Gravity & Orbit Lab", href: "/stem/gravity-lab" },
        { id: "cannon-battle-2p", title: "2-Player Cannon Battle", href: "/multiplayer/cannon-battle" },
        { id: "laser-reflection", title: "Laser Reflection Optics", href: "/stem/laser-reflection" },
    ],
    "torque-balance": [
        { id: "math-tug-of-war", title: "2-Player Math Tug-of-War", href: "/multiplayer/math-tug-of-war" },
        { id: "gravity-lab", title: "Gravity & Orbit Lab", href: "/stem/gravity-lab" },
        { id: "speed-math", title: "Mental Math Speed", href: "/speed/math" },
    ],
    "solar-gravity-3d": [
        { id: "gravity-lab", title: "Gravity & Orbit Lab", href: "/stem/gravity-lab" },
        { id: "spatial-aim-3d", title: "3D FPS Spatial Aim", href: "/lab-3d/spatial-aim" },
        { id: "projectile-cannon", title: "Projectile Cannon Physics", href: "/stem/projectile-cannon" },
    ],
    "spatial-aim-3d": [
        { id: "aim-trainer", title: "FPS Aim Trainer", href: "/gaming/aim" },
        { id: "flick-shot", title: "Flick Shot", href: "/gaming/flick-shot" },
        { id: "solar-gravity-3d", title: "3D Solar Gravity Simulator", href: "/lab-3d/solar-gravity" },
    ],
    "reaction-duel-2p": [
        { id: "reaction-time", title: "Reaction Time Test", href: "/reflex/reaction" },
        { id: "math-tug-of-war", title: "2-Player Math Tug-of-War", href: "/multiplayer/math-tug-of-war" },
        { id: "cannon-battle-2p", title: "2-Player Cannon Battle", href: "/multiplayer/cannon-battle" },
    ],
    "math-tug-of-war": [
        { id: "speed-math", title: "Mental Math Speed", href: "/speed/math" },
        { id: "torque-balance", title: "Seesaw Torque Balance", href: "/stem/torque-balance" },
        { id: "reaction-duel-2p", title: "2-Player Reaction Duel", href: "/multiplayer/reaction-duel" },
    ],
    "cannon-battle-2p": [
        { id: "projectile-cannon", title: "Projectile Cannon Physics", href: "/stem/projectile-cannon" },
        { id: "reaction-duel-2p", title: "2-Player Reaction Duel", href: "/multiplayer/reaction-duel" },
        { id: "gravity-lab", title: "Gravity & Orbit Lab", href: "/stem/gravity-lab" },
    ],
    "speed-reading": [
        { id: "typing-speed", title: "Typing Speed Test", href: "/speed/typing" },
        { id: "schulte-table", title: "Schulte Table", href: "/speed/schulte-table" },
        { id: "focus-sprint", title: "Focus Sprint Tracker", href: "/productivity/focus-sprint" },
    ],
    "ten-key": [
        { id: "data-entry", title: "Data Entry Accuracy", href: "/accuracy/data" },
        { id: "typing-speed", title: "Typing Speed Test", href: "/speed/typing" },
        { id: "speed-math", title: "Mental Math Speed", href: "/speed/math" },
    ],
    "focus-sprint": [
        { id: "reaction-time", title: "Reaction Time Test", href: "/reflex/reaction" },
        { id: "speed-reading", title: "Speed Reading Lab", href: "/productivity/speed-reading" },
        { id: "ten-key", title: "10-Key Numpad Test", href: "/productivity/ten-key" },
    ],
};

export const NEW_PACKS_AEO: Record<string, NewToolAEOEntry> = {
    "gravity-lab": {
        question: "How does gravity affect falling speed on different planets?",
        answer:
            "In a vacuum, all objects fall at the planet's gravitational acceleration regardless of mass: 9.81 m/s² on Earth, 1.62 m/s² on the Moon, 3.72 m/s² on Mars, and 24.79 m/s² on Jupiter. Distance fallen grows quadratically with time (d = 0.5 × g × t²).",
        keyPoints: [
            "Mass does not change free-fall time in a vacuum",
            "Air resistance slows lighter or wider objects until terminal velocity",
            "Circular orbit requires matching horizontal speed to gravity pull",
        ],
    },
    "laser-reflection": {
        question: "What is the Law of Reflection in optics?",
        answer:
            "When a light ray strikes a flat mirror, the angle of reflection equals the angle of incidence measured relative to the surface normal (θr = θi). Rotating a mirror by 10 degrees deflects the reflected beam by 20 degrees.",
        keyPoints: [
            "Angles are measured from the perpendicular normal line",
            "Rotating a mirror by Δθ shifts the reflected beam by 2Δθ",
            "Multiple mirrors chain reflections while conserving beam geometry",
        ],
    },
    "projectile-cannon": {
        question: "What launch angle gives the maximum horizontal range?",
        answer:
            "On flat ground with no wind or air drag, a 45-degree launch angle maximizes horizontal range because sin(2θ) peaks at 1 when θ = 45°. Headwinds reward lower angles, while tailwinds or elevated targets shift the optimal angle.",
        keyPoints: [
            "Horizontal velocity stays constant without drag; vertical velocity accelerates downward",
            "Complementary angles (like 30° and 60°) reach the same flat range",
            "Higher gravity shortens both flight time and maximum range",
        ],
    },
    "torque-balance": {
        question: "How does a seesaw or lever reach rotational balance?",
        answer:
            "A lever balances when total clockwise torque equals total counterclockwise torque: Σ(Mass × Distance) on the left must equal Σ(Mass × Distance) on the right. A smaller mass farther from the fulcrum can balance a heavier mass closer to the pivot.",
        keyPoints: [
            "Torque τ = Force × Lever Arm Distance from the pivot",
            "Doubling distance doubles turning force without adding weight",
            "Real-world levers, wrenches, and cranes obey the same equation",
        ],
    },
    "solar-gravity-3d": {
        question: "How do spacecraft stay in orbit without firing engines continuously?",
        answer:
            "An orbiting spacecraft is continuously falling toward its star or planet while moving sideways fast enough that the curved surface falls away at the same rate. Circular orbital speed equals √(GM / r); going slightly faster stretches the path into an ellipse.",
        keyPoints: [
            "Too slow causes the probe to spiral inward; too fast escapes gravity",
            "Gravity weakens with the square of distance (inverse-square law)",
            "Probes accelerate fastest at closest approach (periapsis)",
        ],
    },
    "spatial-aim-3d": {
        question: "Why does 3D depth aim feel different from 2D target clicking?",
        answer:
            "In 3D space, identical targets look smaller and require tighter angular adjustments at greater depths, while close targets cross more of your field of view quickly. Training across depth planes builds consistent hand-eye calibration.",
        keyPoints: [
            "Combines millisecond reaction speed with spatial depth judgment",
            "Near targets test fast flicks; far targets test micro-precision",
            "Track both hit accuracy (%) and average reaction time (ms)",
        ],
    },
    "reaction-duel-2p": {
        question: "How do 2-player reaction duels ensure a fair millisecond test?",
        answer:
            "Both players share the exact same screen refresh and randomized wait interval before the Go cue triggers. Polling keyboard or touch events with high-resolution performance.now() timestamps records the true millisecond gap between Player 1 and Player 2.",
        keyPoints: [
            "Randomized wait window prevents counting down or guessing",
            "Early presses register as a false start and award the round to the opponent",
            "Best-of-5 format smooths out single-round luck",
        ],
    },
    "math-tug-of-war": {
        question: "Does competitive mental math improve calculation fluency?",
        answer:
            "Timed head-to-head arithmetic encourages rapid recall of number facts and estimation shortcuts while keeping students actively engaged. Using separate Kids, Student, and Pro tiers ensures fair difficulty scaling.",
        keyPoints: [
            "Simultaneous dual inputs let two students race on one laptop or tablet",
            "Wrong answers cost momentum, rewarding accuracy alongside speed",
            "Builds rapid mental retrieval for addition, multiplication, and equations",
        ],
    },
    "cannon-battle-2p": {
        question: "How do wind and gravity change 2-player artillery trajectories?",
        answer:
            "Wind applies a continuous horizontal acceleration during flight, so high-arc shots stay airborne longer and drift farther than low-arc shots. Stronger planetary gravity pulls projectiles down faster, requiring more launch velocity.",
        keyPoints: [
            "High arcs clear tall hills but experience greater wind drift",
            "Observing your previous shot arc lets you bracket the target quickly",
            "Switch planets to experience Earth, Moon, and Mars ballistics",
        ],
    },
    "speed-reading": {
        question: "What is a good effective reading speed (WPM)?",
        answer:
            "Most adults read non-fiction at 200–250 words per minute with 70–80% comprehension. Effective WPM multiplies your raw reading pace by your comprehension score, ensuring speed gains never come at the expense of understanding.",
        keyPoints: [
            "Effective WPM = Raw WPM × Comprehension Accuracy",
            "Paced highlighting reduces eye backtracking (regression)",
            "RSVP mode minimizes eye-movement time by centering words",
        ],
    },
    "ten-key": {
        question: "What is a good 10-Key KPH score for office and accounting jobs?",
        answer:
            "Entry-level data-entry roles typically look for 6,000–8,000 Keystrokes Per Hour (KPH) at 95%+ accuracy, while experienced accountants and clerical specialists regularly exceed 10,000–12,000 KPH using touch-method numeric entry.",
        keyPoints: [
            "KPH = (Correct Characters ÷ Elapsed Seconds) × 3,600",
            "Keep your index, middle, and ring fingers anchored on 4-5-6",
            "High accuracy matters more than raw bursts in financial workflows",
        ],
    },
    "focus-sprint": {
        question: "How does a pre/post reaction check measure cognitive fatigue?",
        answer:
            "Baseline visual reaction time reflects alertness and neural readiness. By running a brief 3-trial reaction benchmark before and after a focused study or work sprint, you can observe whether your alertness stayed steady, warmed up, or slowed down.",
        keyPoints: [
            "Compare post-sprint average ms against your pre-sprint baseline",
            "Rising reaction latency (+25ms or more) signals a good time for a real break",
            "Short 15–25 minute sprints preserve attention better than marathon sessions",
        ],
    },
};

export const NEW_PACKS_EXTRAS: Record<string, NewToolExtrasEntry> = {
    "gravity-lab": {
        benefits: [
            "Visualizes gravitational acceleration across Earth, Moon, Mars, and Jupiter in real time.",
            "Demonstrates air drag vs. vacuum free-fall with side-by-side drop metrics.",
            "Connects interactive orbital launches directly to physics equations.",
            "Ideal for middle school, high school, and curious learners exploring mechanics.",
        ],
        howToPlay: [
            "Choose a planet preset (Earth, Moon, Mars, or Jupiter) and toggle Air Drag on or off.",
            "In Free-Fall Drop mode, release spheres from different heights and compare drop times.",
            "Switch to Orbit Launch Challenge, set launch speed, and fire a probe to complete stable orbits.",
            "Review live distance, velocity, and acceleration formulas as the simulation runs.",
        ],
    },
    "laser-reflection": {
        benefits: [
            "Builds intuitive geometric understanding of the Law of Reflection (θi = θr).",
            "Develops multi-step spatial planning and angle visualization.",
            "Displays live surface normals and incidence angles for classroom instruction.",
            "Scales smoothly from beginner 1-mirror stages to complex multi-bounce optical puzzles.",
        ],
        howToPlay: [
            "Select a puzzle stage or click a mirror on the optical table to highlight it.",
            "Rotate selected mirrors clockwise or counterclockwise using the buttons or slider.",
            "Watch the real-time laser path reflect off mirrors and avoid opaque blocks.",
            "Align the beam onto the target sensor to clear the stage and advance.",
        ],
    },
    "projectile-cannon": {
        benefits: [
            "Turns textbook kinematics equations into an immediately intuitive visual game.",
            "Visualizes horizontal and vertical velocity components along the flight arc.",
            "Teaches how wind resistance and planetary gravity alter parabolic trajectories.",
            "Tracks accuracy and shot efficiency across 5 progressive target rounds.",
        ],
        howToPlay: [
            "Inspect the target distance, elevation, wind indicator, and selected planet gravity.",
            "Adjust the Cannon Angle (5°–85°) and Launch Velocity (m/s) sliders.",
            "Click Fire Cannon to launch the projectile and observe the traced parabola.",
            "Hit all targets in the fewest shots to maximize your physics precision score.",
        ],
    },
    "torque-balance": {
        benefits: [
            "Makes multiplication, factoring, and algebraic balance tangible for kids and students.",
            "Visualizes rotational torque (τ = F × d) with realistic tilt animation.",
            "Includes both Free Lab sandbox exploration and timed Balance Challenge rounds.",
            "Reinforces proportional thinking used in physics, engineering, and mental math.",
        ],
        howToPlay: [
            "Inspect the fixed load placed on the left arm of the seesaw beam.",
            "Select a mass block (1 kg to 10 kg) and click a distance notch on the right arm.",
            "Balance total left torque and right torque so the beam levels to 0 degrees.",
            "Complete consecutive challenge stages quickly to build your streak and score.",
        ],
    },
    "solar-gravity-3d": {
        benefits: [
            "Renders a true 3D orbital mechanics sandbox with WebGL spacetime gravity grid.",
            "Demonstrates Keplerian orbits, periapsis acceleration, and escape velocity visually.",
            "Lets learners orbit freely around the star with camera presets and speed controls.",
            "Includes a playable Orbital Insertion Challenge with live telemetry.",
        ],
        howToPlay: [
            "Drag to orbit the 3D camera or select Top-Down, Angled, or Probe camera presets.",
            "Adjust Satellite Launch Speed and Launch Angle in the collapsible bottom dock.",
            "Click Launch Probe to inject your spacecraft into the gravitational field.",
            "Complete full revolutions through the target orbital corridor to score points.",
        ],
    },
    "spatial-aim-3d": {
        benefits: [
            "Trains depth-calibrated flick aiming across near, mid, and far 3D target planes.",
            "Measures true millisecond target acquisition latency and hit accuracy.",
            "Runs smoothly in-browser with Three.js studio lighting and instant restarts.",
            "Offers Flick, Depth Grid, and Moving Drone modes for varied warmup drills.",
        ],
        howToPlay: [
            "Select a 3D training mode (Flick, Depth Grid, or Moving Drones) in the control bar.",
            "Click Start 3D Session to spawn composite drone targets across the chamber.",
            "Aim and click targets as accurately and rapidly as possible before the timer ends.",
            "Review your Hits, Accuracy %, and Average Reaction Time (ms) at session end.",
        ],
    },
    "reaction-duel-2p": {
        benefits: [
            "Enables instant head-to-head reflex competitions on a single laptop or tablet.",
            "Tracks exact millisecond differences and false-start discipline.",
            "Perfect for classroom breaks, esports teammates, and friend challenges.",
            "Zero network latency—both players share identical frame timing.",
        ],
        howToPlay: [
            "Player 1 uses the A key (or taps the left half); Player 2 uses L (or taps the right half).",
            "Click Start Match to begin the randomized wait phase.",
            "As soon as the arena flashes Go, press your key or tap your zone first.",
            "First player to win 3 rounds (Best of 5) claims the match victory.",
        ],
    },
    "math-tug-of-war": {
        benefits: [
            "Transforms mental arithmetic practice into an exciting 2-player classroom sport.",
            "Supports Kids (Add/Sub), Student (Multiply/Divide), and Pro (Mixed Algebra) tiers.",
            "Works smoothly with dual keyboard controls or split-screen touch buttons.",
            "Rewards both calculation speed and accuracy—wrong answers slip the rope back.",
        ],
        howToPlay: [
            "Choose a difficulty level (Kids, Student, or Pro) and click Start Tug-of-War.",
            "Player 1 selects answers using keys 1/2/3 or tapping left buttons; Player 2 uses 8/9/0 or right buttons.",
            "Each correct answer pulls the knot toward your victory flag.",
            "Pull the rope past your goal line—or hold the lead when time expires—to win.",
        ],
    },
    "cannon-battle-2p": {
        benefits: [
            "Blends strategic turn-based 2-player fun with real projectile physics.",
            "Teaches wind compensation, angle bracketing, and gravity scaling naturally.",
            "Generates fresh terrain hills and wind vectors every round for replayability.",
            "Playable by two students or friends on a single screen with clear turn prompts.",
        ],
        howToPlay: [
            "Choose a planet gravity preset (Earth, Moon, or Mars) and start the battle.",
            "On your turn, dial your cannon angle and launch power while accounting for wind.",
            "Click Fire Shot and watch the physics trajectory arc across the valley.",
            "Reduce your opponent's outpost health to zero first to win the duel.",
        ],
    },
    "speed-reading": {
        benefits: [
            "Measures true Effective WPM by combining reading speed with comprehension quizzes.",
            "Offers both Paced Highlighting and RSVP (center-screen flash) reading modes.",
            "Helps students and professionals reduce subvocalization and eye regression.",
            "Includes curated passages across science, technology, and cognitive productivity.",
        ],
        howToPlay: [
            "Pick a passage topic, reading mode (Paced or RSVP), and target WPM slider.",
            "Click Start Reading and follow the highlighted words smoothly without backtracking.",
            "Click Finished Reading when done (or wait for RSVP completion).",
            "Answer the 3 comprehension questions to calculate your Effective WPM score.",
        ],
    },
    "ten-key": {
        benefits: [
            "Benchmarks real numeric keypad throughput in industry-standard KPH.",
            "Simulates realistic accounting invoices, decimals, and alphanumeric IDs.",
            "Highlights active keys visually to reinforce proper 4-5-6 touch-typing posture.",
            "Tracks accuracy percentage alongside speed so errors are never hidden.",
        ],
        howToPlay: [
            "Select a drill type (Invoices, Integers, or Mixed Codes) and duration (30s or 60s).",
            "Place your right hand on the numeric keypad (or top number row on laptops).",
            "Type each displayed number sequence and press Enter or Space to advance.",
            "Review your final KPH, accuracy percentage, and entries completed.",
        ],
    },
    "focus-sprint": {
        benefits: [
            "Combines structured Pomodoro deep-work timers with objective reaction checks.",
            "Quantifies whether your cognitive alertness improved or fatigued after studying.",
            "Logs completed sprint sessions locally so you can spot your peak focus hours.",
            "Includes a 1-minute Quick Demo alongside 10, 15, and 25-minute real sprints.",
        ],
        howToPlay: [
            "Choose your sprint duration and enter a short task label for the session.",
            "Complete the quick 3-trial Pre-Sprint Reaction Baseline check.",
            "Focus on your study or work task until the clean countdown timer finishes.",
            "Complete the Post-Sprint Reaction Check to view your millisecond fatigue delta.",
        ],
    },
};

export const NEW_PACKS_CONTENT: Record<string, NewToolContentEntry> = {
    "gravity-lab": {
        description: [
            {
                title: "How Gravity & Free-Fall Work",
                content:
                    "Gravity pulls every object toward the center of a planet with a constant acceleration (g) when air resistance is absent. On Earth, g = 9.81 m/s², meaning a falling object gains nearly 10 meters per second of downward speed every single second. On the Moon (1.62 m/s²), the same drop happens in gentle slow motion, whereas on Jupiter (24.79 m/s²), objects plummet over twice as fast as on Earth.",
            },
            {
                title: "Air Resistance vs. Vacuum Physics",
                content:
                    "In everyday life, a feather falls slower than a bowling ball because air drag pushes upward against surface area. Toggle Air Drag off in the Gravity Lab to recreate Galileo's famous vacuum insight—both light and heavy spheres strike the ground at the exact same instant.",
            },
            {
                title: "Orbital Mechanics Explained",
                content:
                    "Switch to the Orbit Launch tab to discover how satellites stay aloft. Launching straight up always falls back down, but launching sideways at circular orbital velocity v = √(GM/r) bends the probe's fall around the curvature of the planet so it circles continuously.",
            },
        ],
        howToUse: [
            {
                title: "Select Environment",
                steps: [
                    "Pick Earth, Moon, Mars, or Jupiter to change gravitational acceleration.",
                    "Toggle Air Drag to compare vacuum physics with real atmospheres.",
                ],
            },
            {
                title: "Run Experiments",
                steps: [
                    "Drop test objects from adjustable heights and read live time and impact speed.",
                    "Switch to Orbit Challenge and tune launch speed to achieve full revolutions.",
                ],
            },
            {
                title: "Analyze Formulas",
                steps: [
                    "Watch d = ½gt² and impact velocity v = gt update dynamically.",
                    "Compare drop results across planets to build intuitive physics literacy.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Predict Before Dropping",
                content:
                    "Before pressing Drop, estimate whether a fall from double the height takes twice as long. Because distance scales with t², doubling height only multiplies fall time by √2 (about 1.41×).",
            },
            {
                title: "Dial In Circular Orbits",
                content:
                    "Watch the apogee and perigee of your orbital trail. If the orbit stretches too far away, lower your launch speed slightly; if it curves into the planet, increase speed in small increments.",
            },
            {
                title: "Compare Extreme Worlds",
                content:
                    "Run identical drop heights on the Moon and Jupiter back-to-back to see how dramatically gravitational field strength reshapes motion.",
            },
            {
                title: "Connect Classroom Formulas",
                content:
                    "Write down one observed height and time from the canvas, plug it into d = ½gt², and verify how closely the simulation matches textbook kinematics.",
            },
        ],
        faqs: [
            {
                question: "Do heavier objects fall faster than lighter ones?",
                answer:
                    "Not in a vacuum. Gravitational force is stronger on heavier objects, but they also have proportionally more inertia (mass), so both cancel out and every object accelerates at the exact same g.",
            },
            {
                question: "Why does Mars have weaker gravity than Earth?",
                answer:
                    "Mars has roughly 11% of Earth's mass and a smaller radius, resulting in a surface gravity of 3.72 m/s²—about 38% of Earth's pull.",
            },
            {
                question: "What happens if an orbital probe moves too fast?",
                answer:
                    "Exceeding escape velocity (√2 times circular orbital speed) sends the probe on a hyperbolic trajectory away from the planet permanently.",
            },
            {
                question: "What is terminal velocity?",
                answer:
                    "When Air Drag is enabled, upward air resistance grows with speed until it equals downward gravity. At that point acceleration drops to zero and the object falls at a steady terminal velocity.",
            },
            {
                question: "Is this simulator suitable for students and teachers?",
                answer:
                    "Yes. It runs directly in any browser with zero setup, making it ideal for classroom demonstrations, homework checks, and independent STEM exploration.",
            },
            {
                question: "Are my Orbit Challenge scores saved?",
                answer:
                    "Yes, your best completed orbits and accuracy scores are recorded locally in your Reflextry statistics history.",
            },
        ],
    },
    "laser-reflection": {
        description: [
            {
                title: "Visualizing the Law of Reflection",
                content:
                    "Light travels in straight lines through a uniform medium until it encounters a reflective surface. When a laser strikes a mirror, it bounces off so that the angle of reflection (θr) exactly equals the angle of incidence (θi), both measured from the perpendicular normal line.",
            },
            {
                title: "Why Mirror Angles Double Beam Deflection",
                content:
                    "A classic surprise in optics is that rotating a mirror by just 10 degrees swings the reflected laser beam by 20 degrees. Playing through multi-mirror stages lets students feel this 2× angular lever directly instead of memorizing it from a worksheet.",
            },
            {
                title: "Progressive Optical Puzzles",
                content:
                    "Early stages teach single-mirror aiming and normal-line geometry, while advanced levels introduce opaque shields, narrow corridors, and chained 3-mirror reflections that reward deliberate geometric reasoning.",
            },
        ],
        howToUse: [
            {
                title: "Inspect the Optical Table",
                steps: [
                    "Locate the Laser Emitter, the target Optical Receiver, and any blocking walls.",
                    "Click any mirror node on the board to select it.",
                ],
            },
            {
                title: "Align Reflections",
                steps: [
                    "Use the angle slider or ±1° / ±5° precision buttons to rotate the active mirror.",
                    "Observe the live normal guide and incidence/reflection angles.",
                ],
            },
            {
                title: "Complete Stages",
                steps: [
                    "Guide the continuous beam directly into the receiver sensor.",
                    "Finish stages quickly with minimal adjustments for a top score.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Work Backward from the Receiver",
                content:
                    "On multi-mirror levels, align the final mirror toward the sensor first, then steer earlier mirrors to feed the beam cleanly into it.",
            },
            {
                title: "Use Coarse Then Fine Adjustments",
                content:
                    "Sweep broadly with the slider to bring the beam near the target, then switch to 1-degree nudge buttons to lock onto the sensor center.",
            },
            {
                title: "Read the Normal Line",
                content:
                    "The dashed normal line splits the incoming and outgoing rays symmetrically. Aiming the normal halfway between emitter and target solves single-bounce shots immediately.",
            },
            {
                title: "Anticipate Double Sensitivity",
                content:
                    "When a beam misses a distant receiver slightly, remember that a tiny 1-degree mirror twist moves the reflected ray by 2 degrees.",
            },
        ],
        faqs: [
            {
                question: "What does θi = θr mean?",
                answer:
                    "θi is the angle of incidence (between incoming ray and mirror normal) and θr is the angle of reflection (between outgoing ray and mirror normal). On a flat mirror, they are always equal.",
            },
            {
                question: "Why does the beam stop at dark blocks?",
                answer:
                    "Opaque barriers absorb light energy rather than reflecting it, forcing you to route the laser around obstacles with mirrors.",
            },
            {
                question: "How many bounces can the laser make?",
                answer:
                    "The ray-tracer calculates up to 8 consecutive bounces in real time with sub-pixel geometric accuracy.",
            },
            {
                question: "Can kids play this without knowing trigonometry?",
                answer:
                    "Absolutely. The live ray preview gives immediate visual feedback, so younger kids learn angle intuition naturally while older students can read exact degree measurements.",
            },
            {
                question: "Does this work on touchscreens and tablets?",
                answer:
                    "Yes, tap any mirror on the canvas to select it and drag the angle slider or tap the nudge buttons.",
            },
            {
                question: "How is my score calculated?",
                answer:
                    "Your score rewards clearing all optical stages with fast completion time and crisp mirror precision.",
            },
        ],
    },
    "projectile-cannon": {
        description: [
            {
                title: "Parabolic Motion Made Playable",
                content:
                    "Projectile motion combines two independent motions at once: steady horizontal travel and gravity-accelerated vertical fall. Together they carve a symmetrical parabola. In Projectile Cannon Physics, every adjustment to angle or launch speed immediately updates the physics readout so you see how kinematics works in motion.",
            },
            {
                title: "Velocity Vectors & Optimal Range",
                content:
                    "A shot fired at speed v₀ and angle θ splits into horizontal velocity vx = v₀·cos(θ) and vertical velocity vy = v₀·sin(θ). Low angles fly fast and flat; high angles climb tall and stay airborne longer—giving wind more time to push the projectile sideways.",
            },
            {
                title: "Multi-Planet Ballistics",
                content:
                    "Switch between Earth, Moon, and Mars gravity to see how the same cannon velocity stretches across huge distances on low-gravity worlds.",
            },
        ],
        howToUse: [
            {
                title: "Read Field Conditions",
                steps: [
                    "Check target distance, wind speed/direction, and selected planet gravity.",
                    "Note your live horizontal and vertical velocity split (vx, vy).",
                ],
            },
            {
                title: "Dial Angle & Velocity",
                steps: [
                    "Adjust Launch Angle (5°–85°) and Muzzle Speed (m/s).",
                    "Press Fire Cannon to watch the projectile arc across the range.",
                ],
            },
            {
                title: "Bracket & Score",
                steps: [
                    "Use your previous dashed trail to refine the next shot.",
                    "Clear all 5 targets in minimal shots for a high accuracy score.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Start Near 45 Degrees",
                content:
                    "45° provides maximum efficiency on flat ground in calm wind. Once you know the range at 45°, adjusting speed alone makes landing hits much faster.",
            },
            {
                title: "Lower Your Arc Into Headwinds",
                content:
                    "High arcs stay in the air longer and lose more speed against strong headwinds. Flatter 28°–38° trajectories cut through wind more predictably.",
            },
            {
                title: "Use Ghost Trails for Bracketing",
                content:
                    "If shot one lands 15 meters short, bump velocity by 3–5 m/s instead of changing both angle and velocity at once—changing one variable at a time builds scientific intuition.",
            },
            {
                title: "Estimate With R = v²sin(2θ)/g",
                content:
                    "Students can test the range formula directly when wind is zero and watch their calculated prediction land right on the bullseye.",
            },
        ],
        faqs: [
            {
                question: "Why does a 30° shot travel the same distance as a 60° shot?",
                answer:
                    "Without wind, sin(2 × 30°) = sin(60°) equals sin(2 × 60°) = sin(120°). The 30° shot arrives faster on a low arc, while the 60° shot climbs higher and lands steeper.",
            },
            {
                question: "How does wind affect the projectile?",
                answer:
                    "Wind applies horizontal acceleration throughout flight time, shifting longer hang-time shots further than quick low shots.",
            },
            {
                question: "What units does the simulator use?",
                answer:
                    "All distances are in meters (m), speeds in meters per second (m/s), angles in degrees (°), and gravity in m/s².",
            },
            {
                question: "Why do I see a dashed line from my last shot?",
                answer:
                    "The previous trajectory trace stays visible so students can visually compare how changing a single variable shifts the parabola.",
            },
            {
                question: "Does projectile mass change the path?",
                answer:
                    "Under uniform gravity without mass-dependent drag, trajectory depends only on launch velocity, launch angle, and gravitational acceleration.",
            },
            {
                question: "Can teachers use this in physics class?",
                answer:
                    "Yes, it is designed for both individual student practice and front-of-class projector demonstrations.",
            },
        ],
    },
    "torque-balance": {
        description: [
            {
                title: "Rotational Equilibrium & Mechanical Advantage",
                content:
                    "A seesaw is a classic Class-1 lever. Whether it tips left, tips right, or balances horizontally depends on torque (τ = Force × Distance from fulcrum), not weight alone. Placing a 2 kg block at 6 meters creates 12 N·m of turning moment—exactly balancing a 6 kg block at 2 meters.",
            },
            {
                title: "Physics Meets Visual Math",
                content:
                    "For younger learners, Torque Balance turns multiplication tables and factor pairs into a physical puzzle (e.g., 3 × 4 = 2 × 6). For older students, multi-block challenges build fluency with linear equations and summed moments: Σ(m·d)left = Σ(m·d)right.",
            },
            {
                title: "Sandbox & Timed Challenge Modes",
                content:
                    "Explore freely in Lab Sandbox mode to test any combination of blocks, or jump into Balance Challenge mode to solve progressive puzzles under the clock.",
            },
        ],
        howToUse: [
            {
                title: "Examine the Left Arm",
                steps: [
                    "Read the mass (kg) and distance tick (1–6 m) of the blocks on the left arm.",
                    "Calculate total left torque by multiplying each mass by its distance from center.",
                ],
            },
            {
                title: "Place Counterweights",
                steps: [
                    "Select a mass block from the tray (1 kg to 10 kg).",
                    "Click a numbered slot on the right beam to drop or remove a weight.",
                ],
            },
            {
                title: "Lock Equilibrium",
                steps: [
                    "Watch the beam level smoothly to 0° when both moments match.",
                    "Confirm Balance to advance through harder multi-weight stages.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Look for Clean Factor Pairs",
                content:
                    "Compute the left torque first (for example, 4 kg × 3 m = 12). Then scan factor pairs of 12 (2 × 6, 3 × 4, 6 × 2) to solve the puzzle in one block.",
            },
            {
                title: "Split Large Torques Across Two Slots",
                content:
                    "When a single block cannot match an awkward total like 17, combine two blocks—such as 3 kg at 5 m (15) plus 1 kg at 2 m (2).",
            },
            {
                title: "Watch the Tilt Angle",
                content:
                    "If the beam barely tilts right, you are only 1–2 torque units over. Nudge a block inward by one meter rather than clearing the whole side.",
            },
            {
                title: "Practice Without the Formula Hint",
                content:
                    "Try solving puzzles mentally before glancing at the live torque totals to strengthen mental multiplication speed.",
            },
        ],
        faqs: [
            {
                question: "What is the formula for torque on a lever?",
                answer:
                    "Torque equals force times perpendicular distance from the pivot: τ = F × d. In our balance scale, comparing mass × distance directly determines equilibrium.",
            },
            {
                question: "Can I place more than one block on the right side?",
                answer:
                    "Yes. Total torque on either side is the sum of (mass × distance) for every placed block on that arm.",
            },
            {
                question: "What age group is this tool best for?",
                answer:
                    "Elementary students (ages 8–12) build multiplication intuition, while middle and high school students practice rotational mechanics and static equilibrium.",
            },
            {
                question: "How do I remove a placed block?",
                answer:
                    "Click any occupied slot on the right arm to pick up and remove that weight, or use Clear Right Arm to reset.",
            },
            {
                question: "Why does a heavy block near the center barely move the seesaw?",
                answer:
                    "At distance 1 m, its lever arm is short, so it generates little rotational torque compared to a lighter block far out at 5–6 m.",
            },
            {
                question: "How does Challenge scoring work?",
                answer:
                    "Each balanced stage awards points based on stage complexity and speed, with streak bonuses for zero-error solves.",
            },
        ],
    },
    "solar-gravity-3d": {
        description: [
            {
                title: "Interactive 3D Orbital Mechanics",
                content:
                    "Step inside a real-time WebGL gravitational system built with Three.js. A luminous central star bends a 3D spacetime curvature grid beneath orbiting worlds while your multi-part spacecraft responds continuously to Newtonian universal gravitation: F = G·M·m / r².",
            },
            {
                title: "See Why Orbits Curve and Accelerate",
                content:
                    "As your probe dips closer to the central star, gravitational pull intensifies and the satellite visibly accelerates—demonstrating Kepler's Second Law (equal areas in equal times). When it climbs outward, speed trades back into gravitational potential energy.",
            },
            {
                title: "Orbital Insertion Challenge",
                content:
                    "Dial launch velocity and injection angle in the collapsible bottom dock to thread your probe cleanly through the glowing orbital target ring without crashing into the star or escaping into deep space.",
            },
        ],
        howToUse: [
            {
                title: "Inspect the 3D Space",
                steps: [
                    "Drag to orbit the camera and scroll to zoom around the planetary system.",
                    "Switch between Angled, Top-Down, and Wide camera views from the bottom dock.",
                ],
            },
            {
                title: "Configure Launch",
                steps: [
                    "Set initial Orbital Speed and Launch Angle sliders.",
                    "Click Launch Probe to release the spacecraft with a live orbital trail.",
                ],
            },
            {
                title: "Complete Stable Orbits",
                steps: [
                    "Keep the probe inside the stable orbital band for full 360° revolutions.",
                    "Hide the dock anytime for an unobstructed 3D cinema view.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Aim Tangentially First",
                content:
                    "A 0° tangential launch perpendicular to the star gives the cleanest circular orbit when paired with nominal circular orbital velocity.",
            },
            {
                title: "Watch Your Velocity Telemetry",
                content:
                    "If minimum and maximum speeds vary wildly, your orbit is highly elliptical. Trim launch speed closer to the circular reference value.",
            },
            {
                title: "Use Top-Down View for Precision",
                content:
                    "Switching to Top-Down camera makes it easy to inspect eccentricity and see whether your trajectory clears the inner exclusion zone.",
            },
            {
                title: "Experiment With Gravity Slingshots",
                content:
                    "Try launching slightly faster or angled inward to observe elongated comet-like ellipses and hyperbolic escape paths.",
            },
        ],
        faqs: [
            {
                question: "Does this 3D simulator run real physics equations?",
                answer:
                    "Yes. Every frame integrates inverse-square gravitational acceleration (a = -μ·r / |r|³) using sub-stepped symplectic physics for smooth, stable orbits.",
            },
            {
                question: "What is the curved blue grid beneath the planets?",
                answer:
                    "It is a 3D gravity-well visualization illustrating how massive bodies curve surrounding gravitational potential—deeper funnels mean stronger pull.",
            },
            {
                question: "Does it require a dedicated graphics card?",
                answer:
                    "No. The Three.js renderer automatically detects GPU vs. software WebGL and adapts pixel ratio and frame pacing so it remains responsive on laptops and school Chromebooks.",
            },
            {
                question: "Why did my satellite crash into the star?",
                answer:
                    "Its tangential velocity was below the minimum needed to clear the star's radius at periapsis. Increase launch speed or reduce inward launch angle.",
            },
            {
                question: "Why did my probe fly away off-screen?",
                answer:
                    "Your launch speed exceeded escape velocity (√2 × circular velocity), giving the spacecraft enough kinetic energy to break free of gravity.",
            },
            {
                question: "Can I collapse the controls to view the 3D scene clearly?",
                answer:
                    "Yes, click Hide Controls on the bottom dock (or press H) for a clean, unobstructed 3D viewport.",
            },
        ],
    },
    "spatial-aim-3d": {
        description: [
            {
                title: "True 3D Depth Reaction & Aim Training",
                content:
                    "Unlike flat 2D target grids, the 3D FPS Reaction & Spatial Aim Arena renders composite multi-ring drone targets inside a three-dimensional training chamber. Targets spawn across near, mid, and far depth planes, forcing your visual system to adjust angular travel and micro-precision dynamically.",
            },
            {
                title: "Three Specialized Training Modes",
                content:
                    "Train single-target snap speed in Flick Mode, rapid multi-target transitions in Depth Grid Mode (3 simultaneous targets), or continuous prediction in Moving Drones Mode.",
            },
            {
                title: "Millisecond Performance Telemetry",
                content:
                    "Every hit records exact target-acquisition latency in milliseconds alongside overall accuracy percentage and hit streak, automatically syncing to your Reflextry local progress.",
            },
        ],
        howToUse: [
            {
                title: "Pick Your 3D Mode",
                steps: [
                    "Choose Flick, Depth Grid, or Moving Drones in the bottom dock.",
                    "Click Start 3D Session inside the arena.",
                ],
            },
            {
                title: "Acquire Targets in Depth",
                steps: [
                    "Click directly on the glowing 3D target drones as they spawn.",
                    "Maintain clean click accuracy—misses lower your precision ratio.",
                ],
            },
            {
                title: "Review Benchmark",
                steps: [
                    "Inspect Total Hits, Accuracy %, and Average Reaction ms after the 30-second sprint.",
                    "Compare repeated runs across the same mode to measure improvement.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Prioritize 90%+ Accuracy First",
                content:
                    "Speed built on frantic misses creates sloppy muscle memory. Lock in smooth, deliberate paths onto far targets first, then accelerate your tempo.",
            },
            {
                title: "Track Depth Size Cues",
                content:
                    "Distant drones subtend smaller visual angles and need finer wrist micro-corrections, while close drones reward broader arm flicks.",
            },
            {
                title: "Keep Eyes Centered in Depth Grid",
                content:
                    "In 3-target Depth Grid mode, keep your gaze slightly soft near the center of the cluster so you immediately read the next target's coordinates before finishing your current click.",
            },
            {
                title: "Use Consistent Mouse Sensitivity",
                content:
                    "Keep OS pointer acceleration disabled and practice with the same mouse DPI so your spatial benchmarks stay comparable session to session.",
            },
        ],
        faqs: [
            {
                question: "How is 3D hit detection calculated?",
                answer:
                    "Clicks cast a precise 3D Three.js Raycaster beam from the perspective camera through your cursor coordinates directly onto each drone's 3D collision volume.",
            },
            {
                question: "Does this work with both mouse and trackpad?",
                answer:
                    "Yes, though a dedicated optical mouse yields faster, more consistent millisecond reaction scores.",
            },
            {
                question: "What is a strong score in 30-second Flick Mode?",
                answer:
                    "Hitting 25–35 targets at 85%+ accuracy is solid intermediate performance; experienced FPS players frequently push past 45 hits with sub-500ms average acquisition times.",
            },
            {
                question: "Why do some targets appear smaller than others?",
                answer:
                    "Targets spawn across genuine Z-axis depth layers inside the 3D room, creating natural perspective scaling just like opponents at varied distances in FPS games.",
            },
            {
                question: "Does it run smoothly without a gaming GPU?",
                answer:
                    "Yes. It automatically adapts pixel ratio and shadow rendering when running on integrated or software graphics.",
            },
            {
                question: "Are my 3D Aim scores saved to Statistics?",
                answer:
                    "Yes, completed sessions are saved locally under your Reflextry history.",
            },
        ],
    },
    "reaction-duel-2p": {
        description: [
            {
                title: "Head-to-Head Millisecond Reflex Competition",
                content:
                    "2-Player Reaction Duel turns single-player reaction benchmarking into a tense, zero-latency split-screen showdown. Both players face the exact same randomized wait interval and visual Go flash on one screen—eliminating internet lag and making every millisecond gap unmistakably real.",
            },
            {
                title: "Keyboard & Touch Split-Screen",
                content:
                    "On laptops and desktops, Player 1 triggers with the A key while Player 2 triggers with L. On tablets and touchscreens, each player taps their dedicated side of the split arena.",
            },
            {
                title: "False-Start Discipline",
                content:
                    "Just like track-and-field starting blocks, jumping the gun before the signal turns green triggers an immediate False Start foul and awards the round point to the opponent.",
            },
        ],
        howToUse: [
            {
                title: "Assign Sides",
                steps: [
                    "Player 1 takes Left (Key A or Left Tap); Player 2 takes Right (Key L or Right Tap).",
                    "Press Start Duel to arm Round 1 of the Best-of-5 match.",
                ],
            },
            {
                title: "Hold Until Green",
                steps: [
                    "Stay motionless during the randomized Ready wait phase.",
                    "Strike immediately when the signal turns green.",
                ],
            },
            {
                title: "Compare Splits",
                steps: [
                    "Read each player's reaction time in ms and the winning margin.",
                    "First player to 3 round wins takes the match trophy.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Rest Fingers Lightly on Keys",
                content:
                    "Hovering above the keyboard adds 30–60ms of mechanical travel. Rest your fingertip directly on A or L without pressing down.",
            },
            {
                title: "Focus on the Center Signal",
                content:
                    "Watch the central color transition rather than glancing at your opponent's hand—watching your opponent can bait you into false starts.",
            },
            {
                title: "Stay Relaxed",
                content:
                    "Over-tensing your wrist slows initial muscle firing. Take a calm breath during the wait window so your reflex snaps cleanly.",
            },
            {
                title: "Swap Sides Between Matches",
                content:
                    "If playing on a laptop keyboard, swap A and L between matches to keep hand posture fair for both players.",
            },
        ],
        faqs: [
            {
                question: "How accurate is the millisecond gap between players?",
                answer:
                    "Both inputs are measured on the same device clock using high-resolution performance.now() timestamps, giving fair sub-millisecond relative timing.",
            },
            {
                question: "What happens if someone presses too early?",
                answer:
                    "Pressing during the Ready wait state immediately calls a False Start and awards that round to the other player.",
            },
            {
                question: "Can we play on a single tablet or phone?",
                answer:
                    "Yes, both player zones are large touch targets designed for face-to-face play on tablets or landscape phones.",
            },
            {
                question: "How many rounds are in a match?",
                answer:
                    "Standard matches are Best of 5 (first to 3 wins), keeping matches fast and exciting under 60 seconds.",
            },
            {
                question: "Does this require an internet connection after loading?",
                answer:
                    "No, all duel logic runs locally in your browser with zero server lag.",
            },
            {
                question: "Are winning reaction times saved?",
                answer:
                    "Yes, the match winner's fastest clean reaction time is recorded to local session history.",
            },
        ],
    },
    "math-tug-of-war": {
        description: [
            {
                title: "Turn Mental Math Into a 2-Player Classroom Sport",
                content:
                    "2-Player Math Tug-of-War pits two learners head-to-head on a single screen. Each player gets synchronized arithmetic challenges and three quick answer choices. Every correct solve pulls the central tug-of-war knot toward your team's flag; a wrong guess slips momentum backward.",
            },
            {
                title: "Three Curriculum-Ready Difficulty Tiers",
                content:
                    "Choose Kids (addition and subtraction up to 20), Student (multiplication, division, and two-step arithmetic), or Pro (larger products, squares, and solve-for-x mini equations) so classrooms of any age can compete fairly.",
            },
            {
                title: "Dual Keyboard & Split-Screen Touch",
                content:
                    "Player 1 uses keys 1 / 2 / 3 (or taps left answer cards) while Player 2 uses keys 8 / 9 / 0 (or taps right answer cards), making it effortless on interactive whiteboards, laptops, and iPads.",
            },
        ],
        howToUse: [
            {
                title: "Select Tier",
                steps: [
                    "Pick Kids, Student, or Pro difficulty.",
                    "Click Start Tug-of-War to begin the 45-second match.",
                ],
            },
            {
                title: "Solve & Pull",
                steps: [
                    "Player 1 answers with keys 1, 2, 3 (or tap); Player 2 uses 8, 9, 0 (or tap).",
                    "Correct answers pull the rope marker one step toward your flag.",
                ],
            },
            {
                title: "Win the Match",
                steps: [
                    "Pull the marker all the way to your victory line for an instant knockout, or lead when the clock hits zero.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Use Last-Digit Elimination",
                content:
                    "On multiplication prompts like 14 × 7, check the last digit first (4 × 7 ends in 8) to eliminate wrong choices instantly.",
            },
            {
                title: "Avoid Panic Guessing",
                content:
                    "Wild guessing shifts the rope toward your opponent and briefly locks your next pull. A half-second mental check beats frantic tapping.",
            },
            {
                title: "Chunk Two-Digit Sums",
                content:
                    "Add tens first, then ones (e.g., 47 + 36 → 77 + 6 = 83). Left-to-right mental addition is faster under competitive timers.",
            },
            {
                title: "Step Up Tiers Together",
                content:
                    "Once both players consistently finish Kids rounds with 95%+ accuracy, move up to Student or Pro to keep building fluency.",
            },
        ],
        faqs: [
            {
                question: "Do both players get fair questions?",
                answer:
                    "Yes. Both players draw from the same difficulty generator with balanced numeric ranges and clean integer answers.",
            },
            {
                question: "Can teachers use this on a classroom Smartboard or tablet?",
                answer:
                    "Yes. The left and right answer buttons are large touch targets, so two students can stand side-by-side at a touchscreen or share a keyboard.",
            },
            {
                question: "What happens if a player taps the wrong answer?",
                answer:
                    "A wrong answer nudges the rope slightly toward the opponent and flashes clear feedback without freezing the match.",
            },
            {
                question: "What math topics are covered in Pro mode?",
                answer:
                    "Pro mode includes rapid multi-digit addition/subtraction, multiplication, division, perfect squares, and simple solve-for-x linear equations.",
            },
            {
                question: "How long does one Tug-of-War match last?",
                answer:
                    "Matches run up to 45 seconds—or end sooner if one player achieves a full rope-pull knockout.",
            },
            {
                question: "Can one student play solo to practice?",
                answer:
                    "Yes, or try our single-player Mental Math Speed tool in the Speed Arena for solo personal-best tracking.",
            },
        ],
    },
    "cannon-battle-2p": {
        description: [
            {
                title: "Turn-Based 2D Physics Artillery",
                content:
                    "2-Player Gravity Cannon Battle combines classic turn-based artillery strategy with authentic projectile motion physics. Two rival outposts sit across a procedurally generated mountain ridge while shifting wind and planetary gravity test your ability to calculate arcs on the fly.",
            },
            {
                title: "Learn Ballistics Through Competition",
                content:
                    "Players quickly discover real physics trade-offs: clearing a tall center peak demands a steep launch angle, which increases hang time and exposes the shell to stronger wind drift. Landing direct hits rewards sharp estimation and systematic angle bracketing.",
            },
            {
                title: "Earth, Moon & Mars Battlefields",
                content:
                    "Switch planetary gravity presets between matches—low lunar gravity sends gentle shells soaring over huge cliffs, while Earth gravity demands tighter ballistic precision.",
            },
        ],
        howToUse: [
            {
                title: "Configure Battlefield",
                steps: [
                    "Choose Earth, Moon, or Mars gravity and click New Battle.",
                    "Check the active player banner and current wind vector arrow.",
                ],
            },
            {
                title: "Aim & Fire",
                steps: [
                    "Dial your Cannon Angle and Launch Power sliders.",
                    "Click Fire Shot to launch a live physics projectile across the valley.",
                ],
            },
            {
                title: "Win the Duel",
                steps: [
                    "Direct hits deal heavy damage; nearby splash impacts deal partial damage.",
                    "Reduce your rival's HP from 100 to 0 to claim victory.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Adjust One Variable Per Turn",
                content:
                    "Keep your angle fixed after your first ranging shot and adjust only Power (or vice versa). Changing both at once makes bracketing harder.",
            },
            {
                title: "Read Wind Before High Lob Shots",
                content:
                    "Strong wind pushing against you can stall a 70° lob right back onto your own hill. Lower the angle and boost velocity when firing into headwinds.",
            },
            {
                title: "Use Terrain Cover Strategically",
                content:
                    "Notice the exact height of the center ridge—find the lowest clean angle that clears the peak to minimize flight time.",
            },
            {
                title: "Watch Previous Shot Trails",
                content:
                    "Each player's last trajectory arc remains faintly drawn on the valley so you can visually measure how many meters short or long your previous shot fell.",
            },
        ],
        faqs: [
            {
                question: "Does the wind change during the battle?",
                answer:
                    "Yes, wind shifts slightly every couple of turns, forcing both players to stay attentive to the wind indicator.",
            },
            {
                question: "How much damage does a direct hit deal?",
                answer:
                    "A direct hit deals 40 HP damage, while close splash impacts deal 15–30 HP depending on distance from the target outpost.",
            },
            {
                question: "Can we play on different planets?",
                answer:
                    "Yes—toggle between Earth (9.81 m/s²), Mars (3.72 m/s²), and Moon (1.62 m/s²) gravity presets.",
            },
            {
                question: "Is the terrain different every match?",
                answer:
                    "Yes, each New Battle generates a fresh ridge profile and valley geometry.",
            },
            {
                question: "Can two people play on a tablet or laptop?",
                answer:
                    "Yes, the turn-based sliders and large Fire button work cleanly on both desktop mice and mobile touchscreens.",
            },
            {
                question: "What physics concepts does this reinforce?",
                answer:
                    "It reinforces parabolic kinematics, vector decomposition, gravitational acceleration, and horizontal wind drag.",
            },
        ],
    },
    "speed-reading": {
        description: [
            {
                title: "Measure True Effective Reading Speed",
                content:
                    "Reading fast means little if you forget the paragraph the moment you finish. Our Speed Reading & Comprehension Lab pairs curated science, cognitive, and workplace passages with a 3-question comprehension check—calculating both Raw WPM and Effective WPM (Raw WPM × Comprehension %).",
            },
            {
                title: "Paced Highlighter vs. RSVP Training",
                content:
                    "In Paced Highlighter mode, a smooth visual pacer glides across the full passage at your chosen WPM to train forward eye momentum and cut unconscious backtracking. In RSVP (Rapid Serial Visual Presentation) mode, words flash cleanly at a single focal point with an optimal-recognition letter highlight to minimize eye-movement overhead.",
            },
            {
                title: "Built for Students & Knowledge Workers",
                content:
                    "Whether preparing for university exams, reviewing technical documentation, or sharpening daily study focus, repeated 2-minute sessions help establish an honest personal reading baseline.",
            },
        ],
        howToUse: [
            {
                title: "Choose Mode & Pace",
                steps: [
                    "Select a curated topic (Neuroscience, Orbital Physics, or Deep Work).",
                    "Choose Paced Passage or RSVP Flash mode and set your target WPM.",
                ],
            },
            {
                title: "Read Smoothly",
                steps: [
                    "Click Start Reading and keep your eyes tracking forward without rereading.",
                    "Click Finish Reading once you complete the passage.",
                ],
            },
            {
                title: "Verify Comprehension",
                steps: [
                    "Answer the 3 multiple-choice questions honestly without peeking back.",
                    "Record your Effective WPM and track growth in Statistics.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Target 80%+ Comprehension Before Raising Speed",
                content:
                    "If comprehension drops to 33% or 66%, dial your pacer back by 30–40 WPM until understanding stays crisp, then climb gradually.",
            },
            {
                title: "Reduce Subvocalization on Familiar Words",
                content:
                    "Silently pronouncing every word caps speed near speaking pace (~150–200 WPM). Practice recognizing common phrases visually as single meaning chunks.",
            },
            {
                title: "Stop Regression (Eye Backtracking)",
                content:
                    "Most slow reading comes from jumping backward to re-verify words you already saw. Trust the forward highlighter pacer to break the habit.",
            },
            {
                title: "Match Speed to Material Density",
                content:
                    "Skim familiar overviews faster (350+ WPM) and intentionally slow down for dense equations or legal clauses—flexible pacing is the hallmark of skilled readers.",
            },
        ],
        faqs: [
            {
                question: "What is Effective WPM?",
                answer:
                    "Effective WPM multiplies your raw reading speed by your quiz accuracy (e.g., 300 WPM × 100% = 300 Effective WPM; 300 WPM × 67% = 200 Effective WPM).",
            },
            {
                question: "What is RSVP speed reading?",
                answer:
                    "RSVP (Rapid Serial Visual Presentation) displays one word at a time at a fixed center point so your eyes spend zero time scanning left-to-right across lines.",
            },
            {
                question: "What is an average adult reading speed?",
                answer:
                    "Most adults read standard non-fiction between 200 and 250 WPM with around 70–80% comprehension.",
            },
            {
                question: "Can speed reading work for complex textbooks?",
                answer:
                    "Speed techniques help you preview chapters and process prose efficiently, though dense math or technical proofs still benefit from deliberate, slower study.",
            },
            {
                question: "Are there multiple passages to practice?",
                answer:
                    "Yes, you can cycle through multiple domain passages covering brain science, physics, and workplace productivity.",
            },
            {
                question: "Does it save my Effective WPM history?",
                answer:
                    "Yes, every completed comprehension quiz logs your Effective WPM in your Reflextry local statistics.",
            },
        ],
    },
    "ten-key": {
        description: [
            {
                title: "Industry-Standard 10-Key KPH Benchmark",
                content:
                    "Numeric keypad speed—measured in Keystrokes Per Hour (KPH)—is a core skill for accounting, finance, logistics, banking, and data-entry assessments. Our 10-Key Numpad Speed Test simulates realistic numeric workflows with live visual keypad feedback and strict accuracy tracking.",
            },
            {
                title: "Three Practical Data Modes",
                content:
                    "Practice clean whole numbers in Integer Mode, decimal currency entries in Accounting/Invoice Mode (e.g., 1425.80), or structured batch codes in Mixed SKU Mode.",
            },
            {
                title: "Accuracy-First Scoring",
                content:
                    "In professional spreadsheets and financial ledgers, a single transposed digit can cost hours. We display both Gross KPH and Accuracy-Adjusted Net KPH alongside your exact error count.",
            },
        ],
        howToUse: [
            {
                title: "Set Your Drill",
                steps: [
                    "Choose Accounting Invoices, Pure Integers, or Mixed Codes.",
                    "Pick a 30-second sprint or 60-second full certification drill.",
                ],
            },
            {
                title: "Type & Submit Entries",
                steps: [
                    "Anchor your right index, middle, and ring fingers on 4, 5, and 6.",
                    "Type the highlighted number and press Enter or Space to submit.",
                ],
            },
            {
                title: "Inspect KPH Metrics",
                steps: [
                    "Review your Net KPH, Accuracy %, and total completed entries.",
                    "Track your KPH growth over repeated sessions in Statistics.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Use the Home Row Bump on Key 5",
                content:
                    "Feel the tactile ridge on the 5 key with your middle finger so you never look down at the keypad.",
            },
            {
                title: "Dedicate Thumb to 0 and Pinky to Enter",
                content:
                    "Assigning thumb to 0, index to 1-4-7, middle to 2-5-8, ring to 3-6-9-decimal, and pinky to Enter eliminates awkward hand jumps.",
            },
            {
                title: "Maintain Steady Rhythm",
                content:
                    "A metronomic pace beats jerky bursts followed by backspaces. Every backspace costs 2–3 keystrokes of momentum.",
            },
            {
                title: "Drill 5 Minutes Before Tests",
                content:
                    "If preparing for a clerical or accounting hiring assessment, run three 60-second Invoice drills daily for one week to lock in 98%+ accuracy.",
            },
        ],
        faqs: [
            {
                question: "How is KPH (Keystrokes Per Hour) calculated?",
                answer:
                    "KPH = (Correctly Typed Keystrokes ÷ Elapsed Seconds) × 3,600. Including the Enter confirmation key mirrors standard employment 10-key exams.",
            },
            {
                question: "What KPH score do employers typically expect?",
                answer:
                    "Most data-entry roles look for 7,000–8,000 KPH at 95%+ accuracy, while top-tier accounting clerks exceed 10,000–12,000 KPH.",
            },
            {
                question: "Can I practice on a laptop without a separate numpad?",
                answer:
                    "Yes! You can use your laptop's top number row or click/tap the interactive on-screen numeric keypad.",
            },
            {
                question: "Does Invoice mode include decimals?",
                answer:
                    "Yes, Accounting/Invoice mode generates realistic dollar/decimal entries so you master the decimal point key seamlessly.",
            },
            {
                question: "Do mistakes hurt my score?",
                answer:
                    "Yes, incorrect submissions lower your accuracy percentage and do not count toward Net KPH.",
            },
            {
                question: "Is my 10-Key KPH saved locally?",
                answer:
                    "Yes, completed 30s and 60s drills record automatically to your Statistics page.",
            },
        ],
    },
    "focus-sprint": {
        description: [
            {
                title: "Deep Work Meets Objective Cognitive Measurement",
                content:
                    "Most study timers only count minutes—they never tell you whether your brain actually stayed sharp. Focus Sprint pairs a distraction-free work or study countdown (1m Demo, 10m, 15m, or 25m Pomodoro) with a rapid 3-trial millisecond reaction baseline before and after your sprint.",
            },
            {
                title: "Spot Your Peak Hours & Fatigue Threshold",
                content:
                    "By comparing your post-sprint reaction average against your pre-sprint baseline, you can see whether a session warmed you up (-10ms faster) or drained your attention (+25ms slower), helping students and remote professionals schedule breaks intelligently.",
            },
            {
                title: "Calm, Zero-Clutter Study Workspace",
                content:
                    "Designed in a crisp clinical layout with no flashing banners or audio spam, Focus Sprint stays quiet in a browser tab until your chosen work interval completes with a gentle audio chime.",
            },
        ],
        howToUse: [
            {
                title: "Set Sprint Goal",
                steps: [
                    "Enter a short task label (e.g., Physics Chapter 4 or Q3 Report).",
                    "Choose 1m Quick Demo, 10m, 15m, or 25m Pomodoro duration.",
                ],
            },
            {
                title: "Log Pre-Sprint Baseline",
                steps: [
                    "Complete 3 quick visual reaction clicks when the pad turns green.",
                    "Your pre-sprint average (ms) locks in and the focus timer starts automatically.",
                ],
            },
            {
                title: "Check Post-Sprint Alertness",
                steps: [
                    "When the sprint finishes, run the 3-trial post-sprint reaction check.",
                    "Compare your fatigue delta (ms) and decide whether to take a 5-minute break.",
                ],
            },
        ],
        howToImprove: [
            {
                title: "Respect +20ms Fatigue Signals",
                content:
                    "When post-sprint latency rises noticeably above baseline, step away from screens for 5 minutes, hydrate, and stretch instead of forcing another dull block.",
            },
            {
                title: "Log Morning vs. Afternoon Sprints",
                content:
                    "Compare baselines at 9 AM, 2 PM, and 7 PM over a week to discover your personal cognitive peak window for hard math or coding work.",
            },
            {
                title: "Keep One Single Task Per Sprint",
                content:
                    "Task-switching drains working memory faster than sustained focus. Write one concrete deliverable before starting each timer.",
            },
            {
                title: "Use 15-Minute Sprints When Overwhelmed",
                content:
                    "If 25 minutes feels too steep to start, launch a 10 or 15-minute sprint—momentum usually carries you smoothly into the next block.",
            },
        ],
        faqs: [
            {
                question: "Why measure reaction time before and after studying?",
                answer:
                    "Visual reaction time is a sensitive indicator of alertness and mental fatigue. Comparing pre- and post-sprint averages turns subjective tiredness into a clear millisecond readout.",
            },
            {
                question: "Can I test the full flow quickly without waiting 25 minutes?",
                answer:
                    "Yes! Select the 1m Quick Demo preset (or click Finish Sprint Early) to experience the complete Pre-Check → Focus Timer → Post-Check fatigue report immediately.",
            },
            {
                question: "What does a negative delta (e.g., -12ms) mean?",
                answer:
                    "A negative millisecond delta means you reacted faster after the sprint than before—common when a focused session warms up your alertness.",
            },
            {
                question: "What does a positive delta (e.g., +30ms) mean?",
                answer:
                    "A positive delta means your reaction slowed after the sprint, suggesting mental fatigue and signaling that a real break will restore productivity.",
            },
            {
                question: "Does the timer keep running if I switch tabs?",
                answer:
                    "Yes. The countdown computes remaining time from real wall-clock timestamps rather than relying solely on throttled background ticks.",
            },
            {
                question: "Is my sprint log stored privately?",
                answer:
                    "Yes, all sprint summaries and reaction baselines stay strictly in your own browser's local storage.",
            },
        ],
    },
};
