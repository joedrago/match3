Match = require './Match'

onDeviceReady = ->
  console.log('deviceready')
  window.match = new Match

init = ->
  console.log "init"
  document.addEventListener('deviceready', onDeviceReady, false)

init()
