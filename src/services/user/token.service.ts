// Token management service
// Handles access token storage and refresh token rotation

const ACCESS_TOKEN_KEY = 'accessToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

export interface TokenResponse {
    accessToken: string;
    expiresIn?: number; // in seconds
}

class TokenService {
    private refreshPromise: Promise<string> | null = null;

    /**
     * Store access token with optional expiry
     */
    setAccessToken(token: string, expiresIn?: number): void {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);

        if (expiresIn) {
            const expiryTime = Date.now() + expiresIn * 1000;
            sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
        }
    }

    /**
     * Get current access token
     */
    getAccessToken(): string | null {
        return sessionStorage.getItem(ACCESS_TOKEN_KEY);
    }

    /**
     * Check if token is expired or about to expire (within 60 seconds)
     */
    isTokenExpired(): boolean {
        const expiryTime = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiryTime) return false;

        const expiry = parseInt(expiryTime, 10);
        const now = Date.now();

        // Consider token expired if it expires within 60 seconds
        return now >= expiry - 60000;
    }

    /**
     * Clear all token data
     */
    clearTokens(): void {
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
        this.refreshPromise = null;
    }

    /**
     * Get or create a refresh promise to prevent multiple simultaneous refresh requests
     */
    getRefreshPromise(): Promise<string> | null {
        return this.refreshPromise;
    }

    /**
     * Set refresh promise
     */
    setRefreshPromise(promise: Promise<string> | null): void {
        this.refreshPromise = promise;
    }
}

export const tokenService = new TokenService();