import styles from "./CircleClose.module.scss";

export function CircleClose({ className = "" }) {
    return (
        <svg
            className={`${styles.icon} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10" className={styles.circle} />
            <path d="M9 9l6 6M15 9l-6 6" className={styles.x} />
        </svg>
    );
}
