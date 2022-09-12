const managerService = require("../services/managerService");
const { flatten } = require("../utils");

exports.getAssignedGyms = async (req, res) => {
  const managerId = req.params.managerId;
  try {
    if (!managerId) {
      return res.status(404).json({
        success: false,
        message: "Manager not found!",
      });
    }
    const managedGyms = await managerService.getAssignedGyms(managerId);
    return res.status(200).json({
      success: true,
      managedGyms,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get all employees associated with your gyms --------------
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await managerService.getAllEmployees(req.managerId);
    return res.status(200).json({
      success: true,
      collection: employees,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};
// -------------- Get single employee associated with your gyms --------------

exports.getOneEmployee = async (req, res) => {
  const employeeId = req.params.id;
  try {
    const foundEmployee = await managerService.getOneEmployee(req.managerId);
    return res.status(200).json({
      success: true,
      message: "Employee has been found!",
      foundEmployee,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Delete single instructor associated with your gym --------------
exports.deleteEmployee = async (req, res) => {
  const employeeId = req.params.id;

  if (!employeeId) {
    return res.status(400).json({
      success: false,
      message: "Provide employee id!",
    });
  }
  try {
    await managerService.deleteEmployee(employeeId, req.managerId);
    return res.status(200).json({
      success: true,
      message: "Employee has been deleted!",
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Update single instructor associated with your gym --------------

exports.updateEmployee = async (req, res) => {
  const employeeId = req.params.id;
  try {
    const updatedEmployee = await managerService.updateEmployee(
      req.managerId,
      employeeId,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: "Employee updated successfully!",
      updatedEmployee,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get all clients associated with your gym --------------

exports.getAllClients = async (req, res) => {
  try {
    const clientsInGym = await managerService.getAllClients(req.managerId);

    return res.status(200).json({
      success: true,
      message: "Clients have been found!",
      clientsInGym,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get single client associated with your gym --------------

exports.getOneClient = async (req, res) => {
  const clientId = req.params.id;

  try {
    const clientInGyms = await managerService.getOneClient(
      clientId,
      req.managerId
    );
    return res.status(200).json({
      success: true,
      message: "Client has been found!",
      clientInGyms,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getManager = async (req, res) => {
  const userId = req.params.userId;

  try {
    const manager = await managerService.getManager(userId);
    return res.status(200).json({
      success: true,
      manager,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const {
      userData,
      employeeCount,
      membershipCount,
      memberships,
      yourGyms,
      gymImage,
    } = await managerService.getDashboardData(req.id, req.managerId);

    return res.status(200).json({
      success: true,
      userData: userData,
      employeeCount: employeeCount,
      membershipCount: membershipCount,
      memberships: flatten.flattenArrayObjects(memberships),
      myGyms: yourGyms,
      gymImage: gymImage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
