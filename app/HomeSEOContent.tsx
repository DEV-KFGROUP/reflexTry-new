import { Activity } from "lucide-react";

export function HomeSEOContent() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="space-y-12 bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-8 rounded-3xl">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-foreground">Why Test Your Reflexes and Memory?</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        It&apos;s simple: you can&apos;t improve what you don&apos;t measure. Brain training and reflex testing give you hard data on your physical and cognitive speed. When you grind these tasks, you&apos;re literally forcing your brain to adapt and build new neural pathways (neuroplasticity). Faster processing, sharper focus, and quicker physical reactions.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">How to Actually Improve</h2>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li><strong>Warm up:</strong> Don&apos;t jump straight into Expert modes. Start with a basic Click Speed or Color Match test to get your hands warm.</li>
                        <li><strong>Accuracy over speed:</strong> Speed is a byproduct of precision. If you&apos;re missing targets, slow down.</li>
                        <li><strong>Consistency is everything:</strong> A 15-minute daily routine beats a 3-hour weekend marathon every single time.</li>
                        <li><strong>Track the data:</strong> Check your Statistics page. Find out if your reaction time is dragging or if your memory is bottlenecking you.</li>
                    </ol>
                </div>

                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Do I Need to Grind Every Day?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Yes. If you want to see real changes in your fast-twitch muscle response or memory recall, you need daily reps. Your brain consolidates these skills while you sleep, so frequent, short bursts of intense focus (like 15 minutes a day) are the secret to actually getting faster.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Arena Comparison &amp; Use Cases</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-black/10 dark:border-white/10">
                                    <th className="p-3 text-foreground font-bold">Arena Name</th>
                                    <th className="p-3 text-foreground font-bold">Best For (Use Case)</th>
                                    <th className="p-3 text-foreground font-bold">Core Benefit</th>
                                </tr>
                            </thead>
                            <tbody className="text-muted-foreground">
                                <tr className="border-b border-black/5 dark:border-white/5">
                                    <td className="p-3 font-semibold text-blue-500">Memory Arena</td>
                                    <td className="p-3">Students, lifelong learners</td>
                                    <td className="p-3">Enhances working memory &amp; recall capacity.</td>
                                </tr>
                                <tr className="border-b border-black/5 dark:border-white/5">
                                    <td className="p-3 font-semibold text-amber-500">Reflex Arena</td>
                                    <td className="p-3">FPS Gamers, Drivers, Athletes</td>
                                    <td className="p-3">Decreases reaction time to sudden stimuli.</td>
                                </tr>
                                <tr className="border-b border-black/5 dark:border-white/5">
                                    <td className="p-3 font-semibold text-orange-500">Speed Arena</td>
                                    <td className="p-3">Typists, Data Entry, MOBA Gamers</td>
                                    <td className="p-3">Increases raw physical speed (CPS, WPM).</td>
                                </tr>
                                <tr className="border-b border-black/5 dark:border-white/5">
                                    <td className="p-3 font-semibold text-purple-500">Gaming Arena</td>
                                    <td className="p-3">Competitive eSports Players</td>
                                    <td className="p-3">Improves mouse tracking, flick accuracy, and multi-tasking.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">The Data Behind the Grind</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Most people have a visual reaction time of around 250 milliseconds. But if you watch elite esports pros, they&apos;re consistently hitting the 150ms to 180ms range. It&apos;s not just genetics; the <a href="https://pubmed.ncbi.nlm.nih.gov/24718593/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">National Institutes of Health (NIH)</a> confirms that heavy repetition in motor skill and cognitive training straight-up drops your reaction times and expands your working memory.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        Whether you&apos;re using the <strong>Sequence Memory Test</strong> to lock in spatial awareness or the <strong>Aim Trainer</strong> to fix your input lag, tracking your stats is step one. Our tools are completely free, run entirely in your browser for maximum privacy, and don&apos;t force you to make an account just to test yourself.
                    </p>
                </div>

                {/* Comprehensive SEO FAQ for the homepage */}
                <div className="space-y-6 pt-8 border-t border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-green-500" />
                        <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-foreground mb-3">Does this actually work?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Yeah, it does. Pushing your limits on memory or reaction tasks forces your brain to adapt—a process called neuroplasticity. If you consistently test yourself, your brain literally wires itself to process that specific information faster. It&apos;s exactly like lifting weights, but for your central nervous system.
                            </p>
                        </div>
                        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-foreground mb-3">How often should I be testing?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Keep it short but daily. 10 to 15 minutes of highly focused training is the sweet spot. If you play for three hours straight, fatigue sets in and you stop learning. Hit the Memory arena to stretch your brain, run the Speed arena to wake up your hands, and then get on with your day.
                            </p>
                        </div>
                        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-foreground mb-3">Is this good for esports warmups?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                100%. A massive chunk of our users are competitive players using the Aim Trainer, Grid Click, and Flick Shot tools to wake up their fast-twitch muscles before queuing ranked. Knowing your millisecond latency before you play tells you if you&apos;re peaking or if you&apos;re too tired to perform.
                            </p>
                        </div>
                        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-foreground mb-3">Is Reflextry free?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Yes. The core reaction time tests, memory tools, and aim trainers are completely free and run right in your browser. We built this because we were tired of paywalls blocking basic performance benchmarks.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional long-form content for AdSense crawlers */}
                <div className="space-y-6 pt-8 border-t border-black/10 dark:border-white/10">
                    <h2 className="text-2xl font-bold text-foreground">Understanding Cognitive Performance Metrics</h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Cognitive performance is not a single number — it is a composite of multiple interacting systems. <strong>Reaction time</strong> measures how quickly your sensory organs detect a stimulus, how fast your brain processes it, and how rapidly your motor system executes a response. The average visual reaction time for humans sits between 200–250 milliseconds, but trained individuals routinely break below 180ms through deliberate practice.
                        </p>
                        <p>
                            <strong>Working memory capacity</strong> determines how many items you can hold in conscious awareness simultaneously. Most adults can maintain 5–9 chunks of information, a limit first described by cognitive psychologist George Miller in his landmark 1956 paper. Games like the Chimp Test and Sequence Memory directly target this capacity by forcing rapid encoding and recall of spatial patterns.
                        </p>
                        <p>
                            <strong>Processing speed</strong> — measured by tasks like typing tests, mental math, and click-speed benchmarks — reflects the efficiency of neural transmission. Myelination, the process by which nerve fibers develop insulating sheaths, directly increases signal speed. Consistent cognitive challenge promotes myelination in task-relevant pathways, which is why daily 10–15 minute practice sessions yield measurable improvement within 2–4 weeks.
                        </p>
                        <p>
                            <strong>Attentional control</strong> is your ability to focus on relevant information while suppressing distractors. Tests like the Multi-Stimulus Reaction and Stroop Drop challenge your executive attention network — the prefrontal cortex&apos;s ability to resolve conflicting signals. Strengthening this network has real-world benefits: better driving safety, improved classroom focus, and faster decision-making under pressure.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mt-8">Who Uses Reflextry?</h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            <strong>Competitive gamers</strong> use our Aim Trainer, Flick Shot, and Reaction Time tools as part of their pre-match warm-up routines. Professional esports teams track reaction time baselines to detect fatigue and optimize practice schedules.
                        </p>
                        <p>
                            <strong>Students and learners</strong> use the Memory Arena to strengthen working memory before exams. Research published in the <em>Journal of Cognitive Enhancement</em> shows that targeted memory training can improve standardized test performance by reinforcing encoding and retrieval pathways.
                        </p>
                        <p>
                            <strong>Healthcare professionals and researchers</strong> reference our tools as accessible cognitive screening instruments. While not a substitute for clinical neuropsychological assessment, our standardized tests provide useful baseline measurements that can be tracked over time.
                        </p>
                        <p>
                            <strong>Athletes and coaches</strong> use reaction time and peripheral vision tests to benchmark sensory-motor performance. Sports like table tennis, boxing, and motorsport demand sub-200ms reaction times, and our tools provide a free, browser-based way to track these metrics without specialized hardware.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
