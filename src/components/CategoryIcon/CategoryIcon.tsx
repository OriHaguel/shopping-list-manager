// components/CategoryIcon/CategoryIcon.tsx
import styles from './CategoryIcon.module.scss';
import Image from 'next/image';
interface CategoryIconProps {
    category: string;
    size?: number;
    className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
    category,
    size = 20,
    className = ''
}) => {
    const getCategoryIcon = (cat: string) => {
        const categoryLower = cat.toLowerCase();

        // Fruits & Vegetables
        if (categoryLower.includes('fruit') || categoryLower.includes('vegetable') || categoryLower.includes('produce')) {
            return (
                '🍎'
            );
        }

        // Meat & Seafood
        if (categoryLower.includes('meat') || categoryLower.includes('chicken') || categoryLower.includes('beef')) {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
                    <path d="M18 12v.5" />
                    <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
                    <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
                </svg>
            );
        }
        if (categoryLower.includes('seafood') || categoryLower.includes('fish')) {
            return (
                <Image src="/icons/fish.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }

        // Dairy
        if (categoryLower.includes('dairy') || categoryLower.includes('milk') || categoryLower.includes('cheese') || categoryLower.includes('yogurt')) {
            return (
                <Image src="/icons/dairy.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />
            );
        }

        // Bakery & Bread
        if (categoryLower.includes('bakery') || categoryLower.includes('bread') || categoryLower.includes('pastry')) {
            return (
                <Image src="/icons/bread.png" alt="" width={45} height={45} className={styles.iconImg} />
            );
        }

        // Beverages
        if (categoryLower.includes('beverage') || categoryLower.includes('drink') || categoryLower.includes('juice') || categoryLower.includes('soda')) {
            return (
                <Image src="/icons/water.png" alt="" width={37.5} height={37.5} className={styles.iconImg} />

            );
        }

        // Snacks
        if (categoryLower.includes('snack') || categoryLower.includes('chip') || categoryLower.includes('candy')) {
            return (
                <Image src="/icons/candy.png" alt="" width={37.5} height={37.5} />

            );
        }


        // Household / Cleaning
        if (categoryLower.includes('household') || categoryLower.includes('cleaning') || categoryLower.includes('detergent')) {
            return (
                <Image src="/icons/clean.png" alt="" width={27.5} height={37.5} />

            );
        }

        // Personal Care
        if (categoryLower.includes('personal') || categoryLower.includes('care') || categoryLower.includes('hygiene') || categoryLower.includes('beauty')) {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="M13 5v2" />
                    <path d="M13 17v2" />
                    <path d="M13 11v2" />
                </svg>
            );
        }

        // Alcohol
        if (categoryLower.includes('alcohol') || categoryLower.includes('wine') || categoryLower.includes('beer') || categoryLower.includes('liquor')) {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M8 22h8" />
                    <path d="M7 10h10" />
                    <path d="M12 15v7" />
                    <path d="m15 3-3 7-3-7h6Z" />
                </svg>
            );
        }

        // Frozen
        if (categoryLower.includes('frozen')) {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M12 2v20" />
                    <path d="m3 9 4.5 1.5" />
                    <path d="m3 15 4.5-1.5" />
                    <path d="m21 9-4.5 1.5" />
                    <path d="m21 15-4.5-1.5" />
                    <path d="M6 7.5 12 12" />
                    <path d="M6 16.5 12 12" />
                    <path d="M18 7.5 12 12" />
                    <path d="M18 16.5 12 12" />
                </svg>
            );
        }

        // Pets
        if (categoryLower.includes('pet') || categoryLower.includes('dog') || categoryLower.includes('cat') || categoryLower.includes('animal')) {
            return (
                <Image src="/icons/dogpaw.png" alt="" width={27.5} height={37.5} />

            );
        }

        // Electronics
        if (categoryLower.includes('electronic') || categoryLower.includes('tech') || categoryLower.includes('gadget')) {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect width="16" height="20" x="4" y="2" rx="2" />
                    <path d="M12 6h.01" />
                    <circle cx="12" cy="14" r="4" />
                    <path d="M12 14h.01" />
                </svg>
            );
        }

        // Health
        if (categoryLower.includes('health') || categoryLower.includes('medical') || categoryLower.includes('pharmacy') || categoryLower.includes('medicine')) {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
                </svg>
            );
        }

        // Clothing
        if (categoryLower.includes('clothing') || categoryLower.includes('apparel') || categoryLower.includes('fashion') || categoryLower.includes('clothes')) {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                </svg>
            );
        }

        // Baby
        if (categoryLower.includes('baby') || categoryLower.includes('infant') || categoryLower.includes('toddler')) {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M9 12h.01" />
                    <path d="M15 12h.01" />
                    <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
                    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
                </svg>
            );
        }

        // Default/Other
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        );

    };

    return getCategoryIcon(category);
};