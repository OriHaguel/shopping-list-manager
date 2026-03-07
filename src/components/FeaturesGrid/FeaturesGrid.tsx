'use client'

import { useEffect, useRef, useState } from 'react'
import {
    LayoutGrid,
    Users,
    Bell,
    Smartphone,
    Tags,
    ShieldCheck,
} from 'lucide-react'
import styles from './FeaturesGrid.module.scss'

const features = [
    {
        icon: LayoutGrid,
        title: 'Smart Categorization',
        description:
            'Items are automatically sorted into categories like produce, dairy, and pantry — no manual organization needed.',
    },
    {
        icon: Users,
        title: 'Shared Lists',
        description:
            'Invite family members or roommates to collaborate on lists in real-time. See updates instantly.',
    },
    {
        icon: Bell,
        title: 'Smart Reminders',
        description:
            'Get gentle nudges when you\'re near a store or when it\'s time to restock your essentials.',
    },
    {
        icon: Smartphone,
        title: 'Works Everywhere',
        description:
            'Access your lists on any device — phone, tablet, or desktop. Everything syncs seamlessly.',
    },
    {
        icon: Tags,
        title: 'Price Tracking',
        description:
            'Keep an eye on your spending with built-in price estimates and budget tracking per list.',
    },
    {
        icon: ShieldCheck,
        title: 'Private & Secure',
        description:
            'Your data is encrypted and never shared. We believe your shopping list is nobody else\'s business.',
    },
]

export function FeaturesGrid() {
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
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section id="features" ref={sectionRef} className={styles.section}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.tag}>Features</span>
                    <h2 className={styles.title}>
                        Everything you need for smarter shopping
                    </h2>
                    <p className={styles.description}>
                        From smart categorization to real-time collaboration, ListFlow makes
                        managing your shopping effortless.
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
