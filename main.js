(function () {
  'use strict'

  var inputElement = document.getElementById('input')
  inputElement.addEventListener('keydown', onKeyDown)
  inputElement.addEventListener('keyup', onKeyUp)

  function onKeyDown (event) {
    console.log('keydown')

    event.preventDefault()
  }

  function onKeyUp (event) {
    console.log('keyup')

    event.preventDefault()
  }
})();
