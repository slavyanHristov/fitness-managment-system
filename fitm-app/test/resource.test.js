const supertest = require('supertest')
const createServer = require('../src/app')
const app = createServer()

describe("GET /test/all", () => {
    
    test("should respond with 200 status code", async () => {
        await supertest(app).get('/api/test/all').expect(200)
    })

    test("should respond with 401 status code", async () => {
        await supertest(app).get('/api/test/admin').expect(401)
    })
})