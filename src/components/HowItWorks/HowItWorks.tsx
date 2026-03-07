"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardList, PlusCircle, Share2 } from "lucide-react";

const steps = [
    {
        icon: ClipboardList,
        number: "01",
        title: "Create a List",
        description:
            "Name your list and choose a category — groceries, household essentials, or a custom type.",
    },
    {
        icon: PlusCircle,
        number: "02",
        title: "Add Items",
        description:
            "Type or voice-add items. Our AI suggests items based on your shopping history and preferences.",
    },
    {
        icon: Share2,
        number: "03",
        title: "Share & Shop",
        description:
            "Share with family or friends, check off items in real-time, and never double-buy again.",
    },
];

export default function HowItWorks() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="how-it-works"
            ref={sectionRef}
            className="py-20 sm:py-28 bg-white"
        >
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-[600px] mx-auto mb-16">
                    <span className="inline-block font-body text-sm font-semibold text-coral uppercase tracking-wider mb-3">
                        How It Works
                    </span>
                    <h2 className="font-display text-[32px] sm:text-[36px] font-bold text-neutral-text leading-tight mb-4">
                        Three steps to organized shopping
                    </h2>
                    <p className="font-body text-base sm:text-lg text-neutral-dark-gray leading-relaxed">
                        Getting started takes less than 30 seconds. No credit card required.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid sm:grid-cols-3 gap-8 relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden sm:block absolute top-[52px] left-[16.67%] right-[16.67%] h-[2px] bg-gradient-to-r from-blue-light via-blue to-blue-light" />

                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className={`relative flex flex-col items-center text-center ${isVisible ? "animate-fade-up" : "opacity-0"
                                }`}
                            style={{
                                animationDelay: isVisible ? `${index * 0.12}s` : "0s",
                                animationFillMode: "forwards",
                            }}
                        >
                            {/* Step circle */}
                            <div className="relative z-10 w-[104px] h-[104px] rounded-full bg-blue-light flex items-center justify-center mb-6 border-4 border-white shadow-base">
                                <step.icon className="w-10 h-10 text-blue" />
                            </div>

                            {/* Step number */}
                            <span className="font-body text-xs font-bold text-coral uppercase tracking-widest mb-2">
                                Step {step.number}
                            </span>

                            <h3 className="font-display text-xl font-semibold text-neutral-text mb-3">
                                {step.title}
                            </h3>
                            <p className="font-body text-sm text-neutral-dark-gray leading-relaxed max-w-[300px]">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
