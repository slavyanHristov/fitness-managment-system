const flatten = require("../src/utils/flatten");
const { flattenObjectData } = require("./mocks/mockData");

describe("flatten.js", () => {
  it("should parse object in correct format", () => {
    const person = {
      user: {
        id: 1,
        name: "Slavyan Hristov",
        username: "admin_12",
        email: "admin@example.com",
        image: {
          path: "resources/images/default-profile-pic.png",
        },
        userType: {
          userType: "Admin",
        },
      },
    };

    const result = flatten.flattenObject(person);
    expect(result).toStrictEqual(flattenObjectData);
  });
});
