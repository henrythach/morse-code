(function () {
  'use strict'

  var SPACEBAR_KEY = 32
  var CALIBRATION_TIMES = 10
  var OFFSET_IN_MS = 40
  var startTime = null

  var calibrationComplete = false
  var calibrationEnabled = false
  var calibrateDitSum = 0
  var calibrateDitCount = 0
  var calibrationRemaining = CALIBRATION_TIMES
  var ditAverage = 0
  var lettersArray = []

  var buttonCalibrateDit = document.getElementById('calibrateDitButton')
  var spanDitAverageText = document.getElementById('spanDitAverage')
  var spanDahAverageText = document.getElementById('spanDahAverage')
  var textCurrentWord    = document.getElementById('currentWord')
  textCurrentWord.hidden = true

  buttonCalibrateDit.addEventListener('click', toggleCalibrateDit)

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
    if (calibrationEnabled) {
      calibrateDitSum += ms
      calibrateDitCount++
      ditAverage = calibrateDitSum / calibrateDitCount
      calibrationRemaining--

      if (calibrationRemaining < 1) {
        calibrationEnabled = false
        calibrationRemaining = CALIBRATION_TIMES
        calibrationComplete = true
      }

      renderCalibrationUI()
      return
    }

    if (Math.abs(ms - ditAverage) <= ditAverage) {
      onDit()
    } else if (Math.abs(ms - (ditAverage * 3)) <= ditAverage * 1.5) {
      onDah()
    }

    // wait for 2 dahs before we reset
  }

  function onDit () {
    console.log(Date.now(), 'dit')
    lettersArray.push(0)
    renderCurrentWord()
  }

  function onDah () {
    console.log(Date.now(), 'dah')
    lettersArray.push(1)
    renderCurrentWord()
  }

  function renderCurrentWord () {
    textCurrentWord.innerHTML = lettersArray.map(l => l === 0 ? '∙' : '—').join(' ')
  }

  function toggleCalibrateDit () {
    calibrationComplete = false
    calibrationEnabled = true
    renderCalibrationUI()
  }

  function renderCalibrationUI () {
    buttonCalibrateDit.disabled = calibrationEnabled
    buttonCalibrateDit.innerHTML = 'Tap spacebar ' + calibrationRemaining + ' times to calibrate'
    spanDitAverage.innerHTML = ditAverage.toFixed(2)
    spanDahAverage.innerHTML = (ditAverage * 3).toFixed(2)

    calibrateDitButton.hidden = calibrationComplete
    textCurrentWord.hidden = !calibrationComplete
  }
})();
