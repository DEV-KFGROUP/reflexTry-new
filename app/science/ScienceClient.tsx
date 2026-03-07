"use client";

import { motion } from "framer-motion";
import { Brain, Zap, TrendingUp, Activity, Sparkles, BookOpen, Target, Award } from "lucide-react";
import Link from "next/link";

export default function ScienceClient() {
    return (
        <div className="bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <Brain className="w-12 h-12 text-neon-teal" />
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
                    <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                        Discover the neuroscience behind cognitive training, how your brain adapts and improves, and the research supporting our training methods.
                    </p>
                </div>

                {/* Neuroplasticity Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <Sparkles className="w-8 h-8 text-neon-yellow flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Neuroplasticity: Your Brain's Superpower</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                Neuroplasticity is your brain's remarkable ability to reorganize itself by forming new neural connections throughout your entire life. Once thought to be limited to childhood, we now know that adult brains remain highly plastic and adaptable.
                            </p>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                When you engage in brain training, several powerful processes occur:
                            </p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-teal mt-1">•</span>
                                    <span><strong className="text-white">Myelination:</strong> Fatty sheaths around neurons thicken, allowing signals to travel up to 100 times faster</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-teal mt-1">•</span>
                                    <span><strong className="text-white">Synaptogenesis:</strong> New connections form between neurons, creating alternative pathways for information processing</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-teal mt-1">•</span>
                                    <span><strong className="text-white">Long-Term Potentiation (LTP):</strong> Repeated activation strengthens synaptic connections, making pathways more efficient</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-teal mt-1">•</span>
                                    <span><strong className="text-white">Neurogenesis:</strong> In certain brain regions, new neurons continue to form throughout life, especially with exercise and learning</span>
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
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <Activity className="w-8 h-8 text-electric-purple flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">How Brain Training Improves Cognitive Function</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                Brain training works through a process similar to physical exercise. Just as lifting weights strengthens muscles, cognitive exercises strengthen neural pathways. Here's the science:
                            </p>

                            <h3 className="text-xl font-bold text-white mb-3 mt-6">The Training Process</h3>
                            <div className="space-y-4 mb-6">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">1. Challenge & Adaptation</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        When you practice a cognitive task, you challenge your brain beyond its current capacity. This challenge triggers adaptive responses, prompting your brain to become more efficient at that task.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">2. Neural Efficiency</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        With repeated practice, your brain learns to process information more efficiently. Tasks that initially required significant mental effort become automatic, freeing cognitive resources for other activities.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">3. Network Optimization</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Your brain optimizes neural networks by strengthening frequently-used connections and pruning rarely-used ones. This creates more efficient information processing pathways.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">4. Cognitive Reserve Building</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Regular training builds cognitive reserve—your brain's resilience against age-related changes and damage. Higher reserve means better ability to maintain function despite brain changes.
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
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <BookOpen className="w-8 h-8 text-neon-yellow flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Research Evidence & Scientific Studies</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Brain training effectiveness is supported by extensive scientific research. Here are key findings from major studies:
                            </p>

                            <div className="space-y-6">
                                <div className="border-l-4 border-neon-teal pl-6">
                                    <h3 className="text-xl font-bold text-white mb-2">ACTIVE Study (2002-2014)</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-2">
                                        The Advanced Cognitive Training for Independent and Vital Elderly study, one of the largest cognitive training studies, followed 2,832 adults for over 10 years.
                                    </p>
                                    <p className="text-neon-teal text-sm font-semibold mb-2">Key Findings:</p>
                                    <ul className="space-y-2 text-gray-300 text-sm">
                                        <li>• Cognitive training produced improvements lasting up to 10 years</li>
                                        <li>• Participants showed better performance in trained abilities</li>
                                        <li>• Benefits transferred to real-world activities requiring those abilities</li>
                                        <li>• Speed training reduced crash risk in older drivers by 40%</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-electric-purple pl-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Working Memory Training Research</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-2">
                                        Multiple studies have examined working memory training, particularly n-back tasks similar to our memory games.
                                    </p>
                                    <p className="text-electric-purple text-sm font-semibold mb-2">Key Findings:</p>
                                    <ul className="space-y-2 text-gray-300 text-sm">
                                        <li>• Working memory capacity can be improved through training</li>
                                        <li>• Improvements persist for months after training ends</li>
                                        <li>• Benefits transfer to tasks requiring working memory</li>
                                        <li>• Training increases activity in prefrontal cortex regions</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-neon-yellow pl-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Reaction Time & Processing Speed</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-2">
                                        Research in sports science and cognitive psychology has extensively studied reaction time training.
                                    </p>
                                    <p className="text-neon-yellow text-sm font-semibold mb-2">Key Findings:</p>
                                    <ul className="space-y-2 text-gray-300 text-sm">
                                        <li>• Reaction time is trainable at any age</li>
                                        <li>• Improvements of 10-20% are common with consistent practice</li>
                                        <li>• Benefits transfer to sports, gaming, and driving performance</li>
                                        <li>• Training improves both neural processing and motor execution</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-red-400 pl-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Cognitive Reserve & Aging</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-2">
                                        Research on cognitive reserve shows how mental stimulation protects against cognitive decline.
                                    </p>
                                    <p className="text-red-400 text-sm font-semibold mb-2">Key Findings:</p>
                                    <ul className="space-y-2 text-gray-300 text-sm">
                                        <li>• Higher cognitive reserve delays onset of dementia symptoms</li>
                                        <li>• Lifelong learning and mental stimulation build reserve</li>
                                        <li>• Cognitive training contributes to reserve building</li>
                                        <li>• Combined with exercise and social engagement, effects are stronger</li>
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
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <TrendingUp className="w-8 h-8 text-neon-teal flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Understanding Transfer Effects</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Transfer refers to how improvements from training apply to other tasks. Understanding transfer helps set realistic expectations.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-neon-teal/20 to-neon-teal/5 border border-neon-teal/30 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-3">Near Transfer</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                        Improvements in tasks similar to those trained. Near transfer is well-documented and reliable.
                                    </p>
                                    <p className="text-neon-teal text-sm font-semibold mb-2">Examples:</p>
                                    <ul className="space-y-2 text-gray-300 text-sm">
                                        <li>• Memory training → Better recall in daily life</li>
                                        <li>• Reaction training → Faster gaming responses</li>
                                        <li>• Typing practice → Improved typing speed</li>
                                        <li>• Aim training → Better FPS performance</li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-electric-purple/20 to-electric-purple/5 border border-electric-purple/30 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-3">Far Transfer</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                        Improvements in abilities different from those trained. Far transfer is more limited but can occur.
                                    </p>
                                    <p className="text-electric-purple text-sm font-semibold mb-2">Examples:</p>
                                    <ul className="space-y-2 text-gray-300 text-sm">
                                        <li>• Working memory training → Better focus</li>
                                        <li>• Processing speed training → Improved driving</li>
                                        <li>• Attention training → Enhanced productivity</li>
                                        <li>• Executive function training → Better planning</li>
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
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <Target className="w-8 h-8 text-electric-purple flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Principles for Effective Brain Training</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Based on neuroscience research, these principles maximize training effectiveness:
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">Progressive Challenge</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Training must be challenging but achievable. Too easy provides minimal benefit; too hard causes frustration. Gradually increase difficulty as you improve.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">Consistent Practice</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Regular practice (daily or near-daily) produces better results than sporadic intensive sessions. Consistency maintains neural plasticity and ensures continuous adaptation.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">Immediate Feedback</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Knowing your performance immediately helps your brain adjust and improve. Our tools provide instant feedback on every attempt.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">Variety & Novelty</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Engaging with diverse cognitive activities prevents over-specialization and builds broader cognitive abilities. Rotate through different tools.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">Motivation & Engagement</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Enjoyment and motivation enhance learning. Choose tools that interest you and set personal goals to maintain engagement.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="text-lg font-semibold text-neon-teal mb-2">Adequate Rest</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Sleep consolidates learning and allows neural adaptation. Quality sleep is essential for maximizing training benefits.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Complementary Factors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                >
                    <h2 className="text-3xl font-bold text-white mb-6">Lifestyle Factors That Enhance Brain Training</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Brain training is most effective when combined with healthy lifestyle choices that support brain function:
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                            <span className="text-2xl">🏃</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Physical Exercise</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Aerobic exercise increases blood flow to the brain, promotes neurogenesis, and enhances BDNF production. Aim for 150 minutes of moderate exercise weekly.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                            <span className="text-2xl">😴</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Quality Sleep</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Sleep consolidates memories and clears metabolic waste from the brain. Aim for 7-9 hours of quality sleep per night for optimal cognitive function.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                            <span className="text-2xl">🥗</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Brain-Healthy Nutrition</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Omega-3 fatty acids, antioxidants, and B vitamins support brain health. The Mediterranean diet is associated with better cognitive function and lower dementia risk.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                            <span className="text-2xl">👥</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Social Engagement</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Social interaction provides cognitive stimulation and emotional support. Staying socially connected helps maintain cognitive abilities and reduces decline risk.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                            <span className="text-2xl">🧘</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Stress Management</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
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
                    className="bg-gradient-to-r from-neon-teal/20 to-electric-purple/20 border border-neon-teal/30 rounded-2xl p-8 text-center"
                >
                    <Award className="w-12 h-12 text-neon-teal mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Put Science Into Practice
                    </h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Now that you understand the science behind brain training, it's time to experience the benefits yourself. Start training today with our evidence-based tools.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/tools"
                            className="px-6 py-3 bg-neon-teal text-black rounded-lg font-semibold hover:bg-neon-yellow transition-colors"
                        >
                            Explore All Tools
                        </Link>
                        <Link
                            href="/blog"
                            className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                        >
                            Read Research Articles
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
