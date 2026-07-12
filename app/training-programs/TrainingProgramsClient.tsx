"use client";

import { motion } from "framer-motion";
import { Target, Zap, Brain, Trophy, TrendingUp, Clock, Award, CheckCircle2, Sparkles, Dumbbell } from "lucide-react";
import Link from "next/link";

interface Program {
    title: string;
    description: string;
    duration: string;
    level: string;
    goals: string[];
    schedule: {
        day: string;
        activities: string[];
    }[];
    tips: string[];
}

const programs: Program[] = [
    {
        title: "Memory Master Program",
        description: "Comprehensive 4-week program to dramatically improve your memory capacity, recall speed, and retention abilities.",
        duration: "4 weeks",
        level: "Beginner to Intermediate",
        goals: [
            "Increase working memory capacity by 30-50%",
            "Improve long-term memory retention",
            "Master memory techniques (chunking, visualization, association)",
            "Enhance focus and concentration"
        ],
        schedule: [
            {
                day: "Week 1: Foundation Building",
                activities: [
                    "Days 1-2: Sequence Memory (10 min) + Number Memory (10 min)",
                    "Days 3-4: Visual Memory (10 min) + Shape Recognition (10 min)",
                    "Days 5-7: Color Memory (10 min) + Symbol Matching (10 min)",
                    "Daily: Practice chunking technique with phone numbers and lists"
                ]
            },
            {
                day: "Week 2: Capacity Expansion",
                activities: [
                    "Days 1-3: All memory games, 15 min each",
                    "Days 4-5: Focus on weakest areas, 20 min sessions",
                    "Days 6-7: Mixed practice, rotating games every 10 min",
                    "Daily: Apply memory techniques to real-world tasks"
                ]
            },
            {
                day: "Week 3: Advanced Techniques",
                activities: [
                    "Days 1-2: Memory Palace technique practice (15 min) + Visual Memory (15 min)",
                    "Days 3-4: Speed challenges - faster recall with maintained accuracy",
                    "Days 5-7: Complex sequences and patterns, 20 min sessions",
                    "Daily: Memorize and recall daily information (shopping lists, schedules)"
                ]
            },
            {
                day: "Week 4: Mastery & Application",
                activities: [
                    "Days 1-3: All games at highest difficulty, 15 min each",
                    "Days 4-5: Timed challenges and personal bests",
                    "Days 6-7: Real-world application and assessment",
                    "Final assessment: Compare scores to Week 1 baseline"
                ]
            }
        ],
        tips: [
            "Practice at the same time daily for consistency",
            "Get 7-9 hours of sleep for memory consolidation",
            "Use spaced repetition - review information at increasing intervals",
            "Create vivid mental images to enhance encoding",
            "Stay hydrated and maintain a brain-healthy diet"
        ]
    },
    {
        title: "Speed & Reaction Pro",
        description: "Intensive 3-week program designed for gamers and athletes to maximize reaction time, processing speed, and rapid decision-making.",
        duration: "3 weeks",
        level: "All Levels",
        goals: [
            "Reduce reaction time by 10-20%",
            "Improve click speed and accuracy",
            "Enhance rapid decision-making",
            "Optimize gaming and athletic performance"
        ],
        schedule: [
            {
                day: "Week 1: Baseline & Fundamentals",
                activities: [
                    "Day 1: Baseline testing - all reaction and speed tools",
                    "Days 2-3: Reaction Time Test (15 min) + Sound Reaction (10 min)",
                    "Days 4-5: Click Speed Test (15 min) + Grid Shot (15 min)",
                    "Days 6-7: Directional Reflex (15 min) + Peripheral Vision (10 min)"
                ]
            },
            {
                day: "Week 2: Intensity & Precision",
                activities: [
                    "Days 1-2: Multi-Stimulus Reaction (15 min) + Sequence Reaction (15 min)",
                    "Days 3-4: Aim Trainer (20 min) + Precision Clicking (10 min)",
                    "Days 5-6: Speed Math (15 min) + Typing Speed (15 min)",
                    "Day 7: Mixed practice - rotate all tools, 5 min each"
                ]
            },
            {
                day: "Week 3: Peak Performance",
                activities: [
                    "Days 1-3: Gaming warm-up routine (Aim Trainer 10 min + Grid Shot 10 min + Reaction Test 5 min)",
                    "Days 4-5: Personal best challenges - beat your records",
                    "Days 6-7: Final assessment and performance comparison",
                    "Daily: Apply skills in actual gaming or sports practice"
                ]
            }
        ],
        tips: [
            "Warm up before each session with light stretching",
            "Use as pre-gaming warm-up for immediate performance boost",
            "Focus on accuracy first, then gradually increase speed",
            "Take short breaks between intense sessions",
            "Track progress daily to maintain motivation"
        ]
    },
    {
        title: "Cognitive Fitness Complete",
        description: "Comprehensive 6-week program for overall cognitive enhancement, building memory, speed, accuracy, and executive function.",
        duration: "6 weeks",
        level: "All Levels",
        goals: [
            "Build comprehensive cognitive abilities",
            "Improve memory, speed, and accuracy",
            "Enhance focus and mental endurance",
            "Establish sustainable brain training habits"
        ],
        schedule: [
            {
                day: "Weeks 1-2: Foundation Phase",
                activities: [
                    "Monday: Memory games (20 min)",
                    "Tuesday: Reaction and reflex tests (20 min)",
                    "Wednesday: Speed training (typing, clicking, math) (20 min)",
                    "Thursday: Accuracy tools (precision, pattern matching) (20 min)",
                    "Friday: Mixed practice (15 min)",
                    "Weekend: Review and light practice (10 min each day)"
                ]
            },
            {
                day: "Weeks 3-4: Building Phase",
                activities: [
                    "Monday: Advanced memory techniques (25 min)",
                    "Tuesday: Complex reaction tests (25 min)",
                    "Wednesday: Speed challenges (25 min)",
                    "Thursday: Precision and accuracy (25 min)",
                    "Friday: Gaming tools and application (25 min)",
                    "Weekend: Personal best challenges"
                ]
            },
            {
                day: "Weeks 5-6: Mastery Phase",
                activities: [
                    "Monday-Thursday: Rotate all tool categories (30 min each)",
                    "Friday: Comprehensive mixed practice (30 min)",
                    "Weekend: Real-world application and assessment",
                    "Final week: Performance testing and comparison to baseline"
                ]
            }
        ],
        tips: [
            "Maintain consistency - daily practice is key",
            "Combine with physical exercise for maximum benefits",
            "Ensure adequate sleep and stress management",
            "Vary difficulty to prevent plateaus",
            "Celebrate improvements to maintain motivation"
        ]
    },
    {
        title: "Senior Brain Health",
        description: "Gentle yet effective 8-week program designed for older adults to maintain cognitive function, prevent decline, and build cognitive reserve.",
        duration: "8 weeks",
        level: "Beginner",
        goals: [
            "Maintain and improve cognitive function",
            "Build cognitive reserve against decline",
            "Enhance memory and processing speed",
            "Improve quality of life and independence"
        ],
        schedule: [
            {
                day: "Weeks 1-2: Gentle Introduction",
                activities: [
                    "Days 1-3: Simple memory games (10 min)",
                    "Days 4-5: Basic reaction tests (10 min)",
                    "Days 6-7: Light practice and rest",
                    "Focus: Learning tools and establishing routine"
                ]
            },
            {
                day: "Weeks 3-4: Gradual Progression",
                activities: [
                    "Monday/Wednesday/Friday: Memory training (15 min)",
                    "Tuesday/Thursday: Reaction and speed (15 min)",
                    "Weekend: Review and light practice",
                    "Focus: Building confidence and capacity"
                ]
            },
            {
                day: "Weeks 5-6: Sustained Practice",
                activities: [
                    "Daily practice: 15-20 min rotating different tools",
                    "Include variety: memory, speed, accuracy",
                    "Focus: Consistency and gradual improvement"
                ]
            },
            {
                day: "Weeks 7-8: Maintenance & Lifestyle",
                activities: [
                    "Continue daily practice (15-20 min)",
                    "Combine with social activities and physical exercise",
                    "Apply skills to daily life (remembering names, lists, etc.)",
                    "Final assessment and long-term planning"
                ]
            }
        ],
        tips: [
            "Start slowly and progress at your own pace",
            "Practice at times when you feel most alert",
            "Combine with social engagement for additional benefits",
            "Include physical activity (walking, gentle exercise)",
            "Maintain a brain-healthy diet rich in omega-3s and antioxidants"
        ]
    }
];

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Dumbbell className="w-32 h-32 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Trophy className="w-40 h-40 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function TrainingProgramsClient() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-background py-8 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden relative">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto space-y-12 relative z-10"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center space-y-4 mb-12 relative z-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="inline-block relative mb-4"
                        suppressHydrationWarning
                    >
                        <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <Dumbbell className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-blue-400 dark:via-indigo-400 dark:to-indigo-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm"
                            suppressHydrationWarning
                        >
                            <Sparkles className="w-10 h-10 text-blue-400" />
                            Training Programs
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Structured, goal-oriented programs to systematically improve your cognitive performance.
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        Randomly playing games provides limited benefits. To truly enhance neuroplasticity, you need structured progressive overload. Choose a program below and stick to the routine for measurable results.
                    </p>
                </motion.div>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(59,130,246,0.1)] z-10 space-y-12"
                >
                    <FloatingBackground />

                    <div className="grid gap-12">
                        {programs.map((program, index) => (
                            <motion.div
                                key={program.title}
                                variants={itemVariants}
                                className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-500" />
                                
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="md:col-span-1 space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground mb-2">{program.title}</h2>
                                            <p className="text-muted-foreground text-sm">{program.description}</p>
                                        </div>
                                        
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2 text-sm text-foreground bg-white/5 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10">
                                                <Clock className="w-4 h-4 text-blue-400" />
                                                <span>Duration: <strong className="text-blue-500">{program.duration}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-foreground bg-white/5 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10">
                                                <Target className="w-4 h-4 text-indigo-400" />
                                                <span>Level: <strong className="text-indigo-500">{program.level}</strong></span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                                <Award className="w-5 h-5 text-amber-500" />
                                                Program Goals
                                            </h3>
                                            <ul className="space-y-2">
                                                {program.goals.map((goal, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                        <span>{goal}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-6">
                                        <h3 className="font-bold text-foreground flex items-center gap-2 text-lg">
                                            <TrendingUp className="w-5 h-5 text-blue-500" />
                                            Training Schedule
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {program.schedule.map((week, i) => (
                                                <div key={i} className="bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
                                                    <h4 className="font-bold text-blue-500 mb-3 text-sm uppercase tracking-wider">{week.day}</h4>
                                                    <ul className="space-y-2">
                                                        {week.activities.map((activity, j) => (
                                                            <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                                                                <span className="leading-tight">{activity}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                                            <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
                                                <Brain className="w-5 h-5 text-blue-500" />
                                                Pro Tips for Success
                                            </h3>
                                            <ul className="grid sm:grid-cols-2 gap-2">
                                                {program.tips.map((tip, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
