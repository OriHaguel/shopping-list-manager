import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
} from 'axios';

const BASE_URL =
    process.env.NODE_ENV === 'production'
        ? '/api/'
        : 'http://localhost:3030/api/';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
    params?: Record<string, any>;
    signal?: AbortSignal;
    config?: AxiosRequestConfig;
}

/** Normalized error type */
export interface NormalizedHttpError extends Error {
    isAxiosError: boolean;
    status?: number;
    payload?: any;
}

/** axios instance with sane defaults */
const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

/** centralized error normalizer (throws) */
function handleAxiosError(err: unknown): never {
    if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError;
        const status = axiosErr.response?.status;
        const payload = axiosErr.response?.data;

        // unauthorized handling
        if (status === 401) {
            try {
                sessionStorage.clear();
            } finally {
                window.location.assign('/');
            }
        }

        const normalized: NormalizedHttpError = {
            name: 'HttpError',
            message:
                (payload &&
                    (payload as any).message) ||
                (payload as any)?.error ||
                axiosErr.message ||
                'Network or server error',
            isAxiosError: true,
            status,
            payload,
        };

        throw normalized;
    }

    throw {
        name: 'UnknownError',
        message: String(err) || 'Unknown error',
        isAxiosError: false,
    } as NormalizedHttpError;
}

/** single request wrapper */
async function request<T = any>(
    method: HttpMethod,
    endpoint: string,
    data?: any,
    opts: RequestOptions = {}
): Promise<T> {
    const { params, signal, config } = opts;

    try {
        const res = await axiosInstance.request<T>({
            url: endpoint,
            method,
            data: method === 'GET' ? undefined : data,
            params: method === 'GET' ? params || data : params,
            signal,
            ...config,
        });
        return res.data;
    } catch (err) {
        handleAxiosError(err);
    }
}

/** exported service */
export const httpService = {
    get<T = any>(
        endpoint: string,
        params?: any,
        opts?: Omit<RequestOptions, 'params'>
    ) {
        return request<T>('GET', endpoint, undefined, { params, ...opts });
    },
    post<T = any>(endpoint: string, data?: any, opts?: RequestOptions) {
        return request<T>('POST', endpoint, data, opts);
    },
    put<T = any>(endpoint: string, data?: any, opts?: RequestOptions) {
        return request<T>('PUT', endpoint, data, opts);
    },
    delete<T = any>(endpoint: string, data?: any, opts?: RequestOptions) {
        return request<T>('DELETE', endpoint, data, opts);
    },
};
export { axiosInstance };