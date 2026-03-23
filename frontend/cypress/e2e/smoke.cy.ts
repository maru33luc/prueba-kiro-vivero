// Smoke test — verifies Cypress is configured correctly
describe('Smoke test', () => {
  it('should load the application', () => {
    cy.visit('/');
    cy.url().should('include', '/catalog');
  });
});
