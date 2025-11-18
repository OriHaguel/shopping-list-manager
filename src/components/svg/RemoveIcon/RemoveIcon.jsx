import styles from "./RemoveIcon.module.scss";

export function RemoveIcon({ className = "" }) {
    return (
        <svg
            className={`${styles.removeIcon} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path
                d="M6 12h12"
                className={styles.minus}
            />
        </svg>
    );
}
