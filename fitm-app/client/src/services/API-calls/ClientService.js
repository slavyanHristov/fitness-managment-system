import ProtectedAPI from "../axios-instances/ProtectedAPI";

class ClientAPI {
  getDashboardData() {
    return ProtectedAPI().get("/client/dashboard-data");
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
  deleteFoodFromMeal(id) {
    return ProtectedAPI().delete(`/client/mealPlan/delete/food/${id}`);
  }
}

export default new ClientAPI();
