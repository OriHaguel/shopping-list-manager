import styles from "./AddCircle.module.scss";

export function AddCircle({ className = "" }) {
    return (
        <svg
            className={`${styles.addCircleIcon} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10" className={styles.circle} />
            <path d="M12 8v8M8 12h8" className={styles.plus} />
        </svg>
    );
}
