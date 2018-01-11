(function () {
  'use strict'

  var SPACEBAR_KEY = 32
  var startTime = null

  var calibrateDitCount = 0
  var calibrateDitSum = 0
  var ditAverage

  var elemDitAverageText = document.getElementById('ditAverageText')
  var elemDahAverageText = document.getElementById('dahAverageText')

  elemDitAverageText.innerHTML = '_____'
  elemDahAverageText.innerHTML = '_____'

  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  function onKeyDown (event) {
    if (event.keyCode !== SPACEBAR_KEY) {
      return
    }

    if (!startTime) {
      startTime = Date.now()
    }
  }

  function onKeyUp (event) {
    if (event.keyCode !== SPACEBAR_KEY) {
      return
    }

    onTick(Date.now() - startTime)
    startTime = null
  }

  function onTick (ms) {
    console.log(new Date(), ms)

    calibrateDitSum += ms
    calibrateDitCount++
    ditAverage = calibrateDitSum / calibrateDitCount.toFixed(2)
  }
})();
