// https://docs.cypress.io/api/introduction/api.html
import { client, authClient } from "../../src/mocks/mockData";

// describe("End-to-end Client Registration", () => {
//   beforeEach(() => {
//     cy.visit("http://localhost:3000/register");
//   });
//   it("should register a client if doesn't exists", () => {
//     cy.get("form").within(() => {
//       cy.get("input[id='name']").type(client.name);
//       cy.get("input[id='username']").type(client.username);
//       cy.get("input[id='email']").type(client.email);
//       cy.get("input[id='password']").type(client.password);
//       cy.get("input[id='confirmPassword']").type(client.confirmPassword);
//       cy.get("button").should("have.text", "Next").click();

//       cy.get("input[id='age']").type(client.age);
//       cy.get("input[id='height']").type(client.height);
//       cy.get("input[id='weight']").type(client.weight);
//       cy.get("input[id='Male']").check().should("be.checked");
//       cy.get("#buttons button").first().should("have.text", "Next").click();

//       cy.get("select[name='fitnessGoal']").select(0);
//       cy.get("select[name='fitnessLevel']").select(1);
//       cy.get("select[name='activityLevel']").select(2);
//       cy.get("#buttons button").first().should("have.text", "Next").click();

//       cy.get("input[id='country']").type(client.country);
//       cy.get("input[id='city']").type(client.city);
//       cy.get("input[id='address']").type(client.address);
//       cy.get("input[id='phone']").type(client.phone);
//       cy.get("#buttons button").first().should("have.text", "Submit").click();
//     });
//   });
// });

describe("Hire instructor for client", () => {
  it("should login client", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("form").within(() => {
      cy.get("input[id='username']").type(authClient.username);
      cy.get("input[id='password']").type(authClient.password);
      cy.get("button").should("have.text", "Sign in").click();
    });
    cy.wait(2000);
    cy.visit("http://localhost:3000/client/mealPlan");
    cy.intercept(
      "POST",
      "http://localhost:5000/api/client/mealPlan/add/food"
    ).as("addFood");
    cy.get("button p").first().should("have.text", "Add Food").click();
    cy.get("input[id='quantity']").clear().type("2");
    cy.get("tbody tr").first().click();
    cy.wait("@addFood").should(({ request, response }) => {
      expect(request.body).to.have.property("foodId");
      expect(response && response.body).to.have.property("success", true);
    });
  });
});
