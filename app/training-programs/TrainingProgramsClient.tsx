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

export default function TrainingProgramsClient() {
    return (
        <div className="bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Editorial Header */}
                <header className="space-y-4 border-b border-[#D8D4C9] pb-10 max-w-3xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                        Structured Curricula · 4 Multi-Week Programs
                    </p>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614] leading-[1.08] [text-wrap:balance]">
                        Training Programs
                    </h1>
                    <p className="text-base sm:text-lg text-[#3F3E39] leading-relaxed">
                        Structured, goal-oriented programs to systematically improve your cognitive performance.
                    </p>
                    <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                        Randomly playing games provides limited benefits. To truly enhance neuroplasticity, you need structured progressive overload. Choose a program below and stick to the routine for measurable results.
                    </p>
                </header>

                {/* Program Catalog */}
                <div className="space-y-10">
                    {programs.map((program, index) => (
                        <article
                            key={program.title}
                            className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 lg:p-10 space-y-8"
                        >
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Left Column: Overview & Goals */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                            Program 0{index + 1} · {program.duration} · {program.level}
                                        </p>
                                        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#161614] tracking-[-0.015em]">
                                            {program.title}
                                        </h2>
                                        <p className="text-sm text-[#57554E] leading-relaxed">
                                            {program.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F0EDE6]">
                                        <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-3">
                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78756C] uppercase tracking-wider">
                                                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                                                <span>Duration</span>
                                            </div>
                                            <p className="text-sm font-semibold text-[#161614] mt-1">{program.duration}</p>
                                        </div>
                                        <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-3">
                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78756C] uppercase tracking-wider">
                                                <Target className="w-3.5 h-3.5" aria-hidden="true" />
                                                <span>Level</span>
                                            </div>
                                            <p className="text-sm font-semibold text-[#161614] mt-1">{program.level}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t border-[#F0EDE6]">
                                        <h3 className="text-sm font-semibold text-[#161614] flex items-center gap-2">
                                            <Award className="w-4 h-4 text-[#57554E]" aria-hidden="true" />
                                            <span>Program Goals</span>
                                        </h3>
                                        <ul className="space-y-2">
                                            {program.goals.map((goal, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-[#57554E]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#1E40AF] mt-0.5 shrink-0" aria-hidden="true" />
                                                    <span>{goal}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link
                                        href="/tools"
                                        className="inline-flex items-center justify-center w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-xs font-semibold transition-colors"
                                    >
                                        Open Training Tools
                                    </Link>
                                </div>

                                {/* Right Column: Weekly Schedule & Tips */}
                                <div className="lg:col-span-2 space-y-6 lg:border-l lg:border-[#F0EDE6] lg:pl-8">
                                    <h3 className="font-serif text-xl font-medium text-[#161614] flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-[#57554E]" aria-hidden="true" />
                                        <span>Training Schedule</span>
                                    </h3>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {program.schedule.map((week, i) => (
                                            <div key={i} className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-5">
                                                <h4 className="text-xs font-semibold text-[#161614] uppercase tracking-[0.08em] mb-3">
                                                    {week.day}
                                                </h4>
                                                <ul className="space-y-2">
                                                    {week.activities.map((activity, j) => (
                                                        <li key={j} className="text-sm text-[#57554E] flex items-start gap-2 leading-snug">
                                                            <span className="text-[#78756C] font-mono text-xs mt-0.5">—</span>
                                                            <span>{activity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-5 space-y-3">
                                        <h3 className="text-sm font-semibold text-[#161614] flex items-center gap-2">
                                            <Brain className="w-4 h-4 text-[#57554E]" aria-hidden="true" />
                                            <span>Key Practice Guidelines</span>
                                        </h3>
                                        <ul className="grid sm:grid-cols-2 gap-2.5">
                                            {program.tips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#3F3E39]">
                                                    <Zap className="w-3.5 h-3.5 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
