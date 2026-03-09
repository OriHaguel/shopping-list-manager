'use client'

import { useEffect, useRef, useState } from 'react'
import {
    LayoutGrid,
    Users,
    Gift,
    Smartphone,
    Tags,
    ShieldCheck,
} from 'lucide-react'
import styles from './FeaturesGrid.module.scss'
import { getMessages } from '@/lib/getMessages'
import { getItem } from '@/utils/localStorage'

export function FeaturesGrid() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)
    const messages = getMessages()
    const lan = getItem<string>('lan', '');
    const features = [
        {
            icon: LayoutGrid,
            title: messages.smartCategorization,
            description: messages.itemsAutomaticallySorted,
        },
        {
            icon: Users,
            title: messages.sharedLists,
            description: messages.collaborateInRealTime,
        },
        {
            icon: Gift,
            title: messages.smartReminders,
            description: messages.gentleNudgesWhenNear,
        },
        {
            icon: Smartphone,
            title: messages.worksEverywhere,
            description: messages.accessYourLists,
        },
        {
            icon: Tags,
            title: messages.priceTracking,
            description: messages.keepAnEyeOnSpending,
        },
        {
            icon: ShieldCheck,
            title: messages.privateAndSecure,
            description: messages.dataIsEncrypted,
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
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section id="features" ref={sectionRef} className={styles.section} dir={lan === 'he-IL' ? 'rtl' : 'ltr'}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.tag}>{messages.features}</span>
                    <h2 className={styles.title}>
                        {messages.everythingYouNeedForSmarterShopping}
                    </h2>
                    <p className={styles.description}>
                        {messages.fromSmartCategorizationToRealTimeCollaboration}
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className={styles.card}
                            style={{
                                animation: isVisible
                                    ? `fadeUp 0.6s ease-out forwards`
                                    : 'none',
                                animationDelay: isVisible ? `${index * 0.06}s` : '0s',
                            }}
                        >
                            <div className={styles.iconWrapper}>
                                <feature.icon className={styles.icon} />
                            </div>
                            <h3 className={styles.cardTitle}>
                                {feature.title}
                            </h3>
                            <p className={styles.cardDescription}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
