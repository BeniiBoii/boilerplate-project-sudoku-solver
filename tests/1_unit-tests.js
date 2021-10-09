const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let validPuzzle ="..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
let invalidPuzzle ="1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
let invalidCharachters ="G.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
let invalidlength =".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";


suite('UnitTests', () => {

    test("Logic handles a valid puzzle string of 81 characters",function(){
        assert.equal(solver.validate(validPuzzle),true)
    })

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)",function(){
        assert.equal(solver.validate(invalidCharachters).error,'Invalid characters in puzzle')
    })

    test("Logic handles a puzzle string that is not 81 characters in length",function(){
        assert.equal(solver.validate(invalidlength).error, 'Expected puzzle to be 81 characters long' )
    })
    test("Logic handles a valid row placement",function(){
        assert.equal(solver.checkRowPlacement(validPuzzle,'A',1,4),false)
    })
    test("Logic handles an invalid row placement",function(){
        assert.equal(solver.checkRowPlacement(validPuzzle,'A',1,9),true)
    })
    test("Logic handles a valid column placement",function(){
        assert.equal(solver.checkColPlacement(validPuzzle,'A',1,3),false)
    })
    test("Logic handles an invalid column placement",function(){
        assert.equal(solver.checkColPlacement(validPuzzle,'A',1,8),true)
    })
    test("Logic handles a valid region (3x3 grid) placement",function(){
        assert.equal(solver.checkRegionPlacement(validPuzzle,'A',1,7),false)
    })
    test("Logic handles an invalid region (3x3 grid) placement",function(){
        assert.equal(solver.checkRegionPlacement(validPuzzle,'A',1,8),true)
    })
    test("Valid puzzle strings pass the solver",function(){
        assert.isString(solver.solve(validPuzzle))
    })

    test("Invalid puzzle strings fail the solver",function(){
        assert.equal(solver.solve(invalidPuzzle),false)
    })

    test("Solver returns the expected solution for an incomplete puzzle",function(){
        assert.equal(solver.solve(validPuzzle),"769235418851496372432178956174569283395842761628713549283657194516924837947381625")
    })

});
