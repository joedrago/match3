browserify = require 'browserify'
coffeeify = require 'coffeeify'
uglifyify = require 'uglifyify'

fs = require 'fs'
path = require 'path'
{spawn} = require 'child_process'
util = require 'util'
watch = require 'node-watch'

coffeeName = 'coffee'
if process.platform == 'win32'
  coffeeName += '.cmd'

buildGame = (callback) ->
  # equal of command line $ "browserify --debug -t coffeeify ./src/main.coffee > bundle.js "
  productionBuild = (process.env.NODE_ENV == 'production')
  opts = {
    extensions: ['.coffee']
  }
  if not productionBuild
    opts.debug = true
  b = browserify opts
  b.add './www/src/main.coffee'
  b.transform coffeeify
  if productionBuild
    b.transform { global: true, ignore: ['**/main.*'] }, uglifyify
  b.bundle (err, result) ->
    if not err
      fs.writeFile "www/js/index.js", result, (err) ->
        if not err
          util.log "Game compilation finished."
          callback?()
        else
          util.log "Game bundle write failed: " + err
    else
      util.log "Game compilation failed: " + err

task 'build', 'build game', (options) ->
  buildGame ->

task 'watch', 'Run dev server and watch for changed source files to automatically rebuild', (options) ->
  buildGame ->
    util.log "Watching for changes in www/src"
    watch 'www/src', (filename) ->
      coffeeFileRegex = /\.coffee$/
      if coffeeFileRegex.test(filename)
        util.log "Source code #{filename} changed, regenerating bundle..."
        buildGame()
