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
  getDataCount() {
    return API().get("/fullAccess/data-count");
  }
}

export default new FullAccessAPI();
