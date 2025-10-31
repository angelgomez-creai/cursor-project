/**
 * E2E tests for Home Page
 */
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load home page successfully', () => {
    cy.contains('E-commerce').should('be.visible')
  })

  it('should display products list', () => {
    // Wait for products to load
    cy.waitForApi('/api/products')
    cy.get('[data-testid="product-card"]').should('exist')
  })

  it('should navigate to product detail on card click', () => {
    cy.waitForApi('/api/products')
    
    // Click first product card
    cy.get('[data-testid="product-card"]').first().click()
    
    // Should navigate to product detail
    cy.url().should('include', '/products/')
  })

  it('should add product to cart', () => {
    cy.waitForApi('/api/products')
    
    // Click add to cart button
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Agregar al Carrito').click()
    })
    
    // Should show success message
    cy.contains('Producto agregado').should('be.visible')
  })
})

