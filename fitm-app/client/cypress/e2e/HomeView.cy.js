// https://docs.cypress.io/api/introduction/api.html

describe("End-to-end Test Home Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Should find h1 tag content and main buttons token", () => {
    cy.contains("h1", "Start your adventure now");

    cy.get("#buttons button").first().should("have.text", "Gyms");

    cy.get("#buttons button").last().should("have.text", "Instructors");
  });

  it("Should redirect to All Gyms Page", () => {
    cy.get("#buttons button").first().click();
  });
});
