///<reference types = "cypress"/>


describe('Test with backend', ()=>{

    beforeEach('login to thr app', ()=>{

      
        //to implement new tags in our test by using json file from tags.json
        cy.intercept('GET', '**/tags', {fixture: 'tags.json'})

        // REPLACED BY HEADLESS AUTHORIZATION
        // cy.loginToApp()

        //modified login by headless authorization(by using token from storage)
        cy.loginToAppByHeadlessAuthorization()
    })

    it('verify request and response', ()=>{

        //creating the server and initialize it with route, provide the parameters, type of your request
        // and the API point that you are listening to, then you save this object to cypress alias
        // using 'as' command  

    
        cy.intercept('POST','**/articles',{statusCode: 200}).as('postArticles')

        //cy.intercept('POST', '/articles').as('postArticles') // not working
        
        cy.contains(' New Article ').click()
        cy.get('[formcontrolname="title"]').type('This is Article Title')
        cy.get('[formcontrolname="description"]').type('Article Description')
        cy.get('[formcontrolname="body"]').type('Article Body')
        cy.get('[placeholder="Enter tags"]').type('Article tag')
        cy.contains(' Publish Article ').click()

        
        //have to use wait to get full response from the server
        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr =>{
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('Article Body')
            expect(xhr.request.body.article.description).to.eq('Article Description')
            expect(xhr.state).to.eq('Complete')
            expect(xhr.setLogFlag.length).to.eq(1)
            expect(xhr.responseWaited).to.eq(true)
        
        })

        // cy.deleteArticleAfterCteation()

    })
    // replace curent tags by adding 3 other tags from tags.js and verify it
    it('tags testing', ()=>{

        cy.get('.tag-list').should('contain', 'cypress').and('contain','automation').and('contain','testing')

     })

     it('mocking the articles from global feed', ()=>{

        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":0} )
        cy.intercept('GET', '**/articles*', {fixture: 'articles.json'} )

        cy.contains(' Global Feed ').click()
        cy.get('app-article-list button').then(listOfButtons =>{
            expect(listOfButtons[0]).to.contain('3057')
            expect(listOfButtons[1]).to.contain('1')
            expect(listOfButtons[2]).to.contain('1')

            //modify the articles.json file for testing the click the like button on second article
            cy.fixture('articles').then( file =>{
                const articleLink = file.articles[1].slug
                cy.intercept('POST', '**/articles/'+articleLink+'/favorite', file)
            })

            cy.get('app-article-list button').eq(1).click().should('contain','2')

        })



     })
     


     //test API with cypress
     //Check with the API whether the article was correctly defined and if so - delete the article.
     it('create new article, verify with api and delete', ()=>{

        //to take all necessary parameters for login, we can simulate same process
        // through the postman and take all parameters 

        //create the credentials of the user as variable object exactly as request from the postman(by performing copy/paste )

        // REPLACED BY HEADLESS AUTHORIZATION
        // const userCredentials = {
        //     "user": {
        //         "email": "andrewscottt@gmail.com",
        //         "password": "cypresstest1"
        //     }
        // }

        //create the article of the user object as parameter exactly as request from the postman
        const bodyRequestArticle = {
            "article": {
                "tagList": [],
                "title": "fucking request from fucking api",
                "description": "api testing is suck",
                "body": "angular and yarn is shit"
            }
        }

        //login with credentials with request method, by using the response body(its) and then we take the 
        //body response that have the token

        // REPLACED BY HEADLESS AUTHORIZATION
        // cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
        // .its('body').then(body =>{
        //     const token = body.user.token

        cy.get('@token').then(token => {

            //make the post request with articke
            //create object as parameter because we need pass to the headers as we did it in postman

            cy.request({
                url: Cypress.env('apiUrl')+'api/articles/',
                headers: { 'Authorization': 'Token '+token},
                method: 'POST',
                body: bodyRequestArticle

            }).then(response => {
                expect(response.status).to.equal(200)
            })

           cy.deleteFirstArticle()
           cy.wait(3000)

            //verify that we dont have the article in list by comparing the title
            cy.request({
                url: Cypress.env('apiUrl')+'api/articles?limit=10&offset=0',
                headers: { 'Authorization': 'Token '+token},
                method: 'GET'

            }).its('body').then(body=>{
                console.log(body)
                expect(body.articles[0].title).not.to.equal('fucking request from fucking api')
            })

        })

     })

})