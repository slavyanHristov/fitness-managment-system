import { defineStore } from "pinia";
import AuthService from "@/services/API-calls/AuthService";
const user = JSON.parse(localStorage.getItem("user"));
const userState = user
  ? {
      status: {
        isLoggedIn: true,
      },
      user,
    }
  : {
      status: {
        isLoggedIn: false,
      },
      user: null,
    };

export const useAuthStore = defineStore({
  id: "authStore",

  state: () => ({
    userState,
  }),
  getters: {
    getUserState(state) {
      return state.userState;
    },
    isUserLoggedIn(state) {
      return state.userState.status.isLoggedIn;
    },
    getCurrentUser(state) {
      return state.userState.user;
    },
    isCurrentUserAdmin(state) {
      return state.userState.user?.userType.valueOf() === 1;
    },
    isCurrentUserManager(state) {
      return state.userState.user?.userType.valueOf() === 2;
    },
    isCurrentUserInstructor(state) {
      return state.userState.user?.userType.valueOf() === 3;
    },
    isCurrentUserClient(state) {
      return state.userState.user?.userType.valueOf() === 4;
    },
    isCurrentUserAdminOrManager(state) {
      return (
        state.userState.user?.userType.valueOf() === 1 ||
        state.userState.user?.userType.valueOf() === 2
      );
    },
  },
  actions: {
    async login(user) {
      try {
        const authUser = await AuthService.login(user);
        this.setUserState(true, authUser);
        return Promise.resolve(authUser);
      } catch (err) {
        this.setUserState(false, null);
        return Promise.reject(err);
      }
    },
    async logout() {
      await AuthService.logout();
      this.setUserState(false, null);
    },
    async register(userData) {
      try {
        let response = await AuthService.register(userData);
        this.setUserState(false);
        return Promise.resolve(response);
      } catch (err) {
        this.setUserState(false);
        return Promise.reject(err);
      }
    },
    refreshToken(accessToken) {
      this.userState.status.isLoggedIn = true;
      this.userState.user = {
        ...this.userState.user,
        accessToken: accessToken,
      };
    },

    setUserState(isLoggedIn, user) {
      this.userState.status.isLoggedIn = isLoggedIn;
      if (user !== undefined) this.userState.user = user;
    },
    setMembership(membershipData) {
      this.userState.user.userRole = {
        membership: membershipData,
      };
    },
  },
});
