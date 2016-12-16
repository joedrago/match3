class Match
  constructor: ->
    @game = new Phaser.Game "100%", "100%", Phaser.CANVAS, 'phaser-example', {
      preload: => @preload()
      create:  => @create()
    }

    # Grid gem counts
    @gridCX = 8
    @gridCY = 7

  preload: ->
    console.log "Match.preload()"
    @game.load.spritesheet('gems', 'img/gems.png', 80, 80, -1, 4, 4)

  create: ->
    console.log "Match.create()"

    @screenW = window.innerWidth
    @screenH = window.innerHeight
    @gemSize = @screenW / @gridCX
    @gridX = 0
    @gridY = ((@screenH - (@gemSize * @gridCY)) - @gemSize) >> 1

    for i in [0..@gridCX]
      for j in [0..@gridCY]
        sprite = @game.add.sprite(@gridX + (i * @gemSize), @gridY + (j * @gemSize), 'gems', (i + (j * 8)) % 16)
        sprite.width = @gemSize
        sprite.height = @gemSize

module.exports = Match
