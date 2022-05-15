const createServer = require("../src/app");
const dbOperations = require("../src/utils/db-operations");
const supertest = require("supertest");
const db = require("../src/models");
const app = createServer();

const User_Type = db.user_type;

const adminPayload = {
  username: "admin_13",
  password: "myPass_123",
  email: "admin3@example.com",
  userTypeId: 1,
};

describe("Test admin registration.", () => {
  beforeAll(async () => {
    await dbOperations.syncWithDB();
  });

  test("should register an admin", async () => {
    await User_Type.create({ name: "admin" });

    await supertest(app)
      .post("/api/users/admin")
      .send(adminPayload)
      .expect(200);
  });

  describe("Test admin login.", () => {
    test("should login admin and access protected admin route", async () => {
      const username = adminPayload.username;
      const password = adminPayload.password;
      const { body, statusCode } = await supertest(app)
        .post("/api/users/login")
        .send({ username, password });
      expect(statusCode).toBe(200);

      await supertest(app)
        .get("/api/test/admin")
        .expect(200)
        .set("authorization", `Bearer ${body.accessToken}`);
    });
  });
  describe("Test protected route if given access token is invalid.", () => {
    const invalidToken = "MyINvalidToken123";

    test("route shouldn't be accessed", async () => {
      const response = await supertest(app)
        .get("/api/test/admin")
        .expect(401)
        .set("authorization", `Bearer ${invalidToken}`);
      expect(response.body).toMatchObject({
        success: false,
        message: "Unauthorized!",
      });
    });
  });

  afterAll(async () => {
    await dbOperations.closeConnection();
  });
});
