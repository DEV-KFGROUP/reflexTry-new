"use client";

import { motion } from "framer-motion";
import { Brain, Zap, TrendingUp, Activity, Sparkles, BookOpen, Target, Award } from "lucide-react";
import Link from "next/link";

export default function ScienceClient() {
    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white border border-gray-200 mb-6"
                    >
                        <Brain className="w-12 h-12 text-teal-500" />
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
                        The Science of Brain Training
                    </h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Here is the actual neuroscience behind why reflex and cognitive training works, and exactly what happens to your brain when you grind these modules.
                    </p>
                </div>

                {/* Neuroplasticity Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <Sparkles className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-black mb-4">Neuroplasticity: How You Actually Get Faster</h2>
                            <p className="text-gray-800 leading-relaxed mb-4">
                                Neuroplasticity isn't just a buzzword. It's the physical process of your brain literally rewiring itself to get better at something. Every time you push your limits on a reflex or memory test, you force your brain to adapt.
                            </p>
                            <p className="text-gray-800 leading-relaxed mb-4">
                                When you grind on Reflextry, this is what's happening under the hood:
                            </p>
                            <ul className="space-y-3 text-gray-800">
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-500 mt-1">•</span>
                                    <span><strong className="text-black">Myelination (The Hardware Upgrade):</strong> Fatty sheaths around your neurons thicken. This acts like insulation on a copper wire, letting electrical signals travel up to 100x faster.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-500 mt-1">•</span>
                                    <span><strong className="text-black">Synaptogenesis (Building Bridges):</strong> Your brain builds completely new connections between neurons to handle the heavy cognitive load more efficiently next time.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-500 mt-1">•</span>
                                    <span><strong className="text-black">Pruning (Clearing the Junk):</strong> Your brain actually deletes inefficient pathways. You stop overthinking *how* to track the target, and your hand just does it.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* How Brain Training Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <Activity className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-black mb-4">The Mechanics of Improvement</h2>
                            <p className="text-gray-800 leading-relaxed mb-4">
                                It's exactly like going to the gym, but for your central nervous system. If you want to drop your reaction time by 20ms, you have to force your brain to process visual information faster.
                            </p>

                            <h3 className="text-xl font-bold text-black mb-3 mt-6">How It Works</h3>
                            <div className="space-y-4 mb-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-teal-500 mb-2">1. The Struggle Phase</h4>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        When you first try a memory or tracking task on Hard mode, you will fail. This failure signals your brain that it needs more resources allocated to visual processing.
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-teal-500 mb-2">2. Myelination</h4>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        As you repeat the task daily, the neural pathways used for that specific task get wrapped in myelin (a fatty layer). This allows electrical signals to travel up to 100x faster. This is why a flick shot becomes "muscle memory".
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-teal-500 mb-2">3. Pruning</h4>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        Your brain cuts out the "noise" and prunes inefficient pathways. You stop thinking about *how* to click the target, and your hand just does it automatically.
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-teal-500 mb-2">4. Baseline Shift</h4>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        Your new "normal" is now permanently faster. You've successfully lowered your biological latency.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Research Evidence */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <BookOpen className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-black mb-4">The Data Behind It</h2>
                            <p className="text-gray-800 leading-relaxed mb-6">
                                We didn't just make this up. These modules are based on decades of cognitive psychology tests and clinical research. Here is the actual data.
                            </p>
                            <div className="space-y-6">
                                <div className="border-l-4 border-teal-500 pl-6">
                                    <h3 className="text-xl font-bold text-black mb-2">The ACTIVE Study (10+ Years of Data)</h3>
                                    <p className="text-gray-800 text-sm leading-relaxed mb-2">
                                        One of the largest cognitive training studies ever done followed nearly 3,000 adults for over a decade.
                                    </p>
                                    <p className="text-teal-500 text-sm font-semibold mb-2">The TL;DR:</p>
                                    <ul className="space-y-2 text-gray-800 text-sm">
                                        <li>• Processing speed training works, and the benefits lasted for up to 10 years.</li>
                                        <li>• People didn't just get better at the game; the skills transferred to real life.</li>
                                        <li>• Speed training even reduced real-world driving crashes by 40%.</li>
                                    </ul>
                                </div>
                                <div className="border-l-4 border-purple-500 pl-6">
                                    <h3 className="text-xl font-bold text-black mb-2">Working Memory Training</h3>
                                    <p className="text-gray-800 text-sm leading-relaxed mb-2">
                                        Countless studies have tested "n-back" tasks (very similar to our sequence memory games) to see if you can actually upgrade your brain's RAM.
                                    </p>
                                    <p className="text-purple-500 text-sm font-semibold mb-2">The TL;DR:</p>
                                    <ul className="space-y-2 text-gray-800 text-sm">
                                        <li>• Yes, working memory capacity is highly trainable.</li>
                                        <li>• Brain scans show increased activity and efficiency in the prefrontal cortex.</li>
                                        <li>• If you stop training, you keep the benefits for months.</li>
                                    </ul>
                                </div>
                                <div className="border-l-4 border-amber-500 pl-6">
                                    <h3 className="text-xl font-bold text-black mb-2">Reaction Time Drops</h3>
                                    <p className="text-gray-800 text-sm leading-relaxed mb-2">
                                        Sports science has been measuring physical reaction times for decades.
                                    </p>
                                    <p className="text-amber-500 text-sm font-semibold mb-2">The TL;DR:</p>
                                    <ul className="space-y-2 text-gray-800 text-sm">
                                        <li>• Reaction time isn't purely genetic; it's heavily trainable at any age.</li>
                                        <li>• Consistent practice typically drops latency by 10-20%.</li>
                                        <li>• The gains transfer directly to FPS gaming, sports, and driving.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Transfer Effects */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <TrendingUp className="w-8 h-8 text-teal-500 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-black mb-4">Understanding Transfer Effects</h2>
                            <p className="text-gray-800 leading-relaxed mb-6">
                                Transfer refers to how improvements from training apply to other tasks. Understanding transfer helps set realistic expectations.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-black mb-3">Direct Upgrades (Near Transfer)</h3>
                                    <p className="text-gray-800 text-sm leading-relaxed mb-3">
                                        This is when training one thing immediately makes you better at something very similar. This is highly reliable.
                                    </p>
                                    <p className="text-teal-500 text-sm font-semibold mb-2">Examples:</p>
                                    <ul className="space-y-2 text-gray-800 text-sm">
                                        <li>• Sequence Memory → Actually remembering strings of numbers</li>
                                        <li>• Reaction Time Test → Quicker trigger finger in shooters</li>
                                        <li>• Typing Practice → Writing essays faster</li>
                                        <li>• Aim Training → Better crosshair placement and tracking</li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-black mb-3">Passive Buffs (Far Transfer)</h3>
                                    <p className="text-gray-800 text-sm leading-relaxed mb-3">
                                        This is when getting better at a specific game secretly upgrades a completely different skill in your life.
                                    </p>
                                    <p className="text-purple-500 text-sm font-semibold mb-2">Examples:</p>
                                    <ul className="space-y-2 text-gray-800 text-sm">
                                        <li>• Working Memory Games → Better focus during boring lectures</li>
                                        <li>• Pure Speed Training → Faster decision-making while driving</li>
                                        <li>• Peripheral Vision Tests → Better situational awareness in sports</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Optimal Training Principles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <Target className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-black mb-4">Principles for Effective Brain Training</h2>
                            <p className="text-gray-800 leading-relaxed mb-6">
                                If you want to actually get faster, don't just mindlessly click targets. Follow these rules:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-teal-500 mb-2">The Struggle is the Point</h4>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        If it's too easy, your brain isn't adapting. You have to push the difficulty until you're failing, then stay there until it clicks. That failure is the signal your brain needs to build new pathways.
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-teal-500 mb-2">Daily Reps Beat Weekend Marathons</h4>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        Playing for 15 minutes a day is massively better than playing for 3 hours once a week. Consistency is what locks in neuroplasticity.
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-teal-500 mb-2">Mix It Up</h4>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        Don't just play the Aim Trainer every single day. Rotate through memory, tracking, and pure speed tasks. Engaging different cognitive load types prevents burnout and plateauing.
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-teal-500 mb-2">Sleep is Everything</h4>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        You don't get faster while you're playing; you get faster while you sleep. Sleep is when your brain actually thickens the myelin sheaths and consolidates what you learned. If you're sleep-deprived, your reaction time will tank.
                                    </p>
                                </div>
                            </div>                               </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Complementary Factors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 mb-8"
                >
                    <h2 className="text-3xl font-bold text-black mb-6">Lifestyle Factors That Enhance Brain Training</h2>
                    <p className="text-gray-800 leading-relaxed mb-6">
                        Brain training is most effective when combined with healthy lifestyle choices that support brain function:
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4">
                            <span className="text-2xl">🏃</span>
                            <div>
                                <h3 className="text-lg font-semibold text-black mb-2">Physical Exercise</h3>
                                <p className="text-gray-800 text-sm leading-relaxed">
                                    Aerobic exercise increases blood flow to the brain, promotes neurogenesis, and enhances BDNF production. Aim for 150 minutes of moderate exercise weekly.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4">
                            <span className="text-2xl">😴</span>
                            <div>
                                <h3 className="text-lg font-semibold text-black mb-2">Quality Sleep</h3>
                                <p className="text-gray-800 text-sm leading-relaxed">
                                    Sleep consolidates memories and clears metabolic waste from the brain. Aim for 7-9 hours of quality sleep per night for optimal cognitive function.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4">
                            <span className="text-2xl">🥗</span>
                            <div>
                                <h3 className="text-lg font-semibold text-black mb-2">Brain-Healthy Nutrition</h3>
                                <p className="text-gray-800 text-sm leading-relaxed">
                                    Omega-3 fatty acids, antioxidants, and B vitamins support brain health. The Mediterranean diet is associated with better cognitive function and lower dementia risk.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4">
                            <span className="text-2xl">👥</span>
                            <div>
                                <h3 className="text-lg font-semibold text-black mb-2">Social Engagement</h3>
                                <p className="text-gray-800 text-sm leading-relaxed">
                                    Social interaction provides cognitive stimulation and emotional support. Staying socially connected helps maintain cognitive abilities and reduces decline risk.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4">
                            <span className="text-2xl">🧘</span>
                            <div>
                                <h3 className="text-lg font-semibold text-black mb-2">Stress Management</h3>
                                <p className="text-gray-800 text-sm leading-relaxed">
                                    Chronic stress damages the hippocampus and impairs memory. Meditation, mindfulness, and relaxation techniques protect brain health and enhance training benefits.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 rounded-2xl p-8 text-center"
                >
                    <Award className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-black mb-4">
                        Put Science Into Practice
                    </h2>
                    <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
                        Now that you understand the science behind brain training, it's time to experience the benefits yourself. Start training today with our evidence-based tools.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/tools"
                            className="px-6 py-3 bg-teal-500 text-black rounded-lg font-semibold hover:bg-amber-500 transition-colors"
                        >
                            Explore All Tools
                        </Link>
                        <Link
                            href="/blog"
                            className="px-6 py-3 bg-gray-100 text-black border border-gray-300 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                        >
                            Read Research Articles
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
