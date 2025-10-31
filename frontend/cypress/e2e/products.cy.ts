/**
 * E2E tests for Products Page
 */
describe('Products Page', () => {
  beforeEach(() => {
    cy.visit('/products')
  })

  it('should display products page', () => {
    cy.contains('Productos').should('be.visible')
  })

  it('should filter products by category', () => {
    cy.waitForApi('/api/products')
    
    // Select category filter
    cy.get('[data-testid="category-filter"]').select('electronics')
    
    // Wait for filtered results
    cy.waitForApi('/api/products?category=electronics')
    
    // Verify products are filtered
    cy.get('[data-testid="product-card"]').should('exist')
  })

  it('should search products', () => {
    cy.waitForApi('/api/products')
    
    // Type in search box
    cy.get('[data-testid="search-input"]').type('laptop')
    
    // Wait for search results (debounced)
    cy.wait(600)
    cy.waitForApi('/api/products/search?q=laptop')
    
    // Verify search results
    cy.get('[data-testid="product-card"]').should('exist')
  })

  it('should paginate products', () => {
    cy.waitForApi('/api/products')
    
    // Click next page
    cy.get('[data-testid="pagination-next"]').click()
    
    // Wait for page 2
    cy.waitForApi('/api/products?page=2')
    
    // Verify pagination
    cy.get('[data-testid="pagination"]').should('contain', '2')
  })
})

