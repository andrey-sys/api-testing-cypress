/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


//login by using Headless Authorization
Cypress.Commands.add('loginToAppByHeadlessAuthorization', ()=>{

    const userCredentials = {
        "user": {
            "email": "andrewscottt@gmail.com",
            "password": "cypresstest1"
        }
    }

    cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
        .its('body').then(body =>{
            const token = body.user.token

            //creating the alias token(can use it like @token in tests)
            cy.wrap(token).as('token')
            //set token before entering the site by setting the token into local storage
            cy.visit('/', {
                onBeforeLoad (win){
                    win.localStorage.setItem('jwtToken', token)
                }
            })
        })

})

//usual login 
// Cypress.Commands.add('loginToApp', () =>{
//     cy.visit('/login')
//     cy.get('[placeholder="Email"]').type('andrewscottt@gmail.com')
//     cy.get('[placeholder="Password"]').type('cypresstest1')
//     cy.get('form').submit()
    
// })

Cypress.Commands.add('deleteFirstArticle', ()=>{

    cy.contains('Global Feed').click()
    cy.get('.article-preview').first().click()
    cy.get('.article-actions').contains(' Delete Article ').click()
    
    
})