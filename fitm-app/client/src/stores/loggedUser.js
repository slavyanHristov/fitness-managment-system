import axios from 'axios';
import {
    defineStore
} from 'pinia'

export const useUserStore = defineStore({
    id: 'loggedUser', // id for store
    state: () => ({
        userId: null,
        token: null
    }),
    getters: {
        getToken(state) {
            return state.token
        },
        isLoggedIn: (state) => !!state.token //=> !! casts to boolean => if token exists should return true
    },
    actions: {
        setUserId(userId) {
            this.userId = userId;
        },
        setToken(token) {
            this.token = token;
        },
        async checkRefreshToken() {
            if (this.token) {
                return true;
            }
            const response = await axios.post("http://localhost:5000/api/auth/refresh-token", {}, {
                withCredentials: true
            })
            this.setToken(response.data.accessToken)
        }
    }

})