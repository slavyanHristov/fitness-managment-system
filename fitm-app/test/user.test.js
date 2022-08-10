const { findUserType } = require("../src/controllers/user.controller");

jest.mock("../src/models/user.model.js", () => () => {
  const SequelizeMock = require("sequelize-mock");
  const dbMock = new SequelizeMock();
  return dbMock.define("user", {
    id: 44,
    username: "blink_12",
    password: "myPass_123",
    email: "some_email@example.com",
    isFinalized: 1,
    userTypeId: 1,
    imageId: 1,
    createdAt: "2022-08-08 18:19:20",
    updatedAt: "2022-08-08 18:19:20",
  });
});
jest.mock("../src/models/user_type.model.js", () => () => {
  const SequelizeMock = require("sequelize-mock");
  const dbMock = new SequelizeMock();
  return dbMock.define("user_type", {
    id: 1,
    name: "admin",
  });
});

describe("Test Sequelize Mocking", () => {
  it("Should get value from mock", async () => {
    const user_type = await findUserType(1);
    expect(user_type.id).toEqual(1);
  });
});
