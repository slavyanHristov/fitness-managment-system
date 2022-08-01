import ProtectedAPI from "../axios-instances/ProtectedAPI";
import API from "../axios-instances/API";

class UserService {
  isUserExpired() {
    return ProtectedAPI().get("/user/isUserExpired");
  }
  getUserData() {
    return ProtectedAPI().get("/user/getUserData");
  }
  getUserImage() {
    return ProtectedAPI().get("/user/getUserImage");
  }
  requestPasswordReset(userData) {
    return API().post("/user/reset-password-request", userData);
  }
  newPassword(userData) {
    return API().post("/user/new-password", userData);
  }
  changeProfilePicture(userData) {
    return ProtectedAPI().post("/user/changeProfilePicture", userData);
  }
  getNewUser() {
    return ProtectedAPI().get(`/user/new`);
  }
}

export default new UserService();
