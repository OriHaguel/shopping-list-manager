import styles from "./CloseIcon.module.scss";

export function CloseIcon({ className = "" }) {
    return (
        <svg
            className={`${styles.closeIcon} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path
                d="M18 6L6 18M6 6l12 12"
                className={styles.x}
            />
        </svg>
    );
}
