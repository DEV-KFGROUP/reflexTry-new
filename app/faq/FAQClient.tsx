"use client";

import { motion } from "framer-motion";
import { HelpCircle, Brain, Zap, Target, TrendingUp, Clock, Award } from "lucide-react";
import Link from "next/link";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        category: "Getting Started",
        question: "What is Reflextry and how does it work?",
        answer: "Reflextry is a comprehensive brain training platform offering free tools to improve memory, reaction time, speed, accuracy, and gaming performance. Our tools are based on neuroscience research and provide immediate feedback to help you track and improve your cognitive abilities. Simply choose a tool, start training, and watch your skills improve over time."
    },
    {
        category: "Getting Started",
        question: "Do I need to create an account to use Reflextry?",
        answer: "No! All our tools are completely free and accessible without registration. You can start training immediately. However, creating an account (coming soon) will allow you to save your progress, track improvements over time, and compete on leaderboards."
    },
    {
        category: "Getting Started",
        question: "Which tool should I start with?",
        answer: "Start with tools that match your goals. If you want to improve memory, try our Sequence Memory or Number Memory games. For gaming performance, start with the Reaction Time Test or Aim Trainer. For general cognitive improvement, try a variety of tools to build comprehensive abilities. We recommend starting with 2-3 tools and practicing 10-15 minutes daily."
    },
    {
        category: "Brain Training",
        question: "Does brain training actually work?",
        answer: "Yes! Scientific research shows that targeted brain training can improve specific cognitive abilities. While 'far transfer' (improvements in unrelated skills) is debated, 'near transfer' (improvements in similar skills) is well-documented. Regular practice with our tools can improve memory, reaction time, processing speed, and other trained abilities. The key is consistent practice over weeks and months."
    },
    {
        category: "Brain Training",
        question: "How long does it take to see improvements?",
        answer: "Most people see measurable improvements within 2-4 weeks of consistent daily practice (10-20 minutes). However, significant improvements typically require 6-8 weeks or more. Remember that cognitive improvement is gradual—consistency is more important than intensity. Track your scores to see progress over time."
    },
    {
        category: "Brain Training",
        question: "How often should I practice?",
        answer: "We recommend daily practice for 15-30 minutes. Consistent daily practice produces better results than occasional long sessions. Your brain benefits from regular stimulation and practice. If you can't practice daily, aim for at least 4-5 times per week. Quality and consistency matter more than duration."
    },
    {
        category: "Brain Training",
        question: "Can brain training prevent cognitive decline?",
        answer: "Brain training can help build cognitive reserve, which may protect against age-related cognitive decline. Research shows that regular cognitive stimulation, combined with physical exercise, quality sleep, and healthy lifestyle choices, supports brain health throughout life. While brain training isn't a guarantee against decline, it's a valuable tool for maintaining cognitive function."
    },
    {
        category: "Memory Training",
        question: "How can I improve my memory quickly?",
        answer: "While there's no instant solution, the fastest improvements come from: 1) Using spaced repetition (reviewing information at increasing intervals), 2) Creating vivid mental images and associations, 3) Chunking information into meaningful groups, 4) Practicing active recall (testing yourself), and 5) Getting adequate sleep for memory consolidation. Our memory games help you practice these techniques."
    },
    {
        category: "Memory Training",
        question: "What's the difference between working memory and long-term memory?",
        answer: "Working memory is your brain's temporary workspace—it holds information briefly (seconds to minutes) while you use it. Long-term memory stores information permanently. Working memory is like your mental desktop, while long-term memory is like your hard drive. Our memory games primarily train working memory, which supports learning, problem-solving, and daily functioning."
    },
    {
        category: "Memory Training",
        question: "Why do I forget things I just learned?",
        answer: "Forgetting is natural and occurs when information isn't properly encoded or consolidated. Common reasons include: lack of attention during encoding, insufficient repetition, poor sleep (which impairs consolidation), stress, or trying to learn too much at once. To improve retention: focus fully when learning, use spaced repetition, get quality sleep, and practice active recall."
    },
    {
        category: "Reaction Time",
        question: "What's a good reaction time?",
        answer: "Average visual reaction time is 200-250 milliseconds. Under 200ms is considered good, under 180ms is excellent, and under 150ms is exceptional. Auditory reactions are faster, averaging 150-200ms. Remember that reaction time varies by age, fatigue, and practice. With training, most people can improve their reaction time by 10-20%."
    },
    {
        category: "Reaction Time",
        question: "Can I improve my reaction time?",
        answer: "Absolutely! Reaction time is trainable through consistent practice. Improvements come from: 1) More efficient neural processing, 2) Better anticipation and pattern recognition, 3) Optimized motor responses, and 4) Improved focus and attention. Regular practice with our reaction tests can produce measurable improvements within 2-4 weeks."
    },
    {
        category: "Reaction Time",
        question: "Why is my reaction time slower sometimes?",
        answer: "Reaction time varies based on several factors: fatigue (especially sleep deprivation), time of day (most people are faster in late morning/early afternoon), stress, distractions, caffeine intake, and physical fitness. For consistent measurements, test at the same time daily when you're well-rested and focused."
    },
    {
        category: "Gaming Performance",
        question: "Will these tools improve my gaming performance?",
        answer: "Yes! Our gaming tools directly train skills essential for competitive gaming: aim precision, reaction time, decision-making speed, and hand-eye coordination. Many professional gamers use similar tools for warm-ups and training. Regular practice can improve your in-game performance, especially in FPS, MOBA, and action games. Use the Aim Trainer and Reaction Time Test as part of your daily gaming routine."
    },
    {
        category: "Gaming Performance",
        question: "How should gamers use these tools?",
        answer: "We recommend: 1) Use the Aim Trainer and Grid Shot for 10-15 minutes before gaming sessions as a warm-up, 2) Practice reaction tests daily to improve response speed, 3) Use the Click Speed Test to improve clicking techniques, 4) Track your scores to monitor improvement. Consistency is key—daily practice produces the best results."
    },
    {
        category: "Gaming Performance",
        question: "What's the best clicking technique for gaming?",
        answer: "The best technique depends on your needs. Regular clicking works for most situations. Jitter clicking (vibrating your finger) can achieve higher CPS but may reduce accuracy. Butterfly clicking (alternating two fingers) provides high speed with better control. Practice different techniques with our Click Speed Test to find what works best for you."
    },
    {
        category: "Progress & Results",
        question: "How do I track my progress?",
        answer: "Currently, you can manually track your scores after each session. We recommend keeping a simple log of your best scores for each tool. Note the date, tool name, and your score. Review your progress weekly to see improvements. We're working on automatic progress tracking features that will be available soon."
    },
    {
        category: "Progress & Results",
        question: "I'm not improving anymore. What should I do?",
        answer: "Plateaus are normal in skill development. To break through: 1) Increase difficulty or try more challenging tools, 2) Take a short break (2-3 days) to avoid overtraining, 3) Vary your training with different tools, 4) Ensure you're getting adequate sleep and managing stress, 5) Review your technique and focus on quality over speed. Plateaus are often followed by sudden improvements."
    },
    {
        category: "Progress & Results",
        question: "Can I compare my scores with others?",
        answer: "Our leaderboard feature allows you to see how your scores compare with other users. This provides motivation and helps you understand where you stand. Remember that everyone starts at different levels—focus on your personal improvement rather than comparing yourself to top performers."
    },
    {
        category: "Technical",
        question: "What devices and browsers are supported?",
        answer: "Reflextry works on all modern devices: desktop computers, laptops, tablets, and smartphones. We support all major browsers: Chrome, Firefox, Safari, Edge, and Opera. For the best experience, we recommend using a desktop or laptop with a mouse for precision tools like the Aim Trainer."
    },
    {
        category: "Technical",
        question: "Why is my reaction time test showing inconsistent results?",
        answer: "Inconsistent results can be caused by: 1) Input lag from your device or display, 2) Wireless mouse lag (use wired for best accuracy), 3) Browser performance issues (close other tabs), 4) Varying focus and attention, or 5) Physical fatigue. For most accurate results, use a wired mouse, close unnecessary programs, and test when you're well-rested."
    },
    {
        category: "Technical",
        question: "Are the tools mobile-friendly?",
        answer: "Yes! All our tools work on mobile devices. However, some tools (like the Aim Trainer and Click Speed Test) are optimized for desktop use with a mouse. Memory games, reaction tests, and typing tests work well on mobile. Choose tools that match your device for the best experience."
    },
    {
        category: "Science & Research",
        question: "What's the science behind brain training?",
        answer: "Brain training leverages neuroplasticity—your brain's ability to reorganize and form new neural connections throughout life. When you practice cognitive tasks, you strengthen neural pathways through a process called long-term potentiation. Regular practice increases neural efficiency, creates alternative processing pathways, and builds cognitive reserve. Research shows that targeted training can produce measurable improvements in trained abilities."
    },
    {
        category: "Science & Research",
        question: "Is there research supporting these tools?",
        answer: "Yes! Our tools are based on established cognitive training paradigms used in research. For example, n-back training (similar to our memory games) has been extensively studied for working memory improvement. Reaction time training is well-documented in sports science and cognitive psychology. While individual tools may vary, the underlying principles are supported by scientific research."
    },
    {
        category: "Science & Research",
        question: "What is cognitive reserve?",
        answer: "Cognitive reserve is your brain's resilience against age-related changes and damage. Higher cognitive reserve allows your brain to maintain function despite physical changes. It's built through: education, complex work, social engagement, physical exercise, and cognitive training. Think of it as your brain's backup systems—more reserve means better ability to compensate when primary systems decline."
    },
    {
        category: "General",
        question: "Is Reflextry really free?",
        answer: "Yes! All our core tools are completely free with no hidden costs. We believe cognitive training should be accessible to everyone. We may introduce optional premium features in the future, but our core training tools will always remain free."
    },
    {
        category: "General",
        question: "How is Reflextry different from other brain training apps?",
        answer: "Reflextry offers: 1) Completely free access to all tools, 2) No registration required to start training, 3) Focus on practical skills (gaming, typing, memory) rather than just abstract games, 4) Modern, engaging interface, 5) Tools based on scientific research, and 6) Immediate feedback and progress tracking. We prioritize accessibility and real-world application."
    },
    {
        category: "General",
        question: "Can children use Reflextry?",
        answer: "Yes! Our tools are suitable for ages 10 and up. Children can benefit from memory games, typing practice, and basic reaction tests. However, parental supervision is recommended for younger users. Some tools (like competitive gaming tools) are more appropriate for teenagers and adults."
    },
    {
        category: "General",
        question: "How can I contact support or provide feedback?",
        answer: "We'd love to hear from you! Visit our Contact page to send us feedback, report issues, or ask questions. We read all messages and use your feedback to improve Reflextry. You can also follow us on social media for updates and tips."
    }
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQClient() {
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
                        <HelpCircle className="w-12 h-12 text-teal-500" />
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
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Find answers to common questions about brain training, our tools, and how to get the most out of Reflextry.
                    </p>
                </div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12"
                >
                    <h2 className="text-xl font-bold text-black mb-4">Jump to Category</h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <a
                                key={category}
                                href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                                className="px-4 py-2 bg-white/10 hover:bg-teal-500/20 border border-white/20 hover:border-teal-500/50 rounded-lg text-sm text-gray-300 hover:text-teal-500 transition"
                            >
                                {category}
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ Categories */}
                {categories.map((category, categoryIndex) => (
                    <motion.div
                        key={category}
                        id={category.toLowerCase().replace(/\s+/g, '-')}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: categoryIndex * 0.1 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-gradient-to-b from-teal-500 to-purple-500 rounded-full"></span>
                            {category}
                        </h2>
                        <div className="space-y-4">
                            {faqs
                                .filter(faq => faq.category === category)
                                .map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-teal-500/30 transition"
                                    >
                                        <h3 className="text-lg font-semibold text-black mb-3 flex items-start gap-3">
                                            <span className="text-teal-500 mt-1 flex-shrink-0">Q:</span>
                                            <span>{faq.question}</span>
                                        </h3>
                                        <div className="flex items-start gap-3 ml-8">
                                            <span className="text-purple-500 mt-1 flex-shrink-0 font-semibold">A:</span>
                                            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </motion.div>
                ))}

                {/* Still Have Questions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 rounded-2xl p-8 text-center"
                >
                    <HelpCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-black mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Can't find the answer you're looking for? We're here to help! Contact us and we'll get back to you as soon as possible.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="px-6 py-3 bg-teal-500 text-black rounded-lg font-semibold hover:bg-amber-500 transition-colors"
                        >
                            Contact Support
                        </Link>
                        <Link
                            href="/blog"
                            className="px-6 py-3 bg-white/10 text-black border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                        >
                            Read Our Blog
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
