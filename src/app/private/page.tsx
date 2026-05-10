import styles from './PrivacyPolicyPage.module.scss'

export default function PrivacyPolicyPage() {
    return (
        <main className={styles.container}>
            <h1>Privacy Policy</h1>

            <p>Last updated: May 10, 2026</p>

            <h2>Analytics</h2>
            <p>
                This website uses Cloudflare Web Analytics to understand website
                traffic and improve performance and user experience.
            </p>

            <h2>Accounts and User Data</h2>
            <p>
                If you create an account, we may store information such as your
                email address, account preferences, and lists or shared content
                you create.
            </p>

            <h2>Third-Party Services</h2>
            <p>
                The website may use trusted third-party services for hosting,
                analytics, authentication, and infrastructure.
            </p>

            <h2>Data Security</h2>
            <p>
                We take reasonable measures to help protect user data.
            </p>

            <h2>Changes</h2>
            <p>
                This Privacy Policy may be updated from time to time.
            </p>

            <h2>Contact</h2>
            <p>
                If you have questions about this Privacy Policy, please contact us
                through the website.
            </p>
        </main>
    )
}
