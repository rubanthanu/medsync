import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});



let csrfToken = null;
let csrfPromise = null;

async function getCsrfToken() {
    if (csrfToken) return csrfToken;
    if (csrfPromise) return csrfPromise;

    csrfPromise = axios
        .get(`${import.meta.env.VITE_API_URL}/auth/csrf_token`, { withCredentials: true })
        .then((res) => {
            csrfToken = res.data.csrf_token;
            csrfPromise = null;
            return csrfToken;
        })
        .catch((err) => {
            csrfPromise = null;
            console.error('Failed to fetch CSRF token:', err);
            return null;
        });

    return csrfPromise;
}


export function clearCsrfToken() {
    csrfToken = null;
    csrfPromise = null;
}

api.interceptors.request.use(async (config) => {
    const method = config.method?.toLowerCase();

    // Attach CSRF token to every state-changing request
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
        const token = await getCsrfToken();
        if (token) {
            config.headers['X-CSRF-Token'] = token;
        }
    }

    return config;
});


const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/verify_otp', '/auth/resend_otp', '/auth/forgot_password', '/auth/verify_forgot_password_otp', '/auth/reset_password', '/auth/me'];

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';

        // If CSRF validation failed (403 with specific message), refresh token and retry once
        if (
            status === 403 &&
            error.response?.data?.message === 'CSRF token validation failed.' &&
            !error.config._csrfRetry
        ) {
            csrfToken = null; // Force refresh
            const newToken = await getCsrfToken();
            if (newToken) {
                error.config._csrfRetry = true;
                error.config.headers['X-CSRF-Token'] = newToken;
                return api.request(error.config);
            }
        }

        // Handle session expiry (401)
        if (
            status === 401 &&
            !AUTH_ROUTES.some(route => url.includes(route))
        ) {
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;