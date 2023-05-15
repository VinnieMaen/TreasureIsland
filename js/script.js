'use-strict'
;(() => {
  let board = [
    [0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0]
  ]

  class BoardRenderer {
    constructor () {}

    static createRow () {
      let div = document.createElement('div')
      div.className = 'row'

      return div
    }

    static createTile (type, rowDiv, row, col) {
      let typeClass

      switch (type) {
        case 0:
          typeClass = 'none'
          break
        case 1:
          typeClass = 'water'
          break
        case 2:
          typeClass = 'grass'
          break
        case 3:
          typeClass = 'forest'
          break
        case 4:
          typeClass = 'mountain'
          break
      }

      let div = document.createElement('div')

      div.setAttribute('data-col', col)
      div.setAttribute('data-row', row)

      div.id = 'tile'
      div.className = 'hexagon'
      typeClass && div.classList.add(typeClass)

      rowDiv.appendChild(div)
    }

    static renderBoard () {
      for (let row = 0; row < board.length; row++) {
        let rowDiv = this.createRow()
        for (let column = 0; column < board[row].length; column++) {
          this.createTile(board[row][column], rowDiv, row, column)
        }
        document.getElementById('gameBoard').appendChild(rowDiv)
      }
    }
  }

  class TileHandler {
    constructor () {
      this.dragging = false
      this.dragType = 0
      this.dragTarget = null
    }

    setListeners () {
      let tiles = document.getElementsByClassName('tile')

      interact('.tile').draggable({
        onstart: event => {
          this.dragging = true
          var target = event.target
          this.dragType = Number(target.getAttribute('data-type'))
          this.dragTarget = target
          console.log(target)
          target.classList.add('snapped')
        },
        onmove: event => {
          var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

          target.style.transform =
            'translate(' +
            x +
            'px, ' +
            y +
            'px)' +
            ` rotate(${parseFloat(target.getAttribute('data-rot')) || 0}deg)`
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        },
        onend: event => {
          this.dragType = 0
          this.dragging = false
          this.dragTarget = null

          var target = event.target
          target.classList.remove('snapped')
        }
      })

      interact('#tile').dropzone({
        overlap: 0.2,
        ondrop: event => {
          const target = event.target
          let col = Number(target.getAttribute('data-col'))
          let row = Number(target.getAttribute('data-row'))
          let rot = Number(this.dragTarget.getAttribute('data-rot'))

          if (rot === 0) {
            if ((board[row][col - 1] === 0) & (board[row][col] === 0)) {
              board[row][col] = Number(this.dragType)
              board[row][col - 1] = Number(this.dragType)

              this.dragTarget.remove()
            }
          } else if (rot === 60 || rot === 240) {
            if (row >= 3) {
              if (board[row - 1][col] === 0 && board[row][col] === 0) {
                board[row][col] = Number(this.dragType)
                board[row - 1][col] = Number(this.dragType)

                this.dragTarget.remove()
              }
            } else {
              if (board[row - 1][col - 1] === 0 && board[row][col] === 0) {
                board[row][col] = Number(this.dragType)
                board[row - 1][col - 1] = Number(this.dragType)

                this.dragTarget.remove()
              }
            }
          } else if (rot === 120 || rot === 300) {
            if (row >= 3) {
              if (board[row - 1][col + 1] === 0 && board[row][col] === 0) {
                board[row][col] = Number(this.dragType)
                board[row - 1][col + 1] = Number(this.dragType)

                this.dragTarget.remove()
              }
            } else {
              if (board[row - 1][col] === 0 && board[row][col] === 0) {
                board[row][col] = Number(this.dragType)
                board[row - 1][col] = Number(this.dragType)

                this.dragTarget.remove()
              }
            }
          }

          document.getElementById('gameBoard').innerHTML = ''
          BoardRenderer.renderBoard()
        }
      })

      for (let tile of tiles) {
        tile.addEventListener('mousedown', () => {
          setTimeout(() => {
            if (this.dragging) return
            let curRot = tile.style.transform
              ? Number(tile.getAttribute('data-rot'))
              : 0

            if (isNaN(curRot)) curRot = 0
            curRot += 60 // Adjust the rotation value as needed

            if (curRot == 360) curRot = 0

            tile.setAttribute('data-rot', curRot)
            let x = parseFloat(tile.getAttribute('data-x')) || 0
            let y = parseFloat(tile.getAttribute('data-y')) || 0

            tile.style.transform =
              'translate(' + x + 'px, ' + y + 'px)' + ` rotate(${curRot}deg)`
          }, 100)
        })
      }
    }
  }

  let handeler = new TileHandler()
  BoardRenderer.renderBoard()
  handeler.setListeners()
})()
