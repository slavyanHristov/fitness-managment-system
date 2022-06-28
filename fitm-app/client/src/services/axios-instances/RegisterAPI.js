import API from './API'

export default {
    registerAdmin(userData) {
        return API().post('/register/users/admin', userData)
    }
}