import axios from 'axios'

export let apiaccesstoken = null
export function setapiaccesstoken(token) {
    apiaccesstoken = token
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    if (apiaccesstoken) {
        config.headers.Authorization = `Bearer ${apiaccesstoken}`
    }
    return config
})

api.interceptors.response.use((response) => { return response }, async (error) => {
    const excludedUrls = ['api/token/', 'api/token/refresh/', 'register/'];

    // BUG FIX: ".include(...)" is not a real array/string method (it was
    // silently throwing, which broke this whole retry block). It should
    // be ".includes(...)".
    const isExcluded = excludedUrls.some((url) => error.config?.url?.includes(url));

    if (error.response?.status == 401 && !isExcluded && !error.config._retry) {
        try {
            error.config._retry = true
            const refresh = localStorage.getItem('refresh_token')

            if (!refresh) {
                return Promise.reject(error)
            }

            const resp = await api.post("api/token/refresh/", { refresh: refresh })

            setapiaccesstoken(resp.data.access)
            localStorage.setItem("access_token", resp.data.access)

            error.config.headers.Authorization = `Bearer ${resp.data.access}`
            return api(error.config)
        } catch (refreshError) {
            return Promise.reject(refreshError)
        }
    }
    return Promise.reject(error)
})