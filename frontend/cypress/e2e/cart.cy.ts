/**
 * E2E tests for Cart functionality
 */
describe('Cart', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.login('test@example.com', 'password123')
  })

  it('should add product to cart', () => {
    cy.waitForApi('/api/products')
    
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Agregar al Carrito').click()
    })
    
    // Verify cart count updates
    cy.get('[data-testid="cart-count"]').should('contain', '1')
  })

  it('should display cart page with items', () => {
    // Add item to cart first
    cy.addToCart(1)
    
    // Navigate to cart
    cy.visit('/cart')
    
    // Verify cart items are displayed
    cy.get('[data-testid="cart-item"]').should('exist')
  })

  it('should update item quantity in cart', () => {
    cy.addToCart(1)
    cy.visit('/cart')
    
    // Increase quantity
    cy.get('[data-testid="quantity-increase"]').first().click()
    
    // Verify quantity updated
    cy.get('[data-testid="cart-item-quantity"]').first().should('contain', '2')
  })

  it('should remove item from cart', () => {
    cy.addToCart(1)
    cy.visit('/cart')
    
    // Remove item
    cy.get('[data-testid="remove-item"]').first().click()
    
    // Verify item removed
    cy.get('[data-testid="cart-item"]').should('not.exist')
    cy.contains('Carrito vacío').should('be.visible')
  })
})

