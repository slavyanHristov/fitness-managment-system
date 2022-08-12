import ProtectedAPI from "../axios-instances/ProtectedAPI";

class InstructorAPI {
  createRoutine(routineData) {
    return ProtectedAPI().post("/instructor/routines/create", routineData);
  }
  getDashboardData() {
    return ProtectedAPI().get("/instructor/dashboard-data");
  }
  getYourRoutines() {
    return ProtectedAPI().get("/instructor/routines");
  }
  getYourClients() {
    return ProtectedAPI().get("/instructor/clients");
  }
  getWorkouts(routineId) {
    return ProtectedAPI().get(`/instructor/routines/workouts/${routineId}`);
  }
  createWorkout(workoutData) {
    return ProtectedAPI().post(
      "/instructor/routines/create/workout",
      workoutData
    );
  }
  getRoutine(routineId) {
    return ProtectedAPI().get(`/instructor/routines/${routineId}`);
  }
  getAllExercises() {
    return ProtectedAPI().get("/instructor/exercises");
  }
  addExerciseToWorkout(recordData) {
    return ProtectedAPI().post("/instructor/routines/add/exercise", recordData);
  }
  editClient(clientId, clientData) {
    return ProtectedAPI().patch(
      `/instructor/edit/client/${clientId}`,
      clientData
    );
  }
  createMealPlan(mealPlanData) {
    return ProtectedAPI().post("/instructor/meal-plan/create", mealPlanData);
  }
  deleteExerciseFromWorkout(id) {
    return ProtectedAPI().delete(`/instructor/routines/delete/exercise/${id}`);
  }
}

export default new InstructorAPI();
