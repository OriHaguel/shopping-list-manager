import { getItem } from "@/utils/localStorage";

export function popularItems() {
    const lan = getItem<string>('lan', '');
    if (lan === 'he' || lan.startsWith('he-')) {
        return [
            'חלב',
            'לחם',
            'ביצים',
            'חמאה',
            'גבינה',
            'עוף',
            'אורז',
            'פסטה',
            'עגבניות',
            'בצל',
            'תפוחים',
            'בננות',
            'יוגורט',
            'קפה',
            'סוכר'
        ];

    } else {
        return [
            'Milk', 'Bread', 'Eggs', 'Butter', 'Cheese',
            'Chicken', 'Rice', 'Pasta', 'Tomatoes', 'Onions',
            'Apples', 'Bananas', 'Yogurt', 'Coffee', 'Sugar'
        ];
    }
}