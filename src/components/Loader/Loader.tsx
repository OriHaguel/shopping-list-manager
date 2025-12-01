import styles from './Loader.module.scss';

export const ProductivityLoader: React.FC = () => {
    return (
        <div className={styles.loaderOverlay}>
            <div className={styles.loaderContainer}>
                <div className={styles.loaderCircles}>
                    <div className={styles.loaderRing} />

                    <div className={styles.loaderInner}>
                        <div className={styles.loaderDot} />
                    </div>
                </div>

                <div className={styles.loaderText}>Loading</div>

                <div className={styles.loaderSubtext}>Preparing your lists...</div>

                <div className={styles.loaderDots}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={styles.loaderDotItem}
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

