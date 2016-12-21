class Match
  constructor: ->
    @game = new Phaser.Game "100%", "100%", Phaser.CANVAS, 'phaser-example', {
      preload: => @preload()
      create:  => @create()
      update:  => @update()
    }

    # Grid gem counts
    @gridCX = 8
    @gridCY = 7

  preload: ->
    console.log "Match.preload()"
    @game.load.spritesheet('gems', 'img/gems.png', 80, 80, -1, 4, 4)

  create: ->
    console.log "Match.create(): #{window.innerWidth}x#{window.innerHeight}"

    @game.input.onDown.add (p) => @onDown(p)
    @game.input.onUp.add (p) => @onUp(p)

    @screenW = window.innerWidth
    @screenH = window.innerHeight
    @gemSize = @screenW / @gridCX
    @gridW = @gemSize * @gridCX
    @gridH = @gemSize * @gridCY
    @gridX = 0
    @gridY = ((@screenH - (@gemSize * @gridCY)) - @gemSize) >> 1

    @newGame()

  newGame: ->
    if @grid
      for i in [0...@gridCX]
        for j in [0...@gridCY]
          if @grid[i][j]
            @grid[i][j].sprite.destroy()

    @grid = Array(@gridCX)
    for i in [0...@gridCX]
      @grid[i] = Array(@gridCY)
      for j in [0...@gridCY]
        @grid[i][j] = null
    @spawnGems()

  update: ->

  screenToGrid: (x, y) ->
    g =
      x: Math.floor((x - @gridX) / @gemSize)
      y: Math.floor((y - @gridY) / @gemSize)
    if (g.x < 0) or (g.x >= @gridCX) or (g.y < 0) or (g.y >= @gridCY)
      return null
    return g

  gridToScreen: (x, y) ->
    console.log
    p =
      x: Math.floor(x * @gemSize) + @gridX
      y: Math.floor(y * @gemSize) + @gridY
    return p

  onDown: (p) ->
    # console.log "down", [p.x,p.y,p.screenX,p.screenY]
    g = @screenToGrid(p.x, p.y)
    if g != null
      @emitScoreParticle(g.x, g.y, 0, 100)
      @breakGem(g.x, g.y)
      @spawnGems()
    else
      console.log "bad coord"
    # @newGame()

  onUp: (p) ->
    # console.log "up", [p.x,p.y,p.screenX,p.screenY]

  breakGem: (x, y) ->
    console.log "breakGem(#{x}, #{y})"
    if @grid[x][y] != null
      @grid[x][y].sprite.destroy()
      @grid[x][y] = null
    if (x > 0) and (@grid[x-1][y] != null)
      @grid[x-1][y].sprite.destroy()
      @grid[x-1][y] = null
    if (x < @gridCX-1) and (@grid[x+1][y] != null)
      @grid[x+1][y].sprite.destroy()
      @grid[x+1][y] = null

  gemArtIndex: (type, highlight=false, power=0) ->
    index = switch type
      when 0, 1, 2, 3, 4
        type
      when 5, 6, 7
        7 + (3 * (type - 5))
    if highlight
      index += 16
    index += power
    return index

  emitScoreParticle: (gridX, gridY, type, score) ->
    p = @gridToScreen(gridX, gridY)
    style = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" }
    text = @game.add.text(p.x, p.y, ""+score, style)
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.setTextBounds(0, 0, @gemSize, @gemSize);
    @game.add.tween(text).to({ y: p.y - (@gemSize / 4), alpha: 0 }, 1000, Phaser.Easing.Quartic.In, true)
    @game.add.tween(text.scale).to({ x: 2, y: 2 }, 1000, Phaser.Easing.Linear.None, true)
    @game.time.events.add 1000, ->
      text.destroy()

  bestGemToSpawn: ->
    # TODO: Decide based on current gem distribution
    return Math.floor(Math.random() * 8)

  spawnGems: ->
    # drop gems from higher up slots down
    newGrid = Array(@gridCX)
    for i in [0...@gridCX]
      newGrid[i] = Array(@gridCY)
      oldIndex = newIndex = @gridCY - 1
      while oldIndex >= 0
        if @grid[i][oldIndex] != null
          newGrid[i][newIndex] = @grid[i][oldIndex]
          newIndex -= 1
        oldIndex -= 1
      while newIndex >= 0
        newGrid[i][newIndex] = null
        newIndex -= 1
    @grid = newGrid

    # update sprites and x/y
    for i in [0...@gridCX]
      for j in [0...@gridCY]
        gem = @grid[i][j]
        if gem == null
          continue
        if (gem.x != i) or (gem.y != j)
          x = @gridX + (i * @gemSize)
          y = @gridY + (j * @gemSize)
          @game.add.tween(gem.sprite).to({ x: x, y: y }, 400, Phaser.Easing.Bounce.Out, true)
          gem.x = i
          gem.y = j

    # drop from the top
    for i in [0...@gridCX]
      for j in [0...@gridCY]
        if @grid[i][j] == null
          gemType = @bestGemToSpawn()
          x = @gridX + (i * @gemSize)
          y = @gridY + (j * @gemSize)
          sprite = @game.add.sprite(x, y - @gridH, 'gems', @gemArtIndex(gemType, false))
          sprite.width = @gemSize
          sprite.height = @gemSize
          @game.world.sendToBack(sprite)
          @game.add.tween(sprite).to({ y: y }, 400, Phaser.Easing.Bounce.Out, true)
          @grid[i][j] =
            x: i
            y: j
            type: gemType
            sprite: sprite

module.exports = Match
