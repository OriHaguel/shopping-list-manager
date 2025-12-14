import { getItem } from "@/utils/localStorage";
import { en } from "@/lan/en";
import { he } from "@/lan/he";

const locales: Record<string, Record<string, string>> = { en, he };

export function getMessages() {
    const lan = getItem<string>('lan', '');
    return locales[lan] || locales['en'];
}
