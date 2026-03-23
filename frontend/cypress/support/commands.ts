// Custom Cypress commands for vivero-online E2E tests

// Example: cy.login(email, password)
Cypress.Commands.add('login' as any, (email: string, password: string) => {
  cy.request('POST', '/api/auth/login', { email, password }).then(
    (response) => {
      expect(response.status).to.eq(200);
    },
  );
});
