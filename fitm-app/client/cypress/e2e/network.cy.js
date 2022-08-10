/// <reference types="cypress" />

describe("Network Requests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("shoud make an XHR request", () => {
    cy.request("http://localhost:5000/api/fullAccess/data-count").should(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("success").and.be.true;
      }
    );
  });
});
