import { axiosInstance } from '@/services/http.service';
import { getCsrfToken, updateCsrfToken } from './csrf';

let isSetup = false;

export function setupAxiosInterceptors() {
    if (isSetup) return;
    isSetup = true;

    // Request interceptor - add CSRF token to state-changing requests
    axiosInstance.interceptors.request.use(
        (config) => {
            const method = config.method?.toUpperCase();

            // Add CSRF token for POST, PUT, PATCH, DELETE
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '')) {
                const token = getCsrfToken();
                if (token) {
                    config.headers['x-csrf-token'] = token;
                }
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor - update CSRF token if server provides new one
    axiosInstance.interceptors.response.use(
        (response) => {
            if (response.data?.csrfToken) {
                updateCsrfToken(response.data.csrfToken);
            }
            return response;
        },
        async (error) => {
            // If CSRF token is invalid (403), try to fetch new one and retry
            if (error.response?.status === 403 &&
                error.response?.data?.message?.toLowerCase().includes('csrf')) {
                const originalRequest = error.config;

                if (!originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // Fetch new CSRF token
                        const response = await axiosInstance.get('/users/csrf-token');
                        updateCsrfToken(response.data.csrfToken);

                        // Retry original request with new token
                        originalRequest.headers['x-csrf-token'] = response.data.csrfToken;
                        return axiosInstance(originalRequest);
                    } catch (retryError) {
                        return Promise.reject(retryError);
                    }
                }
            }

            return Promise.reject(error);
        }
    );

    console.log('Axios interceptors configured for CSRF');
}