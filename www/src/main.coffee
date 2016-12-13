onDeviceReady = ->
  parentElement = document.getElementById('deviceready')
  listeningElement = parentElement.querySelector('.listening')
  receivedElement = parentElement.querySelector('.received')
  listeningElement.setAttribute('style', 'display:none;')
  receivedElement.setAttribute('style', 'display:block;')
  console.log('pretty cool setup')

init = ->
  console.log "init"
  document.addEventListener('deviceready', onDeviceReady, false)

init()

