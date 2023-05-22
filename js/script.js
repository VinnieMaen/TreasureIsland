"use-strict";
(() => {
  let board = [
    [0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0],
  ];

  let solutions = [
    {
      solution: [
        [4, 3, 3],
        [4, 3, 3, 1],
        [2, 4, 4, 3, 1],
        [2, 1, 2, 2],
        [1, 2, 4],
      ],
      starter: [
        [4, 3, 3],
        [4, 3, 3, 1],
        [2, 4, 4, 3, 1],
        [2, 1, 2, 2],
        [1, 2, 4],
      ],
    },
    {
      solution: [
        [3, 1, 2],
        [3, 4, 1, 2],
        [2, 4, 2, 1, 1],
        [2, 3, 2, 4],
        [3, 3, 4],
      ],
      starter: [
        [3, 1, 2],
        [3, 4, 1, 2],
        [2, 4, 2, 1, 1],
        [2, 3, 2, 4],
        [3, 3, 4],
      ],
    },
  ];

  class BoardRenderer {
    constructor() {}

    static createRow() {
      let div = document.createElement("div");
      div.className = "row";

      return div;
    }

    static isComplete() {
      let hasZero = false;

      for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
          if (board[row][column] === 0) {
            hasZero = true;
            break;
          }
          if (hasZero) break;
        }
      }

      return !hasZero;
    }

    static createTile(type, rowDiv, row, col) {
      let typeClass;

      switch (type) {
        case 0:
          typeClass = "none";
          break;
        case 1:
          typeClass = "water";
          break;
        case 2:
          typeClass = "grass";
          break;
        case 3:
          typeClass = "forest";
          break;
        case 4:
          typeClass = "mountain";
          break;
      }

      let div = document.createElement("div");

      div.setAttribute("data-col", col);
      div.setAttribute("data-row", row);

      div.id = "tile";
      div.className = "hexagon";
      typeClass && div.classList.add(typeClass);

      rowDiv.appendChild(div);
    }

    static renderBoard(destination, brd) {
      for (let row = 0; row < brd.length; row++) {
        let rowDiv = this.createRow();
        for (let column = 0; column < brd[row].length; column++) {
          this.createTile(brd[row][column], rowDiv, row, column);
        }
        destination.appendChild(rowDiv);
      }
    }
  }

  class TileHandler {
    constructor(solution) {
      this.dragging = false;
      this.dragType = 0;
      this.dragTarget = null;
      this.solution = solution;
    }

    setListeners() {
      let tiles = document.getElementsByClassName("tile");

      interact(".tile").draggable({
        onstart: (event) => {
          this.dragging = true;
          var target = event.target;
          this.dragType = Number(target.getAttribute("data-type"));
          this.dragTarget = target;
          target.classList.add("snapped");
        },
        onmove: (event) => {
          var target = event.target,
            x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
            y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          target.style.transform =
            "translate(" +
            x +
            "px, " +
            y +
            "px)" +
            ` rotate(${parseFloat(target.getAttribute("data-rot")) || 0}deg)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
        onend: (event) => {
          this.dragType = 0;
          this.dragging = false;
          this.dragTarget = null;

          var target = event.target;
          target.classList.remove("snapped");
        },
      });

      interact("#tile").dropzone({
        overlap: 0.1,
        ondragenter: (event) => {
          var dropzoneElement = event.target;
          this.dragTarget.children[1].style = "background: #d4f542";
          dropzoneElement.style = "background: #d4f542";
        },
        ondragleave: (event) => {
          var dropzoneElement = event.target;
          this.dragTarget.children[1].style = "";
          dropzoneElement.style = "";
        },
        ondrop: (event) => {
          const target = event.target;
          let col = Number(target.getAttribute("data-col"));
          let row = Number(target.getAttribute("data-row"));
          let rot = Number(this.dragTarget.getAttribute("data-rot"));
          let tId = this.dragTarget.id;
          if (rot === 0) {
            if (tId === "endTile") {
              console.log(row);

              if (row <= 2) {
                if (
                  board[row][col] === 0 &&
                  board[row][col - 1] === 0 &&
                  board[row - 1][col] === 0
                ) {
                  board[row][col] = 2;
                  board[row][col - 1] = 4;
                  board[row - 1][col] = 3;
                  this.dragTarget.remove();
                }
              } else {
                if (
                  board[row][col] === 0 &&
                  board[row][col - 1] === 0 &&
                  board[row - 1][col + 1] === 0
                ) {
                  board[row][col] = 2;
                  board[row][col - 1] = 4;
                  board[row - 1][col + 1] = 3;
                  this.dragTarget.remove();
                }
              }
            } else {
              if (board[row][col - 1] === 0 && board[row][col] === 0) {
                console.log(this.solution[row][col]);
                console.log(this.solution[row][col - 1]);
                if (
                  this.solution[row][col] !== Number(this.dragType) &&
                  this.solution[row][col - 1] !== Number(this.dragType)
                )
                  return alert("Tile can not be placed here!");

                board[row][col] = Number(this.dragType);
                board[row][col - 1] = Number(this.dragType);
                this.dragTarget.remove();
              }
            }
          } else if (rot === 60) {
            if (row >= 3) {
              if (tId === "endTile") {
                if (
                  board[row][col] === 0 &&
                  board[row][col + 1] === 0 &&
                  board[row - 1][col] === 0
                ) {
                  board[row][col] = 2;
                  board[row][col + 1] = 3;
                  board[row - 1][col] = 4;
                  this.dragTarget.remove();
                }
              } else {
                if (board[row - 1][col] === 0 && board[row][col] === 0) {
                  if (
                    this.solution[row][col] !== Number(this.dragType) &&
                    this.solution[row - 1][col] !== Number(this.dragType)
                  )
                    return alert("Tile can not be placed here!");
                  board[row][col] = Number(this.dragType);
                  board[row - 1][col] = Number(this.dragType);
                  this.dragTarget.remove();
                }
              }
            } else {
              if (tId === "endTile") {
                if (
                  board[row][col] === 0 &&
                  board[row][col + 1] === 0 &&
                  board[row - 1][col - 1] === 0
                ) {
                  board[row][col] = 2;
                  board[row][col + 1] = 3;
                  board[row - 1][col - 1] = 4;
                  this.dragTarget.remove();
                }
              } else {
                if (board[row - 1][col - 1] === 0 && board[row][col] === 0) {
                  if (
                    this.solution[row][col] !== Number(this.dragType) &&
                    this.solution[row - 1][col - 1] !== Number(this.dragType)
                  )
                    return alert("Tile can not be placed here!");

                  board[row][col] = Number(this.dragType);
                  board[row - 1][col - 1] = Number(this.dragType);
                  this.dragTarget.remove();
                }
              }
            }
          } else if (rot === 120) {
            if (row >= 3) {
              if (tId === "endTile") {
                if (
                  board[row][col] === 0 &&
                  board[row + 1][col] === 0 &&
                  board[row - 1][col + 1] === 0
                ) {
                  board[row][col] = 2;
                  board[row + 1][col] = 3;
                  board[row - 1][col + 1] = 4;
                  this.dragTarget.remove();
                }
              } else {
                if (board[row - 1][col + 1] === 0 && board[row][col] === 0) {
                  if (
                    this.solution[row][col] !== Number(this.dragType) &&
                    this.solution[row - 1][col + 1] !== Number(this.dragType)
                  )
                    return alert("Tile can not be placed here!");

                  board[row][col] = Number(this.dragType);
                  board[row - 1][col + 1] = Number(this.dragType);
                  this.dragTarget.remove();
                }
              }
            } else {
              if (tId === "endTile") {
                if (
                  board[row][col] === 0 &&
                  board[row + 1][col + 1] === 0 &&
                  board[row - 1][col] === 0
                ) {
                  board[row][col] = 2;
                  board[row + 1][col + 1] = 3;
                  board[row - 1][col] = 4;
                  this.dragTarget.remove();
                }
              } else {
                if (board[row - 1][col] === 0 && board[row][col] === 0) {
                  if (
                    this.solution[row][col] !== Number(this.dragType) &&
                    this.solution[row - 1][col] !== Number(this.dragType)
                  )
                    return alert("Tile can not be placed here!");

                  board[row][col] = Number(this.dragType);
                  board[row - 1][col] = Number(this.dragType);
                  this.dragTarget.remove();
                }
              }
            }
          } else if (rot === 180) {
            if (row >= 2) {
              if (
                board[row][col] === 0 &&
                board[row][col + 1] === 0 &&
                board[row + 1][col - 1] === 0
              ) {
                board[row][col] = 2;
                board[row][col + 1] = 4;
                board[row + 1][col - 1] = 3;
                this.dragTarget.remove();
              }
            } else {
              board[row][col] = 2;
              board[row][col + 1] = 4;
              board[row + 1][col] = 3;
              this.dragTarget.remove();
            }
          } else if (rot === 240) {
            if (row >= 2) {
              board[row][col] = 2;
              board[row + 1][col] = 4;
              board[row][col - 1] = 3;
              this.dragTarget.remove();
            } else {
              board[row][col] = 2;
              board[row + 1][col + 1] = 4;
              board[row][col - 1] = 3;
              this.dragTarget.remove();
            }
          } else if (rot === 300) {
            if (row >= 2) {
              board[row][col] = 2;
              board[row - 1][col] = 3;
              board[row + 1][col - 1] = 4;
              this.dragTarget.remove();
            } else {
              board[row][col] = 2;
              board[row - 1][col - 1] = 3;
              board[row + 1][col] = 4;
              this.dragTarget.remove();
            }
          }

          document.getElementById("gameBoard").innerHTML = "";
          BoardRenderer.renderBoard(
            document.getElementById("gameBoard"),
            board
          );

          let tiles = document.getElementsByClassName("tile").length;

          if (tiles === 1)
            document.getElementById("endTile").style.display = "flex";

          setTimeout(() => {
            if (BoardRenderer.isComplete()) alert("Puzzle Complete");
          }, 1000);
        },
      });

      for (let tile of tiles) {
        tile.addEventListener("mousedown", () => {
          setTimeout(() => {
            if (this.dragging) return;
            let curRot = tile.style.transform
              ? Number(tile.getAttribute("data-rot"))
              : 0;

            if (isNaN(curRot)) curRot = 0;
            curRot += 60; // Adjust the rotation value as needed

            if (tile.id !== "endTile") {
              if (curRot == 180) curRot = 0;
            } else {
              if (curRot == 360) curRot = 0;
            }

            tile.setAttribute("data-rot", curRot);
            let x = parseFloat(tile.getAttribute("data-x")) || 0;
            let y = parseFloat(tile.getAttribute("data-y")) || 0;

            tile.style.transform =
              "translate(" + x + "px, " + y + "px)" + ` rotate(${curRot}deg)`;
          }, 200);
        });
      }
    }
  }

  let handeler = new TileHandler(solutions[0].solution);
  BoardRenderer.renderBoard(document.getElementById("gameBoard"), board);
  BoardRenderer.renderBoard(
    document.getElementById("startSit"),
    solutions[0].starter
  );
  handeler.setListeners();
})();
