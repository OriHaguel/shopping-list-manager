import { axiosInstance } from '@/services/http.service';
import { getCsrfToken, updateCsrfToken } from './csrf';
import { tokenService } from '../services/user/token.service';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

let isSetup = false;

/**
 * Refresh the access token by calling the refresh endpoint
 */
export async function refreshAccessToken(): Promise<string> {
    try {
        const csrfToken = getCsrfToken();
        // Make refresh request without interceptors to avoid infinite loop
        const response = await axiosInstance.post(
            'users/refresh',
            {},
            {
                headers: {
                    'X-Skip-Interceptor': 'true',
                    ...(csrfToken && { 'x-csrf-token': csrfToken })
                }
            }
        );
        console.log('this is called')
        const { accessToken } = response.data;
        tokenService.setAccessToken(accessToken);

        return accessToken;
    } catch (error) {
        // Refresh failed, clear tokens and redirect to login
        tokenService.clearTokens();
        window.location.assign('/');
        throw error;
    }
}

export function setupAxiosInterceptors() {
    if (isSetup) return;
    isSetup = true;

    // ============ REQUEST INTERCEPTOR ============
    axiosInstance.interceptors.request.use(
        async (config) => {
            // Skip interceptor for specific requests (like refresh token)
            if (config.headers?.['X-Skip-Interceptor']) {
                delete config.headers['X-Skip-Interceptor'];
                return config;
            }

            const method = config.method?.toUpperCase();

            // 1. Add CSRF token for state-changing requests
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '')) {
                const csrfToken = getCsrfToken();
                if (csrfToken) {
                    console.log("🚀 ~ setupAxiosInterceptors ~ csrfToken:", csrfToken);
                    config.headers['x-csrf-token'] = csrfToken;
                } else {
                    console.warn('CSRF token not available yet for', method, config.url);
                }
            }

            // 2. Check if access token needs refresh
            if (tokenService.isTokenExpired()) {
                let refreshPromise = tokenService.getRefreshPromise();
                if (!refreshPromise) {
                    refreshPromise = refreshAccessToken();
                    tokenService.setRefreshPromise(refreshPromise);

                    try {
                        await refreshPromise;
                    } finally {
                        tokenService.setRefreshPromise(null);
                    }
                } else {
                    await refreshPromise;
                }
            }

            // 3. Attach access token to request
            const accessToken = tokenService.getAccessToken();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // ============ RESPONSE INTERCEPTOR ============
    axiosInstance.interceptors.response.use(
        (response) => {
            // Update CSRF token if server provides new one
            if (response.data?.csrfToken) {
                updateCsrfToken(response.data.csrfToken);
            }
            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // Handle 403 CSRF token errors
            if (error.response?.status === 403) {
                const errorData = error.response.data;
                let errorMessage = '';

                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData && typeof (errorData as any).message === 'string') {
                    errorMessage = (errorData as any).message;
                }

                if (errorMessage.toLowerCase().includes('csrf')) {
                    if (!originalRequest._retry) {
                        originalRequest._retry = true;

                        try {
                            // Fetch new CSRF token
                            const response = await axiosInstance.get('/users/csrf-token', {
                                headers: { 'X-Skip-Interceptor': 'true' }
                            });
                            updateCsrfToken(response.data.csrfToken);

                            // Retry original request with new token
                            originalRequest.headers['x-csrf-token'] = response.data.csrfToken;
                            return axiosInstance(originalRequest);
                        } catch (retryError) {
                            return Promise.reject(retryError);
                        }
                    }
                }
            }

            // Handle 401 unauthorized errors (access token expired/invalid)
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Try to refresh the access token
                    let refreshPromise = tokenService.getRefreshPromise();

                    if (!refreshPromise) {
                        refreshPromise = refreshAccessToken();
                        tokenService.setRefreshPromise(refreshPromise);

                        try {
                            await refreshPromise;
                        } finally {
                            tokenService.setRefreshPromise(null);
                        }
                    } else {
                        await refreshPromise;
                    }

                    // Retry original request with new access token
                    const token = tokenService.getAccessToken();
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }

                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, reject the original request
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    console.log('Axios interceptors configured for CSRF and Access Tokens');
}