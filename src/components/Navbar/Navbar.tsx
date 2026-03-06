'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ShoppingCart } from 'lucide-react'
import styles from './Navbar.module.scss'

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Testimonials', href: '#testimonials' },
    ]

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                {/* Logo */}
                <a href="#" className={styles.logoWrapper}>
                    <div className={styles.logoIcon}>
                        <ShoppingCart />
                    </div>
                    <span className={styles.logoText}>ListFlow</span>
                </a>

                {/* Desktop Nav Links */}
                <div className={styles.desktopNav}>
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={styles.navLink}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className={styles.desktopCTA}>
                    <a href="#cta" className={styles.ctaButton}>
                        Get Started
                    </a>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.open : ''}`}>
                <div className={styles.mobileDrawerContent}>
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={styles.mobileNavLink}
                        >
                            {link.label}
                        </a>
                    ))}
                    <hr className={styles.mobileDivider} />
                    <a
                        href="#cta"
                        onClick={() => setMobileOpen(false)}
                        className={styles.mobileCTAButton}
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </nav>
    )
}
