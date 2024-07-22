/* MADE BY XUTEBOX PLEASE PROVIDE CREDIT IF USING MY CODE */

class Coords {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let waterLocation = [
  new Coords(5, 0),
  new Coords(5, 10),
  new Coords(2, 2),
  new Coords(8, 2),
  new Coords(2, 8),
  new Coords(8, 8),
];
let waterLocationLeft = new Coords(0, 5);
let waterLocationRight = new Coords(10, 5);
let emptyCorners = [
  new Coords(3, 2),
  new Coords(8, 3),
  new Coords(2, 7),
  new Coords(7, 8),
];
let emptySpots = [
  new Coords(5, 2),
  new Coords(5, 4),
  new Coords(5, 6),
  new Coords(5, 8),
];
let potentialLodestone = [
  new Coords(5, 1),
  new Coords(5, 3),
  new Coords(5, 7),
  new Coords(5, 9),
  new Coords(4, 2),
  new Coords(6, 2),
  new Coords(4, 8),
  new Coords(6, 8),
];

let waterSolve; //add both grids to a class - when you want to edit just make two functions for each and then make the operation buttons for each
let leftGridClass;
let rightGridClass;
let leftGrid;
let rightGrid;

const leftSide = document.getElementById("westSide");
const rightSide = document.getElementById("eastSide");

const solutionDisplay = document.getElementById("solutionDisplay");
const restart = document.getElementById("restart");
const leftButton = document.getElementById("westButton");
const lectern = document.getElementById("lectern");
const rightButton = document.getElementById("eastButton");

restart.addEventListener("click", function () {
  Restart();
});

leftButton.addEventListener("click", function () {});

lectern.addEventListener("click", function () {
  swapLodestones();
});

rightButton.addEventListener("click", function () {});

leftSide.addEventListener("click", function (event) {
  if (event.target !== leftSide) {
    const clickedElement = event.target;
    let clickedPosition = Array.from(leftSide.children).indexOf(clickedElement);
    leftGridClass.clicked(clickedPosition, false);
  }
});

leftSide.addEventListener("contextmenu", function (event) {
  event.preventDefault();
  if (event.target !== leftSide) {
    const clickedElement = event.target;
    let clickedPosition = Array.from(leftSide.children).indexOf(clickedElement);
    leftGridClass.clicked(clickedPosition, false);
  }
});

rightSide.addEventListener("contextmenu", function (event) {
  event.preventDefault();
  if (event.target !== rightSide) {
    const clickedElement = event.target;
    let clickedPosition = Array.from(rightSide.children).indexOf(
      clickedElement
    );
    rightGridClass.clicked(clickedPosition, true);
  }
});

rightSide.addEventListener("click", function (event) {
  if (event.target !== rightSide) {
    const clickedElement = event.target;
    let clickedPosition = Array.from(rightSide.children).indexOf(
      clickedElement
    );
    rightGridClass.clicked(clickedPosition, true);
  }
});

class WaterGrid {
  grid;
  constructor() {
    this.grid = new Array(11).fill(null).map(() => new Array(11).fill(null));
  }

  innit(side) {
    if (side) {
      rightSide.innerHTML = "";
      for (let i = 0; i < 121; i++) {
        const div = document.createElement("div");
        div.classList.add("rightTile");
        rightSide.appendChild(div);
      }
    } else {
      leftSide.innerHTML = "";
      for (let i = 0; i < 121; i++) {
        const div = document.createElement("div");
        div.classList.add("leftTile");
        leftSide.appendChild(div);
      }
    }

    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
        let water = false;
        let wall = true;
        let empty = false;
        let canBeLodestone = false;

        for (let tile of waterLocation) {
          if (tile.x === i && tile.y === j) {
            water = true;
            wall = false;
            break;
          }
        }
        for (let tile of emptyCorners) {
          if (side) {
            if (tile.x === j && tile.y === i) {
              empty = true;
              wall = false;
              break;
            }
          } else {
            if (tile.x === i && tile.y === j) {
              empty = true;
              wall = false;
              break;
            }
          }
        }
        for (let tile of emptySpots) {
          if (tile.x === i && tile.y === j) {
            empty = true;
            wall = false;
            break;
          }
        }
        for (let tile of emptySpots) {
          if (tile.x === j && tile.y === i) {
            empty = true;
            wall = false;
            break;
          }
        }
        for (let tile of potentialLodestone) {
          if (tile.x === i && tile.y === j) {
            canBeLodestone = true;
            wall = false;
            break;
          }
        }
        for (let tile of potentialLodestone) {
          if (tile.x === j && tile.y === i) {
            canBeLodestone = true;
            wall = false;
            break;
          }
        }
        this.grid[j][i] = new Tile(false, wall, water, empty, canBeLodestone);
      }
    }
    if (side) {
      this.grid[waterLocationRight.y][waterLocationRight.x].water = true;
      this.grid[waterLocationRight.y][waterLocationRight.x].wall = false;
    } else {
      this.grid[waterLocationLeft.y][waterLocationLeft.x].water = true;
      this.grid[waterLocationLeft.y][waterLocationLeft.x].wall = false;
    }
  }
  updateWater(side) {
    this.resetWater(side);
    const queue = [];

    // Add initial water locations to the queue
    queue.push(...waterLocation);
    if (side) {
      queue.push(waterLocationRight);
    } else {
      queue.push(waterLocationLeft);
    }
    // Run BFS
    while (queue.length > 0) {
      const { x, y } = queue.shift();
      let currentField = this.grid[y][x];

      if (currentField.water) {
        // Check and enqueue neighboring cells
        const directions = [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: -1 },
          { x: 0, y: 1 },
        ];

        for (const direction of directions) {
          const newX = x + direction.x;
          const newY = y + direction.y;
          if (this.isValid(newX, newY)) {
            currentField = this.grid[newY][newX];
            if (
              currentField.empty ||
              (currentField.canBeLodestone && !currentField.lodestone)
            ) {
              currentField.water = true;
              currentField.empty = false;
              queue.push({ x: newX, y: newY });
            }
          }
        }
      }
    }
  }
  resetWater(side) {
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
        if (this.grid[j][i].water) {
          this.grid[j][i].water = false;
          if (!this.grid[j][i].canBeLodestone) {
            this.grid[j][i].empty = true;
          }
        }
        for (let tile of waterLocation) {
          if (tile.x === i && tile.y === j) {
            this.grid[j][i].water = true;
            this.grid[j][i].empty = false;
            this.grid[j][i].wall = false;
            break;
          }
        }
      }
    }
    if (side) {
      this.grid[waterLocationRight.y][waterLocationRight.x].water = true;
      this.grid[waterLocationRight.y][waterLocationRight.x].wall = false;
      this.grid[waterLocationRight.y][waterLocationRight.x].empty = false;
    } else {
      this.grid[waterLocationLeft.y][waterLocationLeft.x].water = true;
      this.grid[waterLocationLeft.y][waterLocationLeft.x].wall = false;
      this.grid[waterLocationLeft.y][waterLocationLeft.x].empty = false;
    }
  }
  clicked(index, side) {
    let coords = this.toCoords(index);
    if (!this.grid[coords.y][coords.x].canBeLodestone) {
      return;
    }
    this.grid[coords.y][coords.x].lodestone =
      !this.grid[coords.y][coords.x].lodestone;
    this.updateWater(side);
    updateView();
  }
  toCoords(index) {
    let x = index % 11;
    let y = Math.floor(index / 11);
    return { x: x, y: y };
  }
  toIndex(x, y) {
    return y * 11 + x;
  }

  isValid(x, y) {
    return x >= 0 && x < 11 && y >= 0 && y < 11 && !this.grid[y][x].disabled;
  }
  deepCopyGrid() {
    return this.grid.map((row) => row.map((cell) => ({ ...cell })));
  }
}

function updateView() {
  let leftTiles = document.querySelectorAll(".leftTile");
  let rightTiles = document.querySelectorAll(".rightTile");
  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
      let index = toIndex(i, j);
      leftTiles[index].classList = ["leftTile"];
      rightTiles[index].classList = ["rightTile"];
      if (leftGrid[j][i].lodestone) {
        leftTiles[index].classList.add("lodestone");
      } else if (leftGrid[j][i].water) {
        leftTiles[index].classList.add("water");
      } else if (leftGrid[j][i].empty) {
        leftTiles[index].classList.add("empty");
      } else if (leftGrid[j][i].canBeLodestone) {
        leftTiles[index].classList.add("canBeLodestone");
      } else {
        leftTiles[index].classList.add("wall");
      }
      if (rightGrid[j][i].lodestone) {
        rightTiles[index].classList.add("lodestone");
      } else if (rightGrid[j][i].water) {
        rightTiles[index].classList.add("water");
      } else if (rightGrid[j][i].empty) {
        rightTiles[index].classList.add("empty");
      } else if (rightGrid[j][i].canBeLodestone) {
        rightTiles[index].classList.add("canBeLodestone");
      } else {
        rightTiles[index].classList.add("wall");
      }
    }
  }
}

function toIndex(x, y) {
  return y * 11 + x;
}

class Tile {
  constructor(lodestone, wall, water, empty, canBeLodestone) {
    this.lodestone = lodestone;
    this.wall = wall;
    this.water = water;
    this.empty = empty;
    this.canBeLodestone = canBeLodestone;
  }
}

function swapLodestones() {
  // Define the coordinates of the lodestones to be swapped
  const lodestonesToSwap = [
    new Coords(1, 5),
    new Coords(3, 5),
    new Coords(7, 5),
    new Coords(9, 5),
    new Coords(2, 4),
    new Coords(2, 6),
    new Coords(8, 4),
    new Coords(8, 6),
  ];

  lodestonesToSwap.forEach((coord) => {
    let leftLodestone = leftGrid[coord.y][coord.x].lodestone;
    let rightLodestone = rightGrid[coord.y][coord.x].lodestone;

    leftGrid[coord.y][coord.x].lodestone = rightLodestone;
    rightGrid[coord.y][coord.x].lodestone = leftLodestone;
  });

  leftGridClass.updateWater(false);
  rightGridClass.updateWater(true);

  updateView();
}

function Restart() {
  rightGridClass = new WaterGrid();
  rightGridClass.innit(true);
  leftGridClass = new WaterGrid();
  leftGridClass.innit(false);
  leftGrid = leftGridClass.grid;
  rightGrid = rightGridClass.grid;
  updateView();
}

Restart();
