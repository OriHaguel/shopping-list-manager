'use client'

import { ArrowRight } from 'lucide-react'
import styles from './HeroSection.module.scss'
import { useRouter } from 'next/navigation'
import { getMessages } from '@/lib/getMessages'
import { getItem } from '@/utils/localStorage'

export function HeroSection() {
    const router = useRouter()
    const messages = getMessages()
    const lan = getItem<string>('lan', '');
    const handleListClick = () => {
        router.push(`/auth`)
    }

    return (
        <section className={styles.section} dir={lan === 'he-IL' ? 'rtl' : 'ltr'}>
            {/* Background gradient */}
            <div className={styles.backgroundGradient} />

            {/* Subtle decorative circles */}
            <div className={styles.decorativeCircleLeft} />
            <div className={styles.decorativeCircleRight} />

            <div className={styles.contentWrapper}>
                <div className={styles.gridContainer}>
                    {/* Left Column - Text */}
                    <div className={styles.leftColumn}>
                        <h1 className={styles.heading}>
                            {messages.shoppingListsSimplified.split(',')[0]},{'  '}
                            <span className={styles.headingAccent}>{messages.simplified}</span>
                        </h1>

                        <p className={styles.description}>
                            {messages.heroDescription}
                        </p>

                        <div className={styles.ctaContainer}>
                            <button className={styles.ctaButton} onClick={handleListClick}>
                                {messages.startForFree}
                                <ArrowRight />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - App Mockup */}
                    <div className={styles.rightColumn}>
                        <div className={styles.mockupContainer}>
                            {/* Mockup Header */}
                            <div className={styles.mockupHeader}>
                                <div className={styles.mockupHeaderInfo}>
                                    <h3 className={styles.mockupTitle}>
                                        {messages.weeklyGroceries}
                                    </h3>
                                    <p className={styles.mockupSubtitle}>
                                        12 {messages.itemsShared} Sarah
                                    </p>
                                </div>
                                <div className={styles.progressBadge}>
                                    3/12
                                </div>
                            </div>

                            {/* List Items */}
                            <div className={styles.itemsList}>
                                {[
                                    { name: 'Organic Avocados', cat: messages.produce, checked: true },
                                    { name: 'Sourdough Bread', cat: messages.bakery, checked: true },
                                    { name: 'Greek Yogurt', cat: messages.dairy, checked: true },
                                    { name: 'Free-Range Eggs', cat: messages.dairy, checked: false },
                                    { name: 'Cherry Tomatoes', cat: messages.produce, checked: false },
                                    { name: 'Olive Oil', cat: messages.pantry, checked: false },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.listItem} ${item.checked ? styles.checked : ''
                                            }`}
                                    >
                                        <div
                                            className={`${styles.checkbox} ${item.checked ? styles.checked : ''
                                                }`}
                                        >
                                            {item.checked && (
                                                <svg
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <div className={styles.itemContent}>
                                            <span
                                                className={`${styles.itemName} ${item.checked ? styles.checked : ''
                                                    }`}
                                            >
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className={styles.itemCategory}>
                                            {item.cat}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
