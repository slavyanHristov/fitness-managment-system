import axios from 'axios'
import TokenService from '../TokenService'
import RefreshTokenAPI from './RefreshTokenAPI'
import {
    useAuthStore
} from '@/stores/authStore'
const authStore = useAuthStore()

export default (url = 'http://localhost:5000/api') => {
    const axiosInstance = axios.create({
        baseURL: url,
    })
    axiosInstance.interceptors.request.use((config) => {
        const token = TokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    }, (error) => {
        return Promise.reject(error)
    })

    axiosInstance.interceptors.response.use(
        (response) => {
            return response
        },
        async (error) => {
            const originalRequest = error.config
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // request to new refresh token
                    // set refresh tocken in local storage
                    //TODO: if (rememberMe in authStore or localstorage is true)
                    if (authStore.getCurrentUser.remember) {
                        const res = await refreshToken()
                        if (res.data) {
                            const {
                                accessToken
                            } = res.data
                            // store.setToken(accessToken)
                            authStore.refreshToken(accessToken); // updates user in pinia store
                            TokenService.updateAccessToken(accessToken); // updates user in local storage
                            // axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                            return axiosInstance(originalRequest)
                        }
                    } else {
                        await authStore.logout();
                    }
                } catch (err) {
                    if (err.response && err.response.data) {
                        // store.setToken(null)
                        return Promise.reject(err)
                    }
                    return Promise.reject(err)
                }
            }
            return Promise.reject(error)
        }
    )
    const refreshToken = () => {
        return RefreshTokenAPI().post('/refresh-token', {})
    }

    return axiosInstance
}