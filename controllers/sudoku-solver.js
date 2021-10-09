function getCords(value) {
  const CordConverterObject = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5,
    "G": 6,
    "H": 7,
    "I": 8,

  }
  return CordConverterObject[value];
}
function getRegion(cord) {
  let regionCords = [];
  if (cord.length < 2) {
    return "smaller then two";
  }
  let row = cord.split("")[0];

  let column = cord.split("")[1]
  if (row == "A" || row == "B" || row == "C") {
    regionCords.push(["A", "B", "C"])
  }
  if (row == "D" || row == "E" || row == "F") {
    regionCords.push(["D", "E", "F"])
  }
  if (row == "G" || row == "H" || row == "I") {
    regionCords.push(["G", "H", "I"])
  }
  if (column == 1 || column == 2 || column == 3) {
    regionCords.push([1, 2, 3])
  }
  if (column == 4 || column == 5 || column == 6) {
    regionCords.push([4, 5, 6])
  }
  if (column == 7 || column == 8 || column == 9) {
    regionCords.push([7, 8, 9])
  }
  return regionCords;
}

class SudokuSolver {

  validate(puzzleString) {
    let initialPuzzle = puzzleString;
    if (initialPuzzle.length != 81) {

      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (initialPuzzle.replace(/[0-9.]/g, "").length > 0) {

      return { error: 'Invalid characters in puzzle' };
    }
    return true;

  }
  checkRowPlacement(puzzleString, row, column, value) {

    let boardString = "";
    let board = [];
    let actualRow = getCords(row);
    let actualColumn = column - 1;
    for (let i = 0; i < puzzleString.length; i += 9) {
      board.push(puzzleString.substring(i, i + 9).split(''));
    }
    if (board[actualRow].includes(value.toString()) && value != board[actualRow][actualColumn]) {
      return true;
    }
    return false;
  }

  checkColPlacement(puzzleString, row, column, value) {

    let boardString = "";
    let board = [];
    let actualRow = getCords(row);
    let actualColumn = column - 1;
    let columnValues = [];
    for (let i = 0; i < puzzleString.length; i += 9) {
      board.push(puzzleString.substring(i, i + 9).split(''));
    }
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (j == actualColumn && board[actualRow][actualColumn] != value) {
          columnValues.push(board[i][j])
        }

      }

    }
    if (columnValues.includes(value.toString()) && value != board[actualRow][actualColumn]) {
      return true;
    }
    return false;
  }
  checkRegionPlacement(puzzleString, row, column, value) {
    let boardString = "";
    let board = [];
    let actualRow = getCords(row);
    let actualColumn = column - 1;
    let columnValues = [];
    let regionCords = getRegion(row + "" + column);
    let cordsArray = [];
    let regionValues = [];
    for (let i = 0; i < puzzleString.length; i += 9) {
      board.push(puzzleString.substring(i, i + 9).split(''));
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        cordsArray.push(regionCords[0][i] + "" + regionCords[1][j])
      }
    }
    for (let i = 0; i < cordsArray.length; i++) {
      let rowCord = cordsArray[i].split("")[0];
      let columnCord = parseInt(cordsArray[i].split("")[1])
      regionValues.push(board[getCords(rowCord)][columnCord - 1])
    }
    if (regionValues.includes(value.toString()) && value != board[actualRow][actualColumn]) {
      return true;
    }
    return false;
  }

  solve(puzzleString) {
    let board = [];
    let initialBoard = [];
    let result = false;
    let backward = false;

    let numberToRow = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
    for (let i = 0; i < puzzleString.length; i += 9) {
      board.push(puzzleString.substring(i, i + 9).split(''));
      initialBoard.push(puzzleString.substring(i, i + 9).split(''));
    }
    let row = 0;
    let column = 0;
    let counter = 0;
    while (!result) {
      if (row == 8 && column == 8) {
        result = true;
      }
      counter++;
      if (counter > 5000) {
        return false;
      }
      let value = board[row][column]
      if (board[row][column] == ".") {
        for (let k = 1; k <= 9; k++) {
          let reformedPuzzle = board.join("").replace(/,/g, "");
          if (!this.checkColPlacement(reformedPuzzle, numberToRow[row], column + 1, k) &&
            !this.checkRegionPlacement(reformedPuzzle, numberToRow[row], column + 1, k) &&
            !this.checkRowPlacement(reformedPuzzle, numberToRow[row], column + 1, k)
          ) {
            if (initialBoard[row][column] == ".") {
              board[row][column] = k;
            }
            break;
          }
        }
      } else if (board[row][column] != "." && initialBoard[row][column] == ".") {
        if (board[row][column] == 9) {
          board[row][column] = "."
        } else {
          for (let k = parseInt(board[row][column]) + 1; k <= 9; k++) {
            let reformedPuzzle = board.join("").replace(/,/g, "");
            if (!this.checkColPlacement(reformedPuzzle, numberToRow[row], column + 1, k) &&
              !this.checkRegionPlacement(reformedPuzzle, numberToRow[row], column + 1, k) &&
              !this.checkRowPlacement(reformedPuzzle, numberToRow[row], column + 1, k)
            ) {
              if (initialBoard[row][column] == ".") {
                board[row][column] = k;
              }
              break;
            } else {
              board[row][column] = "."
            }
          }
        }
      }

      if (initialBoard[row][column] != "." && backward) {
        if (column > 0) {
          column--
        } else if (row > 0) {
          row--;
          column = 8;
        }
        backward = true;
      } else if (board[row][column] == ".") {
        if (column > 0) {
          column--
        } else if (row > 0) {
          row--;
          column = 8;
        }
        backward = true;
      } else {
        if (column < 8) {
          column++;
        } else if (row < 8) {
          row++;
          column = 0;
        }
        backward = false;
      }
    }
    let solvedpuzzle = board.join("").replace(/,/g, "")

    return solvedpuzzle;
  }
}

module.exports = SudokuSolver;
