import API from './API'

export default {
    authUser(userCredentials) {
        return API().post('/auth/login', userCredentials)
    }
}