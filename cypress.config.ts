import { defineConfig } from 'cypress'

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}', // ofr using another format: spec data js
    excludeSpecPattern: ['**/1-getting-started/*','**/2-advanced-examples/*'] // hide from the runner to ececute those folders

  },
  //if the test is failed, the retries will be performed
  retries: {
    runMode: 2,
    openMode: 1,
  },
  env: {
    username: 'andrewscottt@gmail.com',
    password: 'cypresstest1',
    apiUrl: 'https://api.realworld.io/'
  }
  
})
