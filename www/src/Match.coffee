class Match
  constructor: ->
    @game = new Phaser.Game 720, 1280, Phaser.CANVAS, 'phaser-example', {
      preload: => @preload()
      create:  => @create()
    }

  preload: ->
    console.log "Match.preload()"
    # @game.load.image('gems', 'img/gems.png');
    @game.load.spritesheet('gems', 'img/gems.png', 80, 80, -1, 2, 4)

  create: ->
    console.log "Match.create()"
    # @game.scale.scaleMode = @game.scale.RESIZE
    @game.scale.forceOrientation(false, true)
    @game.scale.refresh()

    console.log "#{window.innerWidth}x#{window.innerHeight}"

    for i in [0..8]
      for j in [0..8]
        @game.add.sprite(i * 80, j * 80, 'gems', i + (j * 8))

module.exports = Match
