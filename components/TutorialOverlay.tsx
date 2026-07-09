"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./ui/Button";

interface TutorialStep {
    title: string;
    content: string;
    target?: string; // CSS selector for highlighting
}

interface TutorialOverlayProps {
    steps: TutorialStep[];
    onComplete: () => void;
    storageKey: string;
}

export function TutorialOverlay({ steps, onComplete, storageKey }: TutorialOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        
        const hasSeenTutorial = localStorage.getItem(`tutorial_${storageKey}`);
        if (!hasSeenTutorial) {
            setIsVisible(true);
        }
    }, [storageKey]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        if (typeof window !== "undefined") {
            localStorage.setItem(`tutorial_${storageKey}`, "true");
        }
        setIsVisible(false);
        onComplete();
    };

    const handleSkip = () => {
        handleComplete();
    };

    if (!isVisible || steps.length === 0) return null;

    const step = steps[currentStep];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            >
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-background border-2 border-teal-500/40 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-theme-primary mb-2">{step.title}</h3>
                                <p className="text-sm text-theme-secondary">
                                    Step {currentStep + 1} of {steps.length}
                                </p>
                            </div>
                            <button
                                onClick={handleSkip}
                                className="text-theme-secondary hover:text-theme-primary transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-theme-secondary mb-8 leading-relaxed">{step.content}</p>

                        <div className="flex items-center justify-between gap-4">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            <div className="flex gap-2">
                                {steps.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full ${
                                            index === currentStep
                                                ? "bg-teal-500"
                                                : "bg-gray-600"
                                        }`}
                                    />
                                ))}
                            </div>

                            <Button onClick={handleNext}>
                                {currentStep === steps.length - 1 ? "Got it!" : "Next"}
                                {currentStep < steps.length - 1 && (
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

