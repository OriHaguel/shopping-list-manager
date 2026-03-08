'use client'

import { useEffect, useRef, useState } from 'react'
import { ClipboardList, PlusCircle, Share2 } from 'lucide-react'
import styles from './HowItWorks.module.scss'

const steps = [
    {
        icon: ClipboardList,
        number: '01',
        title: 'Create a List',
        description:
            'Name your list and choose a category — groceries, household essentials, or a custom type.',
    },
    {
        icon: PlusCircle,
        number: '02',
        title: 'Add Items',
        description:
            'Type or voice-add items. Our AI suggests items based on your shopping history and preferences.',
    },
    {
        icon: Share2,
        number: '03',
        title: 'Share & Shop',
        description:
            'Share with family or friends, check off items in real-time, and never double-buy again.',
    },
]

export function HowItWorks() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.2 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section id="how-it-works" ref={sectionRef} className={styles.section}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.tag}>How It Works</span>
                    <h2 className={styles.title}>
                        Three steps to organized shopping
                    </h2>
                    <p className={styles.description}>
                        Getting started takes less than 30 seconds. No credit card required.
                    </p>
                </div>

                {/* Steps */}
                <div className={styles.stepsGrid}>
                    {/* Connecting line (desktop) */}
                    <div className={styles.connectingLine} />

                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className={styles.step}
                            style={{
                                animation: isVisible
                                    ? `fadeUp 0.6s ease-out forwards`
                                    : 'none',
                                animationDelay: isVisible ? `${index * 0.12}s` : '0s',
                            }}
                        >
                            {/* Step circle */}
                            <div className={styles.stepCircle}>
                                <step.icon className={styles.stepIcon} />
                            </div>

                            {/* Step number */}
                            <span className={styles.stepNumber}>
                                Step {step.number}
                            </span>

                            <h3 className={styles.stepTitle}>
                                {step.title}
                            </h3>
                            <p className={styles.stepDescription}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
