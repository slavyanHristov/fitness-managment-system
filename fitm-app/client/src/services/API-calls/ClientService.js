import ProtectedAPI from "../axios-instances/ProtectedAPI";

class ClientAPI {
  createMembership(membershipData) {
    return ProtectedAPI().post("/client/membership/create", membershipData);
  }
  validateMembership() {
    return ProtectedAPI().post("/client/membership/verifyEndDate");
  }
  setInstructor(instructorId) {
    return ProtectedAPI().patch(`/client/setInstructor/${instructorId}`);
  }
  getInstructorsInGym() {
    return ProtectedAPI().get("/client/instructors");
  }
  payMembership(membershipData) {
    return ProtectedAPI().post("/client/pay", membershipData);
  }
  getMembership() {
    return ProtectedAPI().get("/client/membership/get");
  }
  getYourRoutine() {
    return ProtectedAPI().get("/client/routine");
  }
  getYourMealPlan() {
    return ProtectedAPI().get("/client/mealPlan");
  }
  getAllFoods() {
    return ProtectedAPI().get("/client/foods");
  }
  addFoodToMeal(foodData) {
    return ProtectedAPI().post("/client/mealPlan/add/food", foodData);
  }
}

export default new ClientAPI();
