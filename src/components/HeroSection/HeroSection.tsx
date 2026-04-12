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

            <div className={styles.contentWrapper}>
                <div className={styles.gridContainer}>
                    {/* Left Column - Text */}
                    <div className={styles.leftColumn}>
                        <h1 className={styles.heading}>
                            {messages.shoppingListsSimplified.split(',')[0]}{'  '}
                            <span className={styles.headingAccent}>{messages.fast}</span>
                        </h1>

                        <p className={styles.description}>
                            {messages.authSecondaryText}
                        </p>

                        <div className={styles.ctaContainer}>
                            <button className={styles.ctaButton} onClick={handleListClick}>
                                {messages.startForFree}
                                <ArrowRight />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - App Mockup */}
                    <div className={styles.iphoneMockup}>
                    </div>
                </div>
            </div>
        </section>
    )
}
