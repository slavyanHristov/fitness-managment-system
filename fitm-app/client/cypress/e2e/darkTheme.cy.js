// https://docs.cypress.io/api/introduction/api.html

describe("End-to-end Test Home Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("should check local storage for dark-mode key-value pair", () => {
    cy.get("#theme-toggler")
      .click()
      .should(() => {
        expect(localStorage.getItem("dark-mode")).to.eq("true");
      });

    cy.clearLocalStorage("dark-mode").should((ls) => {
      expect(ls.getItem("dark-mode")).to.be.null;
    });
  });
});
