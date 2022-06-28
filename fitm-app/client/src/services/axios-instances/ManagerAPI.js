import ProtectedAPI from "./ProtectedAPI";

class ManagerAPI {
    getNewManager(userId) {
        return ProtectedAPI().get(`/manager/${userId}`);
    }
}

export default new ManagerAPI();