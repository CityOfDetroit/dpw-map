describe('Test map functionality', () => {
    it('successfully loads', () => {
      cy.visit('/') // change URL to match your dev URL
      cy.contains('Find My Home:')
    })

    it('test map click', () => {
      cy.visit('/') // change URL to match your dev URL
      cy.contains('Find My Home:')
      cy.get('#map').click('center')
      cy.wait(3000)
      cy.contains('PROVIDER')
    })

    it('enter address in geocoder', () => {
      cy.visit('/') // change URL to match your dev URL
      cy.contains('Find My Home:')
      cy.get('#geocoder input').type('1104 military{enter}')
      cy.wait(3000)
      cy.get('.panel-box h2').contains('1104 MILITARY, 48209')
    })
})