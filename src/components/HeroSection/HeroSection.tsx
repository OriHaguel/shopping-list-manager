'use client'

import { ArrowRight } from 'lucide-react'
import styles from './HeroSection.module.scss'
import { useRouter } from 'next/navigation'

export function HeroSection() {
    const router = useRouter()
    const handleListClick = () => {
        router.push(`/auth`)
    }

    return (
        <section className={styles.section} >
            {/* Responsive Background Image with priority loading */}
            <picture className={styles.backgroundImage}>
                <source media="(max-width: 600px)" srcSet="/smallmobileherobg.webp" />
                <source media="(max-width: 950px)" srcSet="/mobileherobg.webp" />
                <img src="/herobg.webp" alt="Shopping list hero background" fetchPriority="high" />
            </picture>

            <div className={styles.contentWrapper}>
                <div className={styles.gridContainer}>
                    {/* Left Column - Text */}
                    <div className={styles.leftColumn}>
                        <h1 className={styles.heading}>
                            Shopping lists made
                            <span className={styles.headingAccent}> fast</span>
                        </h1>

                        <p className={styles.description}>
                            Organize your shopping lists in seconds, collaborate with family and friends, and add items by voice — completely free.
                        </p>

                        <div className={styles.ctaContainer}>
                            <button className={styles.ctaButton} onClick={handleListClick}>
                                Start for Free
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
