// Token management service
// Handles access token storage and refresh token rotation

export interface TokenResponse {
    accessToken: string;
    expiresIn?: number; // in seconds
}

class TokenService {
    private accessToken: string | null = null;
    private tokenExpiry: number | null = null;
    private refreshPromise: Promise<string> | null = null;

    /**
     * Store access token with optional expiry
     */
    setAccessToken(token: string, expiresIn?: number): void {
        this.accessToken = token;

        if (expiresIn) {
            const expiryTime = Date.now() + expiresIn * 1000;
            this.tokenExpiry = expiryTime;
        } else {
            this.tokenExpiry = null;
        }
    }

    /**
     * Get current access token
     */
    getAccessToken(): string | null {
        return this.accessToken;
    }

    /**
     * Check if token is expired or about to expire (within 60 seconds)
     */
    isTokenExpired(): boolean {
        if (!this.tokenExpiry) return false;

        const now = Date.now();

        // Consider token expired if it expires within 60 seconds
        return now >= this.tokenExpiry - 60000;
    }

    /**
     * Clear all token data
     */
    clearTokens(): void {
        this.accessToken = null;
        this.tokenExpiry = null;
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
