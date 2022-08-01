import ProtectedAPI from "../axios-instances/ProtectedAPI";

class ManagerAPI {
  getManager(userId) {
    return ProtectedAPI().get(`/manager/${userId}`);
  }
  registerInstructor(userData) {
    return ProtectedAPI().post("/register/users/instructor", userData);
  }
  registerEmployee(employeeData) {
    return ProtectedAPI().post("/register/users/employee", employeeData);
  }
  getYourGyms(managerId) {
    return ProtectedAPI().get(`/manager/gyms/${managerId}`);
  }
  getYourEmployees() {
    return ProtectedAPI().get("/manager/employees");
  }
  updateEmployee(employeeId, employeeData) {
    return ProtectedAPI().patch(
      `/manager/employees/update/${employeeId}`,
      employeeData
    );
  }
}

export default new ManagerAPI();
