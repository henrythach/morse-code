(function () {
  'use strict'

  var MORSE_CODE_TABLE = {
    '01':    'A',
    '1000':  'B',
    '1010':  'C',
    '100':   'D',
    '0':     'E',
    '0010':  'F',
    '110':   'G',
    '0000':  'H',
    '00':    'I',
    '0111':  'J',
    '101':   'K',
    '0100':  'L',
    '11':    'M',
    '10':    'N',
    '111':   'O',
    '0110':  'P',
    '1101':  'Q',
    '010':   'R',
    '000':   'S',
    '1':     'T',
    '001':   'U',
    '0001':  'V',
    '011':   'W',
    '1001':  'X',
    '1011':  'Y',
    '1100':  'Z',
    '01111': '1',
    '00111': '2',
    '00011': '3',
    '00001': '4',
    '00000': '5',
    '10000': '6',
    '11000': '7',
    '11100': '8',
    '11110': '9',
    '11111': '0'
  }

  var EMPTY_STRING = '&nbsp';
  var SPACEBAR_KEY = 32
  var CALIBRATION_TIMES = 10
  var OFFSET_IN_MS = 40

  var startTime = null

  var calibrationComplete = false
  var calibrationEnabled = true
  var calibrateDitSum = 0
  var calibrateDitCount = 0
  var calibrationRemaining = CALIBRATION_TIMES
  var ditAverage = 0
  var lettersArray = []
  var wordsArray = []
  var sentencesArray = []

  var letterTimer
  var wordTimer

  var textCurrentSentence = document.getElementById('sentence')
  var buttonCalibrateDit  = document.getElementById('calibrateDitButton')
  var spanDitAverageText  = document.getElementById('spanDitAverage')
  var spanDahAverageText  = document.getElementById('spanDahAverage')
  var textCurrentWord     = document.getElementById('currentWord')
  var textCurrentLetter   = document.getElementById('currentLetter')

  // buttonCalibrateDit.addEventListener('click', toggleCalibrateDit)

  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  function onKeyDown (event) {
    if (event.keyCode !== SPACEBAR_KEY) {
      return
    }

    clearTimeout(letterTimer)
    clearTimeout(wordTimer)
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
    clearTimeout(letterTimer)
    clearTimeout(wordTimer)
    letterTimer = setTimeout(resetLetter, (ditAverage * 3))
    wordTimer = setTimeout(resetWord, (ditAverage * 3) * 3)
  }

  function resetLetter () {
    var key = lettersArray.reduce((sum, x) => sum + x, '')
    var letter = MORSE_CODE_TABLE[key]
    wordsArray.push(letter)
    lettersArray = []
    renderCurrentLetter()
    renderCurrentWord()
  }

  function resetWord () {
    sentencesArray.push(wordsArray.join(''))
    wordsArray = []
    textCurrentSentence.innerHTML = sentencesArray.join(' ')
    renderCurrentWord()
  }

  function onDit () {
    lettersArray.push(0)
    renderCurrentLetter()
  }

  function onDah () {
    lettersArray.push(1)
    renderCurrentLetter()
  }

  function renderCurrentWord () {
    var word = wordsArray.join('')
    textCurrentWord.innerHTML = word || EMPTY_STRING
  }

  function renderCurrentLetter () {
    if (!lettersArray.length) {
      textCurrentLetter.innerHTML = EMPTY_STRING
      return
    }

    var ditDah = lettersArray.map(l => l === 0 ? '∙' : '—').join('')
    var key = lettersArray.reduce((sum, x) => sum + x, '')
    var letter = MORSE_CODE_TABLE[key]
    textCurrentLetter.innerHTML = ditDah + '(' + letter + ')'
  }

  function toggleCalibrateDit () {
    calibrationComplete = false
    calibrationEnabled = true
    renderCalibrationUI()
  }

  function renderCalibrationUI () {
    textCurrentSentence.innerHTML = 'Tap spacebar ' + calibrationRemaining + ' times to calibrate dit'
    spanDitAverage.innerHTML = ditAverage.toFixed(2)
    spanDahAverage.innerHTML = (ditAverage * 3).toFixed(2)

    if (calibrationComplete) {
      textCurrentSentence.innerHTML = '&nbsp;'
      textCurrentLetter.innerHTML = '&nbsp;'
      textCurrentWord.innerHTML = '&nbsp;'
    }
  }

  renderCalibrationUI()

  function renderMorseCodeTable(numOfRows) {
    var entries = Object.entries(MORSE_CODE_TABLE).sort((a, b) => a[1] > b[1])
    var table = []
    for (var i = 0; i < entries.length; i++) {
      let x = i % numOfRows
      if (!table[x]) {
        table[x] = []
      }
      table[x].push(entries[i])
    }

    var numOfColumns = Math.ceil(entries.length / numOfRows)
    var tbody = document.getElementById("morse-code-table")
    for (var row = 0; row < numOfRows; row++) {
      var tr = document.createElement('tr')
      for (var col = 0; col < numOfColumns; col++) {
        var entry = table[row][col]

        var elementEnglishLetter = document.createElement('td')
        elementEnglishLetter.innerHTML = entry ? entry[1] : ''
        tr.appendChild(elementEnglishLetter)

        var elementDitDah = document.createElement('td')
        var stringDitDah = entry ? entry[0] :''
        stringDitDah = stringDitDah.replace(/0/g, '• ')
        stringDitDah = stringDitDah.replace(/1/g, '— ')
        elementDitDah.innerHTML = stringDitDah
        tr.appendChild(elementDitDah)
      }
      tbody.appendChild(tr)
    }
  }

  renderMorseCodeTable(10)

})();
