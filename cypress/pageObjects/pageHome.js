/*
Well im adding some UI locaors in single block of as I requires same behaviour in my current use case. As best practice this is not
recommend but Im just reducing my time.

On locators Side I have use many different techniques to Automate in General way and I need many dynamic locators on Run Time.

*/

class pageHome {
    visit() {
        cy.visit('/flights')
    }
    originInput(value) {
        //invote mouseover that will focus the element
        cy.xpath("//div[contains(@id,'origin-airport-display') and @tabindex='0']").eq(0).click()
        cy.get("[name='origin']").eq(0).trigger('mouseover').click()
        //clear existing selection
        cy.xpath("//div[@data-value='LHE']//button").eq(0).click({ force: true })
        //type the value
        cy.xpath("//input[contains(@id,'-origin-airport')]").eq(0).type(value)

    }
    listSelection(value) {
        //pick only apicode and pass as dynamic value for selector
        const apicode = value.replace(/.*\(|\).*/g, '')
        //select option
        cy.get("li[data-apicode='" + apicode + "']").eq(0).trigger('mouseover').click()

    }
    destinationInput(value) {
        //click for the focus 
        cy.xpath("//div[contains(@id,'destination-airport-display') and @tabindex='0']").eq(0).click()
        //pass the destinationInput
        cy.xpath("//input[contains(@id,'-destination-airport')]").eq(0).type(value)

    }
    departureDate(value) {
        cy.get("div[id*='-dateRangeInput-display' ][tabindex='0']").eq(0).click()
        //parr the data and and hit Enter key
        cy.get("div[data-date-group*='travelDates']").eq(6).type("" + value + " {enter}")

    }
    arrivalDate(value) {
        cy.get("div[id*='-dateRangeInput-display' ][tabindex='0']").eq(0).click()
        //parr the data and and hit Enter key
        cy.get("div[data-date-group*='travelDates']").eq(7).type("" + value + " {enter}")

    }
    passengersInputlist() {
        //click and open pessengers list  
        cy.get("[fill='none']").eq(2).click({ force: true })
        //check popup should be visible
        cy.get("div[id*='travelersAboveForm-dialog-cove']").should('be.visible')
    }
    passengersInput(value, key) {
        if (key === 'Adults')
            (
                value = value - 1
            )
        //click on pessenger values based on pessenger type and value
        Cypress._.times(value, () => cy.xpath(".//label[text()='" + key + "']/ancestor::div[@role='listitem']//button[@title='Increment']").eq(1).click())
    }
    submit() {
        //uncheck comparison 
        cy.get("span[role='checkbox']").eq(0).click({ force: true })
        //click on submit button
        cy.get("button[type='submit'][title='Search flights']").eq(0).click({ force: true })
        //wait for redirection and check Email Alert popup shoul visible
        cy.get("div.Flights-Results-FlightPriceAlertDriveBy ").should('be.visible')
    }


}
export default pageHome