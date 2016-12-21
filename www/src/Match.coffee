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
    @screenW = window.innerWidth
    @screenH = window.innerHeight
    if @screenW > @screenH
      @screenW = Math.floor(@screenH / 16 * 9)
    console.log "created screen #{@screenW}x#{@screenH}"

    @gemSize = @screenW / @gridCX
    @gridW = @gemSize * @gridCX
    @gridH = @gemSize * @gridCY
    @gridX = 0
    @gridY = ((@screenH - (@gemSize * @gridCY)) - @gemSize) >> 1

    @game.input.onDown.add (p) => @onDown(p)
    @game.input.onUp.add (p) => @onUp(p)

    @newGame()

  newGame: ->
    @dragStartX = null
    @dragStartY = null

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

  screenToGrid: (x, y, nearest=false) ->
    g =
      x: Math.floor((x - @gridX) / @gemSize)
      y: Math.floor((y - @gridY) / @gemSize)
    if nearest
      g.x = Math.max(g.x, 0)
      g.x = Math.min(g.x, @gridCX - 1)
      g.y = Math.max(g.y, 0)
      g.y = Math.min(g.y, @gridCY - 1)
    else if (g.x < 0) or (g.x >= @gridCX) or (g.y < 0) or (g.y >= @gridCY)
      return null
    return g

  gridToScreen: (x, y) ->
    console.log
    p =
      x: Math.floor(x * @gemSize) + @gridX
      y: Math.floor(y * @gemSize) + @gridY
    return p

  swapChain: (startX, startY, endX, endY, dragging=false) ->
    x = startX
    y = startY
    deltaX = endX - x
    deltaY = endY - y
    deltaX = Math.max(deltaX, -1)
    deltaX = Math.min(deltaX, 1)
    deltaY = Math.max(deltaY, -1)
    deltaY = Math.min(deltaY, 1)
    while (x != endX) or (y != endY)
      newX = x + deltaX
      newY = y + deltaY
      # console.log "SWAP #{x} #{y} <-> #{newX} #{newY}"
      temp = @grid[x][y]
      @grid[x][y] = @grid[newX][newY]
      @grid[newX][newY] = temp
      if @grid[x][y] != null
        @grid[x][y].x = x
        @grid[x][y].y = y
      if @grid[newX][newY] != null
        @grid[newX][newY].x = newX
        @grid[newX][newY].y = newY
      @moveGemHome(x, y)
      if not dragging
        @moveGemHome(newX, newY)
      x = newX
      y = newY

  onDown: (p) ->
    # console.log "down", [p.x,p.y,p.screenX,p.screenY]
    g = @screenToGrid(p.x, p.y)
    if g == null
      console.log "bad coord"
      return

    if @grid[g.x][g.y] != null
      console.log "enabling drag on #{g.x} #{g.y}"
      sprite = @grid[g.x][g.y].sprite
      sprite.input.enableDrag(true)
      sprite.events.onDragUpdate.add (sprite, pointer, dragX, dragY, snapPoint) =>
        # Have to add half a gem because dragX/Y is the topleft of the dragged gem
        @onOver(Math.floor(dragX + (@gemSize / 2)), Math.floor(dragY + (@gemSize / 2)))
      @dragStartX = @dragX = g.x
      @dragStartY = @dragY = g.y

    # @emitScoreParticle(g.x, g.y, 0, 100)
    # @breakGem(g.x, g.y)
    # @spawnGems()

  onOver: (x, y) ->
    if (@dragStartX == null) or (@dragStartY == null)
      return

    g = @screenToGrid(x, y, true)
    deltaX = Math.abs(g.x - @dragStartX)
    deltaY = Math.abs(g.y - @dragStartY)
    if (deltaX == 0) and (deltaY == 0)
      return

    if deltaX < deltaY
      g.x = @dragStartX
      if @dragX != @dragStartX
        console.log "rewinding drag X #{deltaX} #{deltaY}"
        @rewindDrag(true)
    else
      g.y = @dragStartY
      if @dragY != @dragStartY
        console.log "rewinding drag Y #{deltaX} #{deltaY}"
        @rewindDrag(true)

    @swapChain(@dragX, @dragY, g.x, g.y, true)
    @dragX = g.x
    @dragY = g.y

  onUp: (p) ->
    # console.log "up", [p.x,p.y,p.screenX,p.screenY]
    @rewindDrag()
    @finishDrag()

  finishDrag: ->
    if (@dragX != null) and (@dragY != null) and (@grid[@dragX][@dragY] != null)
      @grid[@dragX][@dragY].sprite.input.enableDrag(false)
      @grid[@dragX][@dragY].sprite.events.onDragUpdate.removeAll()
    @dragStartX = @dragX = null
    @dragStartY = @dragY = null

  rewindDrag: (dragging=false) ->
    if (@dragStartX != null) and (@dragStartY != null)
      console.log "moving (#{@dragX}, #{@dragY}) home (#{@dragStartX}, #{@dragStartY})"
      @swapChain(@dragX, @dragY, @dragStartX, @dragStartY, dragging)
      if not dragging
        @moveGemHome(@dragStartX, @dragStartY)
      @dragX = @dragStartX
      @dragY = @dragStartY

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

  moveGemHome: (gx, gy, bounce=false) ->
    gem = @grid[gx][gy]
    if gem == null
      return

    x = @gridX + (gx * @gemSize)
    y = @gridY + (gy * @gemSize)
    easing = Phaser.Easing.Linear.None
    speed = 100
    if bounce
      easing = Phaser.Easing.Bounce.Out
      speed = 400
    @game.add.tween(gem.sprite).to({ x: x, y: y }, speed, easing, true)

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
          gem.x = i
          gem.y = j
          @moveGemHome(i, j, true)

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
          sprite.inputEnabled = true
          @game.world.sendToBack(sprite)
          @game.add.tween(sprite).to({ y: y }, 400, Phaser.Easing.Bounce.Out, true)
          @grid[i][j] =
            x: i
            y: j
            type: gemType
            sprite: sprite

module.exports = Match
