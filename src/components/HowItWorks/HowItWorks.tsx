'use client'

import { useEffect, useRef, useState } from 'react'
import { ClipboardList, PlusCircle, Share2 } from 'lucide-react'
import styles from './HowItWorks.module.scss'
import { getMessages } from '@/lib/getMessages'

export function HowItWorks() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)
    const messages = getMessages()

    const steps = [
        {
            icon: ClipboardList,
            number: '01',
            title: messages.createAList,
            description: messages.nameYourListAndChooseCategory,
        },
        {
            icon: PlusCircle,
            number: '02',
            title: messages.addItems,
            description: messages.typeOrVoiceAddItems,
        },
        {
            icon: Share2,
            number: '03',
            title: messages.shareAndShop,
            description: messages.shareWithFamilyAndFriends,
        },
    ]

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
                    <span className={styles.tag}>{messages.howItWorks}</span>
                    <h2 className={styles.title}>
                        {messages.threeStepsToOrganizedShopping}
                    </h2>
                    <p className={styles.description}>
                        {messages.noCredCardRequired}
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
