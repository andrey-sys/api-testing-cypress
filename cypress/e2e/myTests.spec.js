///<reference types = "cypress"/>




describe('Test with backend', ()=>{

    beforeEach('login to thr app', ()=>{

      
        //to implement new tags in our test by using json file from tags.json
        cy.intercept('GET', '**/tags', {fixture: 'tags.json'})
        cy.loginToApp()
    })

    it.skip('prototype test', ()=>{
        cy.log('YUUUUHHHUUUAAAA!!!!!')
    })

    it.only('verify request and response', ()=>{

        //creating the server and initialize it with route, provide the parameters, type of your request
        // and the API point that you are listening to, then you save this object to cypress alias
        // using 'as' command  

    
        cy.intercept('POST','**/articles').as('postArticles')

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

        
        })

        // cy.deleteArticleAfterCteation()

    })
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
})