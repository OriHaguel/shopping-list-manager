import styles from './ListeckName.module.scss'

export function ListeckName({ color = '#5B8CA8' }) {
    return (
        <div className={styles.logoWrapper}>
            <div className={styles.logoIcon}>
                {/* <ShoppingCart /> */}
                <img src="/listecklogo.png" alt="Listeck logo" />
            </div>
            <div className="font-headline font-extrabold text-2xl md:text-[1.5rem] brand-title select-none">
                <span style={{ color: color }}>List</span><span className="text-[#FF8B6B]">eck</span>
            </div>
        </div>
    )
}