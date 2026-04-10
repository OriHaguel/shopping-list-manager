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
    // just impliment t.whatever next time insted of adding texct mannually
    const getCategoryIcon = (cat: string) => {
        const categoryLower = cat.toLowerCase();

        // Fruits & Vegetables
        if (categoryLower.includes('fruit') || categoryLower.includes('vegetable') || categoryLower.includes('ירקות') || categoryLower.includes('פירות')) {
            return (
                <Image src="/icons/apple.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }

        // Meat & Seafood
        if (categoryLower.includes('meat') || categoryLower.includes('chicken') || categoryLower.includes('בשר')) {
            return (
                <Image src="/icons/meat.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }
        if (categoryLower.includes('seafood') || categoryLower.includes('fish') || categoryLower.includes('דגים')) {
            return (
                <Image src="/icons/fish.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }

        // Dairy
        if (categoryLower.includes('dairy') || categoryLower.includes('milk') || categoryLower.includes('cheese') || categoryLower.includes('מוצרי חלב')) {
            return (
                <Image src="/icons/dairy.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />
            );
        }

        // Bakery & Bread
        if (categoryLower.includes('bakery') || categoryLower.includes('bread') || categoryLower.includes('מאפים')) {
            return (
                <Image src="/icons/bread.png" alt="" width={45} height={45} className={styles.iconImg} />
            );
        }

        // Beverages
        if (categoryLower.includes('beverage') || categoryLower.includes('drink') || categoryLower.includes('juice') || categoryLower.includes('משקאות')) {
            return (
                <Image src="/icons/water.png" alt="" width={37.5} height={37.5} className={styles.iconImg} />

            );
        }

        // Snacks
        if (categoryLower.includes('snack') || categoryLower.includes('chip') || categoryLower.includes('חטיפים')) {
            return (
                <Image src="/icons/candy.png" alt="" width={37.5} height={37.5} />

            );
        }


        // Household / Cleaning
        if (categoryLower.includes('household') || categoryLower.includes('cleaning') || categoryLower.includes('ניקיון')) {
            return (
                <Image src="/icons/soap.png" alt="" width={27.5} height={37.5} className={styles.iconImg} />

            );
        }

        // Personal Care
        if (categoryLower.includes('personal') || categoryLower.includes('care') || categoryLower.includes('hygiene') || categoryLower.includes('beauty')) {
            return (
                <Image src="/icons/personal.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }

        // Alcohol
        if (categoryLower.includes('alcohol') || categoryLower.includes('wine') || categoryLower.includes('beer') || categoryLower.includes('אלכוהול')) {
            return (
                <Image src="/icons/wineglass.png" alt="" width={37.5} height={37.5} className={styles.iconImg} />

            );
        }

        // Frozen
        if (categoryLower.includes('frozen') || categoryLower.includes('קפואים')) {
            return (
                <Image src="/icons/frozen.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }

        // Pets
        if (categoryLower.includes('pet') || categoryLower.includes('dog') || categoryLower.includes('cat') || categoryLower.includes('חיות מחמד')) {
            return (
                <Image src="/icons/dogpaw.png" alt="" width={27.5} height={37.5} />

            );
        }

        // Electronics
        if (categoryLower.includes('electronic') || categoryLower.includes('tech') || categoryLower.includes('אלקטרוניקה')) {
            return (
                <Image src="/icons/monitor.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }

        // Health
        if (categoryLower.includes('health') || categoryLower.includes('medical') || categoryLower.includes('pharmacy') || categoryLower.includes('בריאות')) {
            return (
                <Image src="/icons/health.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }

        // Clothing
        if (categoryLower.includes('clothing') || categoryLower.includes('apparel') || categoryLower.includes('ביגוד') || categoryLower.includes('clothes')) {
            return (
                <Image src="/icons/shirt.png" alt="" width={37.5} height={37.5} className={styles.iconImg} />

            );
        }

        // Baby
        if (categoryLower.includes('baby') || categoryLower.includes('infant') || categoryLower.includes('תינוקות')) {
            return (
                <Image src="/icons/baby.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }
        if (categoryLower.includes('dry goods') || categoryLower.includes('מוצרים יבשים')) {
            return (
                <Image src="/icons/wheat.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

            );
        }

        // Default/Other
        return (
            <Image src="/icons/priceticket.png" alt="" className={styles.iconImg} width={37.5} height={37.5} />

        );

    };

    return getCategoryIcon(category);
};