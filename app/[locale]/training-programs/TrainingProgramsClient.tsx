"use client";

import { motion } from "framer-motion";
import { Target, Zap, Brain, Trophy, TrendingUp, Clock, Award, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";

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
        <div className="bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <Trophy className="w-12 h-12 text-neon-yellow" />
                    </motion.div>
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(to right, #00f0ff, #9d00ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Structured Training Programs
                    </h1>
                    <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                        Follow our evidence-based training programs designed for specific goals. Each program provides a structured path to cognitive improvement with daily schedules and expert guidance.
                    </p>
                </div>

                {/* Programs */}
                {programs.map((program, index) => (
                    <motion.div
                        key={program.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                    >
                        {/* Program Header */}
                        <div className="mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{program.title}</h2>
                                    <p className="text-gray-300 leading-relaxed">{program.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 px-4 py-2 bg-neon-teal/20 border border-neon-teal/30 rounded-lg">
                                    <Clock className="w-4 h-4 text-neon-teal" />
                                    <span className="text-neon-teal font-semibold">{program.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-electric-purple/20 border border-electric-purple/30 rounded-lg">
                                    <Target className="w-4 h-4 text-electric-purple" />
                                    <span className="text-electric-purple font-semibold">{program.level}</span>
                                </div>
                            </div>
                        </div>

                        {/* Goals */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-neon-yellow" />
                                Program Goals
                            </h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                {program.goals.map((goal, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                                        <CheckCircle2 className="w-5 h-5 text-neon-teal flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300 text-sm">{goal}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-electric-purple" />
                                Training Schedule
                            </h3>
                            <div className="space-y-4">
                                {program.schedule.map((week, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <h4 className="text-lg font-semibold text-neon-teal mb-3">{week.day}</h4>
                                        <ul className="space-y-2">
                                            {week.activities.map((activity, actIdx) => (
                                                <li key={actIdx} className="flex items-start gap-3 text-gray-300 text-sm">
                                                    <span className="text-neon-teal mt-1">•</span>
                                                    <span>{activity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-neon-yellow" />
                                Success Tips
                            </h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                {program.tips.map((tip, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-gradient-to-r from-neon-yellow/10 to-neon-yellow/5 border border-neon-yellow/20 rounded-lg p-3">
                                        <span className="text-neon-yellow text-lg flex-shrink-0">💡</span>
                                        <span className="text-gray-300 text-sm">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* General Guidelines */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">General Training Guidelines</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-neon-teal mb-3">Before You Start</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-teal mt-1">•</span>
                                    <span>Establish baseline scores for all tools you'll use</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-teal mt-1">•</span>
                                    <span>Set specific, measurable goals</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-teal mt-1">•</span>
                                    <span>Schedule training at consistent times daily</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-teal mt-1">•</span>
                                    <span>Prepare a quiet, distraction-free training environment</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-electric-purple mb-3">During Training</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-electric-purple mt-1">•</span>
                                    <span>Focus fully on each exercise - avoid multitasking</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-electric-purple mt-1">•</span>
                                    <span>Prioritize accuracy over speed initially</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-electric-purple mt-1">•</span>
                                    <span>Take short breaks between intense sessions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-electric-purple mt-1">•</span>
                                    <span>Track your scores after each session</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-neon-yellow mb-3">Progress Tracking</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-yellow mt-1">•</span>
                                    <span>Record scores weekly to monitor improvement</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-yellow mt-1">•</span>
                                    <span>Compare current performance to baseline</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-yellow mt-1">•</span>
                                    <span>Adjust difficulty as you improve</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-yellow mt-1">•</span>
                                    <span>Celebrate milestones to maintain motivation</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-red-400 mb-3">Lifestyle Support</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Get 7-9 hours of quality sleep nightly</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Exercise regularly (150 min/week minimum)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Maintain a brain-healthy diet</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Manage stress through meditation or relaxation</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-neon-teal/20 to-electric-purple/20 border border-neon-teal/30 rounded-2xl p-8 text-center"
                >
                    <Award className="w-12 h-12 text-neon-teal mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Ready to Start Your Training Journey?
                    </h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Choose a program that matches your goals and start training today. Consistency is key—commit to the program and watch your cognitive abilities soar.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/tools"
                            className="px-6 py-3 bg-neon-teal text-black rounded-lg font-semibold hover:bg-neon-yellow transition-colors"
                        >
                            Start Training Now
                        </Link>
                        <Link
                            href="/faq"
                            className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                        >
                            View FAQ
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
