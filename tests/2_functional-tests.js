const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test("Solve a puzzle with valid puzzle string", function (done) {

        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.." })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, "769235418851496372432178956174569283395842761628713549283657194516924837947381625")
                done();
            })
    })


    test("Solve a puzzle with missing puzzle string", function (done) {

        chai.request(server)
            .post("/api/solve")
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Required field missing")
                done();
            })
    })

    test("Solve a puzzle with invalid characters", function (done) {

        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: "G.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.." })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid characters in puzzle")

                done();
            })
    })

    test("Solve a puzzle with incorrect length", function (done) {

        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: ".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.." })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long")

                done();
            })
    })

    test("Solve a puzzle that cannot be solved", function (done) {

        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.." })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Puzzle cannot be solved")

                done();
            })
    })


    test("Check a puzzle placement with all fields", function (done) {

        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A1",
                value: 1
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, true)
      

                done();
            })
    })

    test("Check a puzzle placement with single placement conflicts", function (done) {

        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A1",
                value: 6
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false)
                assert.include(res.body.conflict,"column")


                done();
            })
    })

    
    test("Check a puzzle placement with multiple placement conflicts", function (done) {

        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A1",
                value: 4
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false)
                assert.include(res.body.conflict,"column")
                assert.include(res.body.conflict,"region")

                done();
            })

    })
    test("Check a puzzle placement with all placement conflicts", function (done) {

        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A1",
                value: 5
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false)
                assert.include(res.body.conflict,"column")
                assert.include(res.body.conflict,"region")
                assert.include(res.body.conflict,"row")

                done();
            })
    })

    test("Check a puzzle placement with missing required fields", function (done) {

        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A1"              
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Required field(s) missing")
              
                done();
            })
    })

    test("Check a puzzle placement with invalid characters", function (done) {

        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "1.9..5.1.85.f4...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A1",
                value:4             
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid characters in puzzle")
              
                done();
            })
    })
    
    test("Check a puzzle placement with incorrect length", function (done) {

        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "1.9..5.1.85.224...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A1",
                value:4            
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
              
                done();
            })
    })
    test("Check a puzzle placement with invalid placement coordinate", function (done) {

        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "AG",
                value:4           
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid coordinate")
              
                done();
            })
    })

    test("Check a puzzle placement with invalid placement value", function (done) {

        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A1",
                value:"g"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid value")
              
                done();
            })
    })
});
