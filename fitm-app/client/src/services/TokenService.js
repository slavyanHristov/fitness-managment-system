class TokenService {
    getAccessToken() {
        const user = JSON.parse(localStorage.getItem("user"))
        return user ? user.accessToken : undefined;
    }
    updateAccessToken(token) {
        let user = JSON.parse(localStorage.getItem("user"))
        user.accessToken = token;
        localStorage.setItem("user", JSON.stringify(user));
    }
    getUser() {
        return JSON.parse(localStorage.getItem("user"))
    }
    setUser(user) {
        console.log(JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user))
    }
    removeUser() {
        localStorage.removeItem("user")
    }
}

export default new TokenService();