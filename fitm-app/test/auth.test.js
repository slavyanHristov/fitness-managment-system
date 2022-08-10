const createServer = require("../src/app");
const dbOperations = require("../src/utils/db-operations");
const supertest = require("supertest");
const { adminPayload } = require("./mocks/mockData");
// const db = require("../src/models");
const app = createServer();

// const User_Type = db.user_type;

describe("Test admin registration.", () => {
  beforeAll(async () => {
    await dbOperations.syncWithDB();
  });

  test("should register an admin", async () => {
    await supertest(app)
      .post("/api/register/users/admin")
      .send(adminPayload)
      .expect(201);
  });

  describe("Test admin login.", () => {
    test("should login admin and access protected admin route", async () => {
      const username = adminPayload.username;
      const rememberUser = false;
      const password = adminPayload.password;
      const { body, statusCode } = await supertest(app)
        .post("/api/auth/login")
        .send({ username, rememberUser, password });
      expect(statusCode).toBe(200);

      await supertest(app)
        .get("/api/admin/dashboard-data")
        .expect(200)
        .set("authorization", `Bearer ${body.accessToken}`);
    });
  });
  describe("Test protected route if given access token is invalid.", () => {
    const invalidToken = "MyINvalidToken123";

    test("route shouldn't be accessed", async () => {
      const response = await supertest(app)
        .get("/api/admin/dashboard-data")
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
