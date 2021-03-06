class Match
  constructor: ->
    @game = new Phaser.Game "100%", "100%", Phaser.CANVAS, 'phaser-example', {
      preload: => @preload()
      create:  => @create()
    }

    # Grid gem counts
    @gridCX = 8
    @gridCY = 7

    @gemBounceSpeed = 400
    @gemSwapSpeed = 100

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
    @inputEnabled = false

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
    loop
      @findMatches()
      if @matchTotal > 0
        @breakGems(true)
        @spawnGems()
      else
        break

    # TODO: reset score here
    @chain = 1

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
    if not @inputEnabled
      return

    g = @screenToGrid(p.x, p.y)
    if g == null
      console.log "bad coord"
      return

    if @grid[g.x][g.y] != null
      # console.log "enabling drag on #{g.x} #{g.y}"
      sprite = @grid[g.x][g.y].sprite
      sprite.input.enableDrag(true)
      sprite.events.onDragUpdate.add (sprite, pointer, dragX, dragY, snapPoint) =>
        # Have to add half a gem because dragX/Y is the topleft of the dragged gem
        @onOver(Math.floor(dragX + (@gemSize / 2)), Math.floor(dragY + (@gemSize / 2)))
      @dragStartX = @dragX = g.x
      @dragStartY = @dragY = g.y

  onOver: (x, y) ->
    if not @inputEnabled
      return

    if (@dragStartX == null) or (@dragStartY == null)
      return

    g = @screenToGrid(x, y, true)
    deltaX = Math.abs(g.x - @dragStartX)
    deltaY = Math.abs(g.y - @dragStartY)
    if (deltaX == 0) and (deltaY == 0)
      if (@dragX != @dragStartX) or (@dragY != @dragStartY)
        @rewindDrag()
        @findMatches()
      return
    if (g.x == @dragX) and (g.y == @dragY)
      return

    if deltaX < deltaY
      g.x = @dragStartX
      if @dragX != @dragStartX
        # console.log "rewinding drag X #{deltaX} #{deltaY}"
        @rewindDrag(true)
    else
      g.y = @dragStartY
      if @dragY != @dragStartY
        # console.log "rewinding drag Y #{deltaX} #{deltaY}"
        @rewindDrag(true)

    @swapChain(@dragX, @dragY, g.x, g.y, true)
    @dragX = g.x
    @dragY = g.y
    @findMatches()

  onUp: (p) ->
    # console.log "up", [p.x,p.y,p.screenX,p.screenY]
    if not @inputEnabled
      return

    if (@dragStartX == null) or (@dragStartY == null)
      return

    if @matchTotal > 0
      @breakGems()
    else
      @rewindDrag()
    @finishDrag()
    @resetMatches()

  finishDrag: ->
    if (@dragX != null) and (@dragY != null) and (@grid[@dragX][@dragY] != null)
      @grid[@dragX][@dragY].sprite.input.enableDrag(false)
      @grid[@dragX][@dragY].sprite.events.onDragUpdate.removeAll()
      @moveGemHome(@dragX, @dragY)
    @dragStartX = @dragX = null
    @dragStartY = @dragY = null

  rewindDrag: (dragging=false) ->
    if (@dragStartX != null) and (@dragStartY != null)
      # console.log "moving (#{@dragX}, #{@dragY}) home (#{@dragStartX}, #{@dragStartY})"
      @swapChain(@dragX, @dragY, @dragStartX, @dragStartY, dragging)
      if not dragging
        @moveGemHome(@dragStartX, @dragStartY)
      @dragX = @dragStartX
      @dragY = @dragStartY

  updateArt: (gx, gy) ->
    if @grid[gx][gy] != null
      gem = @grid[gx][gy]
      art = @gemArtIndex(gem.type, (gem.match > 0), gem.power)
      if gem.art != art
        gem.art = art
        gem.sprite.frame = art
    return

  resetMatches: ->
    @matchTotal = 0
    for i in [0...@gridCX]
      for j in [0...@gridCY]
        if @grid[i][j] != null
          @grid[i][j].match = 0
          @updateArt(i, j)

  addMatchStrip: (startX, startY, endX, endY, matchCount) ->
    # console.log "addMatchStrip(#{startX}, #{startY}, #{endX}, #{endY})"
    for x in [startX..endX]
      for y in [startY..endY]
        @matchTotal += matchCount
        @grid[x][y].match += matchCount
        @updateArt(x, y)

  findMatches: ->
    @resetMatches()

    # ew, copypasta
    for i in [0...@gridCX]
      lastType = -1
      count = 0
      for j in [0...@gridCY]
        if lastType == @grid[i][j].type
          count += 1
        else
          lastType = @grid[i][j].type
          if count >= 3
            @addMatchStrip(i, j - count, i, j - 1, count)
          count = 1
      if count >= 3
        @addMatchStrip(i, j - count, i, j - 1, count)
    for j in [0...@gridCY]
      lastType = -1
      count = 0
      for i in [0...@gridCX]
        if lastType == @grid[i][j].type
          count += 1
        else
          lastType = @grid[i][j].type
          if count >= 3
            @addMatchStrip(i - count, j, i - 1, j, count)
          count = 1
      if count >= 3
        @addMatchStrip(i - count, j, i - 1, j, count)

    console.log "------------"
    for j in [0...@gridCY]
      line = ""
      for i in [0...@gridCX]
        line += "#{@grid[i][j].match} "
      console.log "#{j} | #{line}"

  breakGem: (x, y) ->
    # console.log "breakGem(#{x}, #{y})"
    if @grid[x][y] != null
      @grid[x][y].sprite.destroy()
      @grid[x][y] = null

  breakGems: (newGame) ->
    brokeOne = false
    for i in [0...@gridCX]
      for j in [0...@gridCY]
        gem = @grid[i][j]
        if (gem != null) and (gem.match > 0)
          if not newGame
            @emitScoreParticle(i, j, gem.type, gem.match * @chain)
          @breakGem(i, j)
          brokeOne = true
    if brokeOne
      @chain *= 10
    @spawnGems()

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
    # hack
    textColor = "#fff"
    if type == 0 # broken
      score *= -1
      textColor = "#f66"

    p = @gridToScreen(gridX, gridY)
    style = { font: "bold 24px Arial", fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" }
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

    # console.log "moveGemHome(#{gx}, #{gy})"

    x = @gridX + (gx * @gemSize)
    y = @gridY + (gy * @gemSize)
    easing = Phaser.Easing.Linear.None
    speed = @gemSwapSpeed
    if bounce
      easing = Phaser.Easing.Bounce.Out
      speed = @gemBounceSpeed
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
    spawnedGem = false
    for i in [0...@gridCX]
      for j in [0...@gridCY]
        if @grid[i][j] == null
          spawnedGem = true
          gemType = @bestGemToSpawn()
          match = 0
          power = false
          x = @gridX + (i * @gemSize)
          y = @gridY + (j * @gemSize)
          art = @gemArtIndex(gemType, (match > 0), power)
          sprite = @game.add.sprite(x, y - @gridH, 'gems', art)
          sprite.width = @gemSize
          sprite.height = @gemSize
          sprite.inputEnabled = true
          @game.world.sendToBack(sprite)
          @game.add.tween(sprite).to({ y: y }, @gemBounceSpeed, Phaser.Easing.Bounce.Out, true)
          @grid[i][j] =
            sprite: sprite
            x: i
            y: j
            type: gemType
            match: match
            power: power
            art: art

    if spawnedGem
      console.log "input disabled"
      @inputEnabled = false
      @thinkLater(@gemBounceSpeed)

    return spawnedGem

  thinkLater: (t) ->
    @game.time.events.add t, =>
      @think()

  think: ->
    console.log "think()"
    if not @spawnGems()
      @findMatches()
      if @matchTotal > 0
        @breakGems()
      else
        console.log "input enabled"
        @inputEnabled = true
        @chain = 1

module.exports = Match
