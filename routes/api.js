'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      const {puzzle,value}= req.body;
      // let puzzle = req.body.puzzle;
      // let value = req.body.value;
      let cord = req.body.coordinate;
      let jsonValue = {
        valid: true
      };
      if (!puzzle || !value || !cord) {
        res.json({ error: "Required field(s) missing" })
        return;
      }
      if (solver.validate(puzzle) !== true) {
        res.json(solver.validate(puzzle))
        return;
      }

      if (cord.length <= 0 || cord.length > 2 || !["A", "B", "C", "D", "E", "F", "G", "H", "I"].includes(cord.split("")[0])
        || !["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(cord.split("")[1])) {
        res.json({ error: 'Invalid coordinate' })
        return;
      }

      if (!parseInt(value) || parseInt(value) < 1 || parseInt(value) > 9) {
        res.json({ error: 'Invalid value' });
        return;
      }

      let row = cord.split("")[0];
      let col = cord.split("")[1];

      if (solver.checkColPlacement(puzzle, row, col, value) ||
        solver.checkRowPlacement(puzzle, row, col, value) ||
        solver.checkRegionPlacement(puzzle, row, col, value)) {
        jsonValue.valid = false;
        jsonValue.conflict = []
      }
      if (solver.checkRowPlacement(puzzle, row, col, value)) {
        jsonValue.conflict.push("row")

      }
      if (solver.checkColPlacement(puzzle, row, col, value)) {
        jsonValue.conflict.push("column")
      }
      if (solver.checkRegionPlacement(puzzle, row, col, value)) {
        jsonValue.conflict.push("region")

      }
      res.json(jsonValue);
    });

  app.route('/api/solve')
    .post((req, res) => {

      let puzzle = req.body.puzzle;
      if (puzzle==undefined) {
        res.json({ error: 'Required field missing' })
    
        return;
      }
      if (solver.validate(puzzle) !== true) {
        res.json(solver.validate(puzzle))
        return;
      }
      let result =solver.solve(puzzle);
      if(result==false){
        res.json({ "error": "Puzzle cannot be solved" })
        return;
      }
      res.json({ solution: result });
    });
};
