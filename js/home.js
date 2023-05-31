'use strict'
;(() => {
  // Chat GPT //
  function generateGameId (length) {
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var gameId = ''

    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length)
      gameId += characters.charAt(randomIndex)
    }

    return gameId
  }
  // Until here of course :) //

  let savedUsername = localStorage.getItem('username')
  let userInput = document.querySelector('#username')

  if (savedUsername) userInput.value = savedUsername

  let single = document.querySelector('#single')
  let multi = document.querySelector('#multi')

  single.addEventListener('click', event => {
    event.preventDefault()
    event.stopPropagation()

    let username = userInput.value

    if (!username || username.trim().length === 0) {
      return alert('Please fill in a username!')
    }

    localStorage.setItem('username', username)
    window.location.href = '/game'
  })

  multi.addEventListener('click', event => {
    event.preventDefault()
    event.stopPropagation()
    let username = userInput.value

    if (!username || username.trim().length === 0) {
      return alert('Please fill in a username!')
    }
    
    let gameId = generateGameId(6)
    localStorage.setItem('username', username)
    window.location.href = '/game/?gameID=' + gameId
  })
})()
