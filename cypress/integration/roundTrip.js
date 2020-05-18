/// <reference types="Cypress" />
//Import required Page Object classes
import pageHome from '../pageObjects/pageHome.js'
const objHome = new pageHome();

//I try to make this test fully Data Driven
describe('Test https://www.kayak.com/flights', () => {

    it.only('Test Round Trip scenario', function () {
        //Automation
        //Read All data from Fixture file and on based on that data complete execution will be done
        cy.fixture('TestData').then((data) => {

            for (const x in data) {
                //Invode the server for XHR controls 
                cy.server()
                cy.route('POST', '/vs/flight/frontdoor/unknown/googleyolo/retryLoad').as('retryLoad')
                cy.route('POST', '/s/vestigo/v1/measure').as('measure')
                cy.log("visit kayak.com/flights")
                cy.clearCookies()
                cy.clearLocalStorage()
                objHome.visit()
                cy.wait('@retryLoad')

                cy.log("type origin input")
                //qery XHR will abort due to speed of type, this is applicatin behaviour we can resolve is with delay in type using {delay:500}. Not using this as I need speed in my tests
                //query XHR
                cy.route('GET', '/mv/marvel?f=j&where=' + data[x].OriginInput + '&s=13&lc_cc=US&lc=en&v=v1&cv=5').as('queryResult')
                objHome.originInput(data[x].OriginInput)
                //wait xhr to complete and Return the Statu code 200
                cy.wait('@queryResult').its('status').should('be', 200)
                cy.log("select list value")
                objHome.listSelection(data[x].OriginSelection)
                cy.log("type destination input")
                //query XHR
                cy.route('GET', '/mv/marvel?f=j&where=' + data[x].DestinationInput + '&s=58&lc_cc=US&lc=en&v=v1&cv=5').as('queryResultD')
                objHome.destinationInput(data[x].DestinationInput)
                //wait xhr to complete and Return the Statu code 200
                cy.wait('@queryResultD').its('status').should('be', 200)
                cy.log("select list value")
                objHome.listSelection(data[x].DestinationSelection)
                cy.log("add departure date")
                objHome.departureDate(data[x].Departure)
                cy.log("add arival date")
                objHome.arrivalDate(data[x].Arrival)
                cy.log("open passengers list")
                objHome.passengersInputlist()
                cy.log("add adults passengers")
                objHome.passengersInput(data[x].Passengers.Adults, "Adults")
                cy.wait('@measure')
                cy.log("add seniors passengers")
                objHome.passengersInput(data[x].Passengers.Seniors, "Seniors")
                cy.wait('@measure')
                cy.log("add youth passengers")
                objHome.passengersInput(data[x].Passengers.Youth, "Youth")
                cy.wait('@measure')
                cy.log("add child passengers")
                objHome.passengersInput(data[x].Passengers.Child, "Child")
                cy.wait('@measure')
                cy.log("add seat Infant passengers")
                objHome.passengersInput(data[x].Passengers.SeatInfant, "Seat Infant")
                cy.wait('@measure')
                cy.log("add lap Infant passengers")
                objHome.passengersInput(data[x].Passengers.LapInfant, "Lap Infant")
                cy.wait('@measure')
                objHome.submit()

                //Testing
                //Im adding all test Assertion here due to better visibility on assertions etc we can move this as page object or as cypress comands
                /*
                 check the Cheapest, Best and Quickest sort options are visible by default and the price shown in the 
                 cheapest option is <= other two and time shown in Quickest option is also <= other two
                 
                 At the momment During Automation nothing Return in BEST prices section Ignoring that.
                */
                //check the Cheapest, Best and Quickest sort options are visible
                //check the Cheapest optio is visible
                cy.get("a[data-code='price']").eq(0).should('be.visible')
                //check the Best option is visible
                cy.get("a[data-code='bestflight']").should('be.visible')
                //check the Quickest option is visible
                cy.get("a[data-code='duration']").eq(0).should('be.visible')

                //price shown in the cheapest option is <= other two and time shown in Quickest option is also <= other two
                cy.xpath("//a[@data-code='price']//span[contains(@class,'price')]").invoke('text').then(text => {
                    let cheapestPrice = text.replace(/[^0-9\.]+/g, "");
                    cheapestPrice = Number(cheapestPrice)
                    cy.xpath("//a[@data-code='duration']//span[contains(@class,'price')]").invoke('text').then(text => {
                        let quickestPrice = text.replace(/[^0-9\.]+/g, "");
                        quickestPrice = Number(quickestPrice)
                        assert.isAtMost(cheapestPrice, quickestPrice, 'Cheapest price should equal or les than quickest price')

                    })

                })

                cy.xpath("//a[@data-code='price']//span[contains(@class,'duration')]").invoke('text').then(cheapesttime => {

                    cy.xpath("//a[@data-code='duration']//span[contains(@class,'duration')]").invoke('text').then(quickesttime => {
                        if (quickesttime <= cheapesttime) {
                            cy.log('quickesttime is less or equal to cheapesttime')

                        } else {
                            assert.isOk(false, 'quickesttime must be less or equal to cheapesttime');
                        }

                    })

                })

            }
        })
    })
})