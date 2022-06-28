import API from '@/services/axios-instances/API'
import TokenService from './TokenService'
import router from '@/router'
class AuthService {
    async login(user) {
        const response = await API().post('/auth/login', user)
        if (response.data.accessToken) {
            // localStorage.setItem('user', JSON.stringify(response.data))
            TokenService.setUser(response.data)
        }
        return response.data
    }
    async logout() {
        TokenService.removeUser()
        try {
            await API().delete('/auth/logout')
            router.push({
                name: 'home'
            })
            // localStorage.removeItem('user')
        } catch (err) {
            return err.data.message
        }
    }
    register(userData) {
        return API().post('/register/users/admin', userData)
    }
    requestPasswordReset(userData) {
        return API().post('/auth/reset-password-request', userData)
    }
    newPassword(userData) {
        return API().post('/auth/new-password', userData)
    }
    finalizeAccount(userData) {
        return API().post('/auth/finalize-account', userData)
    }
}

export default new AuthService();