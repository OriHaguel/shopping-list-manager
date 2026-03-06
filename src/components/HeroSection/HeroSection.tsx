'use client'

import { ArrowRight } from 'lucide-react'
import styles from './HeroSection.module.scss'

export function HeroSection() {
    return (
        <section className={styles.section}>
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
                            Shopping lists,{' '}
                            <span className={styles.headingAccent}>simplified</span>
                        </h1>

                        <p className={styles.description}>
                            Create, organize, and share your shopping lists in seconds. Never
                            forget an item again with smart reminders and effortless
                            collaboration.
                        </p>

                        <div className={styles.ctaContainer}>
                            <a href="#cta" className={styles.ctaButton}>
                                Start for Free
                                <ArrowRight />
                            </a>
                        </div>

                        {/* Micro social proof */}
                        <div className={styles.socialProof}>
                            <div className={styles.avatarsContainer}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={styles.avatar}>
                                        <img
                                            src={`https://images.unsplash.com/photo-${i === 1
                                                    ? '1494790108377-be9c29b29330'
                                                    : i === 2
                                                        ? '1507003211169-0a1dd7228f2d'
                                                        : i === 3
                                                            ? '1438761681033-6461ffad8d80'
                                                            : '1472099645785-5658abf4ff4e'
                                                }?w=64&q=60`}
                                            alt="User avatar"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={styles.ratingContainer}>
                                <div className={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <svg
                                            key={i}
                                            className={styles.star}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className={styles.ratingText}>
                                    4.9/5 from 2,000+ reviews
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - App Mockup */}
                    <div className={styles.rightColumn}>
                        <div className={styles.mockupContainer}>
                            {/* Mockup Header */}
                            <div className={styles.mockupHeader}>
                                <div className={styles.mockupHeaderInfo}>
                                    <h3 className={styles.mockupTitle}>
                                        Weekly Groceries
                                    </h3>
                                    <p className={styles.mockupSubtitle}>
                                        12 items · Shared with Sarah
                                    </p>
                                </div>
                                <div className={styles.progressBadge}>
                                    3/12
                                </div>
                            </div>

                            {/* List Items */}
                            <div className={styles.itemsList}>
                                {[
                                    { name: 'Organic Avocados', cat: 'Produce', checked: true },
                                    { name: 'Sourdough Bread', cat: 'Bakery', checked: true },
                                    { name: 'Greek Yogurt', cat: 'Dairy', checked: true },
                                    { name: 'Free-Range Eggs', cat: 'Dairy', checked: false },
                                    { name: 'Cherry Tomatoes', cat: 'Produce', checked: false },
                                    { name: 'Olive Oil', cat: 'Pantry', checked: false },
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
