import ProtectedAPI from './ProtectedAPI'

class AdminAPI {
    getGyms() {
        return ProtectedAPI().get('/admin/gyms')
    }
    registerManager(user) {
        return ProtectedAPI().post('/register/users/manager', user)
    }
    mailToManager(emailData) {
        return ProtectedAPI().post('/admin/test/send-mail', emailData)
    }
}

// export default {
//     getManagers() {
//         return ProtectedAPI().get('/admin/gyms')
//     }
// }

export default new AdminAPI();