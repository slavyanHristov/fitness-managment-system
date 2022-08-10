// https://docs.cypress.io/api/introduction/api.html
import { admin } from "../../src/mocks/mockData";

describe("End-to-end Test Sign In Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("should sign in user with correct credentials", () => {
    cy.get("form").within(() => {
      cy.get("input[id='username']").type(admin.username);
      cy.get("input[id='password']").type(admin.password);
      cy.get("button").should("have.text", "Sign in").click();
    });
  });

  it("should type wrong credentials and show error messages", () => {
    cy.get("form").within(() => {
      cy.get("input[id='username']").type("wrong_username");
      cy.get("input[id='password']").type("pass");
      cy.get("button").should("have.text", "Sign in").click();
      cy.contains("div", "Username or password doesn't match!");
    });
  });
});
