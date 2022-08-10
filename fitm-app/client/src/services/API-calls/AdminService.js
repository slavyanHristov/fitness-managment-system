import ProtectedAPI from "../axios-instances/ProtectedAPI";

class AdminAPI {
  getGyms() {
    return ProtectedAPI().get("/admin/gyms");
  }
  getDashboardData() {
    return ProtectedAPI().get("/admin/dashboard-data");
  }
  registerManager(user) {
    return ProtectedAPI().post("/register/users/manager", user);
  }
  mailToManager(emailData) {
    return ProtectedAPI().post("/admin/test/send-mail", emailData);
  }
  registerGym(gymData) {
    return ProtectedAPI().post("/register/gym", gymData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  getAllManagers() {
    return ProtectedAPI().get("/admin/managers");
  }
  getAllGyms() {
    return ProtectedAPI().get("/admin/gyms");
  }
  updateGym(gymId, gymData) {
    return ProtectedAPI().patch(`/admin/gym/update/${gymId}`, gymData);
  }
}

// export default {
//     getManagers() {
//         return ProtectedAPI().get('/admin/gyms')
//     }
// }

export default new AdminAPI();
