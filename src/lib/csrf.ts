import { httpService } from '@/services/http.service';

let csrfToken: string | null = null;

export async function initializeCsrf(): Promise<void> {
    if (typeof window === 'undefined') return; // Skip on server

    try {
        const response = await httpService.get('/users/csrf-token');
        csrfToken = response.csrfToken;
        console.log('CSRF token initialized');
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
    }
}

export function getCsrfToken(): string | null {
    return csrfToken;
}

export function updateCsrfToken(token: string) {
    csrfToken = token;
}