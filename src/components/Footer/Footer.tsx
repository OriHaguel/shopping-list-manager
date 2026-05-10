'use client'

import Link from 'next/link'
import styles from './Footer.module.scss'
export function Footer() {
    return (
        <div className={styles.footer}>
            <p>&copy; 2026 Shopping List Manager. All rights reserved.</p>
            <Link href="/private">Privacy Policy</Link>
        </div>
    )
}