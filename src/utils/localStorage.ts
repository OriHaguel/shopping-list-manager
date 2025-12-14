// utils/localStorage.tsx

export const isBrowser = (): boolean =>
    typeof window !== 'undefined';

export function setItem<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.log('Error setting item in localStorage', err);
        // fail silently or add logging if needed
    }
}

export function getItem<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function removeItem(key: string): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(key);
}

export function clear(): void {
    if (!isBrowser()) return;
    window.localStorage.clear();
}
