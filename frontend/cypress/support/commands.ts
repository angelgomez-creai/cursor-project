/// <reference types="cypress" />

/**
 * Custom Cypress commands
 */

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login user
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>

      /**
       * Custom command to add product to cart
       * @example cy.addToCart(1)
       */
      addToCart(productId: number): Chainable<void>

      /**
       * Custom command to wait for API response
       * @example cy.waitForApi('/api/products')
       */
      waitForApi(endpoint: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('auth_token', response.body.token)
  })
})

Cypress.Commands.add('addToCart', (productId: number) => {
  cy.request({
    method: 'POST',
    url: '/api/cart',
    body: { productId, quantity: 1 },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  })
})

Cypress.Commands.add('waitForApi', (endpoint: string) => {
  cy.intercept('GET', endpoint).as('apiCall')
  cy.wait('@apiCall')
})

export {}

