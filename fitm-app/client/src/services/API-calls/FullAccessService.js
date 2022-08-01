import API from "../axios-instances/API";

class FullAccessAPI {
  getAllGyms() {
    return API().get("/fullAccess/gyms");
  }
  getGym(gymId) {
    return API().get("/fullAccess/gyms/" + gymId);
  }
  getAllInstructors() {
    return API().get("/fullAccess/instructors");
  }
}

export default new FullAccessAPI();
