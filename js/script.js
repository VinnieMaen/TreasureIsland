'use-strict'
;(() => {
  class BoardRenderer {
    constructor (board) {
      this.board = board
    }

    createRow () {
      let div = document.createElement('div')
      div.className = 'row'

      return div
    }

    createTile (type, rowDiv) {
      let typeClass

      switch (type) {
        case 0:
          typeClass = "none"
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
      div.className = 'hexagon'
      typeClass && div.classList.add(typeClass)

      rowDiv.appendChild(div)
    }

    renderBoard () {
      for (let row = 0; row < this.board.length; row++) {
        let rowDiv = this.createRow()
        for (let column = 0; column < this.board[row].length; column++) {
          this.createTile(this.board[row][column], rowDiv)
        }
        document.getElementById('gameBoard').appendChild(rowDiv)
      }
    }
  }

  class TileHandler {
    constructor () {
      this.dragging = false
    }

    setListeners () {
      let tiles = document.getElementsByClassName('tile')

      interact('.tile').draggable({
        onstart: event => {
          this.dragging = true
          var target = event.target
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
          this.dragging = false
          var target = event.target
          target.classList.remove('snapped')
          console.log(event.target)
        }
      })

      interact('.tile').dropzone({
        overlap: 0,
        ondrop (event) {
          const target = event.target
          console.log(target)
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

  let board = [
    [0, 0, 0],
    [0, 0, 2, 2],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0]
  ]

  let renderer = new BoardRenderer(board)

  renderer.renderBoard()

  handeler.setListeners()
})()
