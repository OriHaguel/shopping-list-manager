// Token management service
// Handles access token storage and refresh token rotation

export interface TokenResponse {
    accessToken: string;
    expiresIn?: number; // in seconds
}

function parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}
class TokenService {
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;
    private refreshPromise: Promise<string> | null = null;

    /**
     * Store access token with optional expiry
    */
    setAccessToken(token: string): void {
        console.log("🚀 ~ TokenService ~ accessToken:", token)
        this.accessToken = token;
        // payload.exp doesnt work rn fix later no manuallt expired
        const payload = parseJwt(token);
        if (payload.exp) {
            const expiryTime = new Date(payload.exp * 1000);
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
        const expiry = this.tokenExpiry.getTime(); // number
        // Consider token expired if it expires within 60 seconds
        return now >= expiry;
        // return now >= this.tokenExpiry - 60000;
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
