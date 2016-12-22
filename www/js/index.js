(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Match;

Match = (function() {
  function Match() {
    this.game = new Phaser.Game("100%", "100%", Phaser.CANVAS, 'phaser-example', {
      preload: (function(_this) {
        return function() {
          return _this.preload();
        };
      })(this),
      create: (function(_this) {
        return function() {
          return _this.create();
        };
      })(this)
    });
    this.gridCX = 8;
    this.gridCY = 7;
    this.gemBounceSpeed = 400;
    this.gemSwapSpeed = 100;
  }

  Match.prototype.preload = function() {
    console.log("Match.preload()");
    return this.game.load.spritesheet('gems', 'img/gems.png', 80, 80, -1, 4, 4);
  };

  Match.prototype.create = function() {
    console.log("Match.create(): " + window.innerWidth + "x" + window.innerHeight);
    this.screenW = window.innerWidth;
    this.screenH = window.innerHeight;
    if (this.screenW > this.screenH) {
      this.screenW = Math.floor(this.screenH / 16 * 9);
    }
    console.log("created screen " + this.screenW + "x" + this.screenH);
    this.gemSize = this.screenW / this.gridCX;
    this.gridW = this.gemSize * this.gridCX;
    this.gridH = this.gemSize * this.gridCY;
    this.gridX = 0;
    this.gridY = ((this.screenH - (this.gemSize * this.gridCY)) - this.gemSize) >> 1;
    this.inputEnabled = false;
    this.game.input.onDown.add((function(_this) {
      return function(p) {
        return _this.onDown(p);
      };
    })(this));
    this.game.input.onUp.add((function(_this) {
      return function(p) {
        return _this.onUp(p);
      };
    })(this));
    return this.newGame();
  };

  Match.prototype.newGame = function() {
    var i, j, k, l, m, n, ref, ref1, ref2, ref3;
    this.dragStartX = null;
    this.dragStartY = null;
    if (this.grid) {
      for (i = k = 0, ref = this.gridCX; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        for (j = l = 0, ref1 = this.gridCY; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
          if (this.grid[i][j]) {
            this.grid[i][j].sprite.destroy();
          }
        }
      }
    }
    this.grid = Array(this.gridCX);
    for (i = m = 0, ref2 = this.gridCX; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
      this.grid[i] = Array(this.gridCY);
      for (j = n = 0, ref3 = this.gridCY; 0 <= ref3 ? n < ref3 : n > ref3; j = 0 <= ref3 ? ++n : --n) {
        this.grid[i][j] = null;
      }
    }
    this.spawnGems();
    while (true) {
      this.findMatches();
      if (this.matchTotal > 0) {
        this.breakGems(true);
        this.spawnGems();
      } else {
        break;
      }
    }
    return this.chain = 1;
  };

  Match.prototype.screenToGrid = function(x, y, nearest) {
    var g;
    if (nearest == null) {
      nearest = false;
    }
    g = {
      x: Math.floor((x - this.gridX) / this.gemSize),
      y: Math.floor((y - this.gridY) / this.gemSize)
    };
    if (nearest) {
      g.x = Math.max(g.x, 0);
      g.x = Math.min(g.x, this.gridCX - 1);
      g.y = Math.max(g.y, 0);
      g.y = Math.min(g.y, this.gridCY - 1);
    } else if ((g.x < 0) || (g.x >= this.gridCX) || (g.y < 0) || (g.y >= this.gridCY)) {
      return null;
    }
    return g;
  };

  Match.prototype.gridToScreen = function(x, y) {
    var p;
    console.log;
    p = {
      x: Math.floor(x * this.gemSize) + this.gridX,
      y: Math.floor(y * this.gemSize) + this.gridY
    };
    return p;
  };

  Match.prototype.swapChain = function(startX, startY, endX, endY, dragging) {
    var deltaX, deltaY, newX, newY, results, temp, x, y;
    if (dragging == null) {
      dragging = false;
    }
    x = startX;
    y = startY;
    deltaX = endX - x;
    deltaY = endY - y;
    deltaX = Math.max(deltaX, -1);
    deltaX = Math.min(deltaX, 1);
    deltaY = Math.max(deltaY, -1);
    deltaY = Math.min(deltaY, 1);
    results = [];
    while ((x !== endX) || (y !== endY)) {
      newX = x + deltaX;
      newY = y + deltaY;
      temp = this.grid[x][y];
      this.grid[x][y] = this.grid[newX][newY];
      this.grid[newX][newY] = temp;
      if (this.grid[x][y] !== null) {
        this.grid[x][y].x = x;
        this.grid[x][y].y = y;
      }
      if (this.grid[newX][newY] !== null) {
        this.grid[newX][newY].x = newX;
        this.grid[newX][newY].y = newY;
      }
      this.moveGemHome(x, y);
      if (!dragging) {
        this.moveGemHome(newX, newY);
      }
      x = newX;
      results.push(y = newY);
    }
    return results;
  };

  Match.prototype.onDown = function(p) {
    var g, sprite;
    if (!this.inputEnabled) {
      return;
    }
    g = this.screenToGrid(p.x, p.y);
    if (g === null) {
      console.log("bad coord");
      return;
    }
    if (this.grid[g.x][g.y] !== null) {
      sprite = this.grid[g.x][g.y].sprite;
      sprite.input.enableDrag(true);
      sprite.events.onDragUpdate.add((function(_this) {
        return function(sprite, pointer, dragX, dragY, snapPoint) {
          return _this.onOver(Math.floor(dragX + (_this.gemSize / 2)), Math.floor(dragY + (_this.gemSize / 2)));
        };
      })(this));
      this.dragStartX = this.dragX = g.x;
      return this.dragStartY = this.dragY = g.y;
    }
  };

  Match.prototype.onOver = function(x, y) {
    var deltaX, deltaY, g;
    if (!this.inputEnabled) {
      return;
    }
    if ((this.dragStartX === null) || (this.dragStartY === null)) {
      return;
    }
    g = this.screenToGrid(x, y, true);
    deltaX = Math.abs(g.x - this.dragStartX);
    deltaY = Math.abs(g.y - this.dragStartY);
    if ((deltaX === 0) && (deltaY === 0)) {
      if ((this.dragX !== this.dragStartX) || (this.dragY !== this.dragStartY)) {
        this.rewindDrag();
        this.findMatches();
      }
      return;
    }
    if ((g.x === this.dragX) && (g.y === this.dragY)) {
      return;
    }
    if (deltaX < deltaY) {
      g.x = this.dragStartX;
      if (this.dragX !== this.dragStartX) {
        this.rewindDrag(true);
      }
    } else {
      g.y = this.dragStartY;
      if (this.dragY !== this.dragStartY) {
        this.rewindDrag(true);
      }
    }
    this.swapChain(this.dragX, this.dragY, g.x, g.y, true);
    this.dragX = g.x;
    this.dragY = g.y;
    return this.findMatches();
  };

  Match.prototype.onUp = function(p) {
    if (!this.inputEnabled) {
      return;
    }
    if ((this.dragStartX === null) || (this.dragStartY === null)) {
      return;
    }
    if (this.matchTotal > 0) {
      this.breakGems();
    } else {
      this.rewindDrag();
    }
    this.finishDrag();
    return this.resetMatches();
  };

  Match.prototype.finishDrag = function() {
    if ((this.dragX !== null) && (this.dragY !== null) && (this.grid[this.dragX][this.dragY] !== null)) {
      this.grid[this.dragX][this.dragY].sprite.input.enableDrag(false);
      this.grid[this.dragX][this.dragY].sprite.events.onDragUpdate.removeAll();
      this.moveGemHome(this.dragX, this.dragY);
    }
    this.dragStartX = this.dragX = null;
    return this.dragStartY = this.dragY = null;
  };

  Match.prototype.rewindDrag = function(dragging) {
    if (dragging == null) {
      dragging = false;
    }
    if ((this.dragStartX !== null) && (this.dragStartY !== null)) {
      this.swapChain(this.dragX, this.dragY, this.dragStartX, this.dragStartY, dragging);
      if (!dragging) {
        this.moveGemHome(this.dragStartX, this.dragStartY);
      }
      this.dragX = this.dragStartX;
      return this.dragY = this.dragStartY;
    }
  };

  Match.prototype.updateArt = function(gx, gy) {
    var art, gem;
    if (this.grid[gx][gy] !== null) {
      gem = this.grid[gx][gy];
      art = this.gemArtIndex(gem.type, gem.match > 0, gem.power);
      if (gem.art !== art) {
        gem.art = art;
        gem.sprite.frame = art;
      }
    }
  };

  Match.prototype.resetMatches = function() {
    var i, j, k, ref, results;
    this.matchTotal = 0;
    results = [];
    for (i = k = 0, ref = this.gridCX; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      results.push((function() {
        var l, ref1, results1;
        results1 = [];
        for (j = l = 0, ref1 = this.gridCY; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
          if (this.grid[i][j] !== null) {
            this.grid[i][j].match = 0;
            results1.push(this.updateArt(i, j));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Match.prototype.addMatchStrip = function(startX, startY, endX, endY, matchCount) {
    var k, ref, ref1, results, x, y;
    results = [];
    for (x = k = ref = startX, ref1 = endX; ref <= ref1 ? k <= ref1 : k >= ref1; x = ref <= ref1 ? ++k : --k) {
      results.push((function() {
        var l, ref2, ref3, results1;
        results1 = [];
        for (y = l = ref2 = startY, ref3 = endY; ref2 <= ref3 ? l <= ref3 : l >= ref3; y = ref2 <= ref3 ? ++l : --l) {
          this.matchTotal += matchCount;
          this.grid[x][y].match += matchCount;
          results1.push(this.updateArt(x, y));
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Match.prototype.findMatches = function() {
    var count, i, j, k, l, lastType, line, m, n, o, q, ref, ref1, ref2, ref3, ref4, ref5, results;
    this.resetMatches();
    for (i = k = 0, ref = this.gridCX; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      lastType = -1;
      count = 0;
      for (j = l = 0, ref1 = this.gridCY; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
        if (lastType === this.grid[i][j].type) {
          count += 1;
        } else {
          lastType = this.grid[i][j].type;
          if (count >= 3) {
            this.addMatchStrip(i, j - count, i, j - 1, count);
          }
          count = 1;
        }
      }
      if (count >= 3) {
        this.addMatchStrip(i, j - count, i, j - 1, count);
      }
    }
    for (j = m = 0, ref2 = this.gridCY; 0 <= ref2 ? m < ref2 : m > ref2; j = 0 <= ref2 ? ++m : --m) {
      lastType = -1;
      count = 0;
      for (i = n = 0, ref3 = this.gridCX; 0 <= ref3 ? n < ref3 : n > ref3; i = 0 <= ref3 ? ++n : --n) {
        if (lastType === this.grid[i][j].type) {
          count += 1;
        } else {
          lastType = this.grid[i][j].type;
          if (count >= 3) {
            this.addMatchStrip(i - count, j, i - 1, j, count);
          }
          count = 1;
        }
      }
      if (count >= 3) {
        this.addMatchStrip(i - count, j, i - 1, j, count);
      }
    }
    console.log("------------");
    results = [];
    for (j = o = 0, ref4 = this.gridCY; 0 <= ref4 ? o < ref4 : o > ref4; j = 0 <= ref4 ? ++o : --o) {
      line = "";
      for (i = q = 0, ref5 = this.gridCX; 0 <= ref5 ? q < ref5 : q > ref5; i = 0 <= ref5 ? ++q : --q) {
        line += this.grid[i][j].match + " ";
      }
      results.push(console.log(j + " | " + line));
    }
    return results;
  };

  Match.prototype.breakGem = function(x, y) {
    if (this.grid[x][y] !== null) {
      this.grid[x][y].sprite.destroy();
      return this.grid[x][y] = null;
    }
  };

  Match.prototype.breakGems = function(newGame) {
    var brokeOne, gem, i, j, k, l, ref, ref1;
    brokeOne = false;
    for (i = k = 0, ref = this.gridCX; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      for (j = l = 0, ref1 = this.gridCY; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
        gem = this.grid[i][j];
        if ((gem !== null) && (gem.match > 0)) {
          if (!newGame) {
            this.emitScoreParticle(i, j, gem.type, gem.match * this.chain);
          }
          this.breakGem(i, j);
          brokeOne = true;
        }
      }
    }
    if (brokeOne) {
      this.chain *= 10;
    }
    return this.spawnGems();
  };

  Match.prototype.gemArtIndex = function(type, highlight, power) {
    var index;
    if (highlight == null) {
      highlight = false;
    }
    if (power == null) {
      power = 0;
    }
    index = (function() {
      switch (type) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
          return type;
        case 5:
        case 6:
        case 7:
          return 7 + (3 * (type - 5));
      }
    })();
    if (highlight) {
      index += 16;
    }
    index += power;
    return index;
  };

  Match.prototype.emitScoreParticle = function(gridX, gridY, type, score) {
    var p, style, text, textColor;
    textColor = "#fff";
    if (type === 0) {
      score *= -1;
      textColor = "#f66";
    }
    p = this.gridToScreen(gridX, gridY);
    style = {
      font: "bold 24px Arial",
      fill: textColor,
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    text = this.game.add.text(p.x, p.y, "" + score, style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    text.setTextBounds(0, 0, this.gemSize, this.gemSize);
    this.game.add.tween(text).to({
      y: p.y - (this.gemSize / 4),
      alpha: 0
    }, 1000, Phaser.Easing.Quartic.In, true);
    this.game.add.tween(text.scale).to({
      x: 2,
      y: 2
    }, 1000, Phaser.Easing.Linear.None, true);
    return this.game.time.events.add(1000, function() {
      return text.destroy();
    });
  };

  Match.prototype.bestGemToSpawn = function() {
    return Math.floor(Math.random() * 8);
  };

  Match.prototype.moveGemHome = function(gx, gy, bounce) {
    var easing, gem, speed, x, y;
    if (bounce == null) {
      bounce = false;
    }
    gem = this.grid[gx][gy];
    if (gem === null) {
      return;
    }
    x = this.gridX + (gx * this.gemSize);
    y = this.gridY + (gy * this.gemSize);
    easing = Phaser.Easing.Linear.None;
    speed = this.gemSwapSpeed;
    if (bounce) {
      easing = Phaser.Easing.Bounce.Out;
      speed = this.gemBounceSpeed;
    }
    return this.game.add.tween(gem.sprite).to({
      x: x,
      y: y
    }, speed, easing, true);
  };

  Match.prototype.spawnGems = function() {
    var art, gem, gemType, i, j, k, l, m, match, n, newGrid, newIndex, o, oldIndex, power, ref, ref1, ref2, ref3, ref4, spawnedGem, sprite, x, y;
    newGrid = Array(this.gridCX);
    for (i = k = 0, ref = this.gridCX; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      newGrid[i] = Array(this.gridCY);
      oldIndex = newIndex = this.gridCY - 1;
      while (oldIndex >= 0) {
        if (this.grid[i][oldIndex] !== null) {
          newGrid[i][newIndex] = this.grid[i][oldIndex];
          newIndex -= 1;
        }
        oldIndex -= 1;
      }
      while (newIndex >= 0) {
        newGrid[i][newIndex] = null;
        newIndex -= 1;
      }
    }
    this.grid = newGrid;
    for (i = l = 0, ref1 = this.gridCX; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
      for (j = m = 0, ref2 = this.gridCY; 0 <= ref2 ? m < ref2 : m > ref2; j = 0 <= ref2 ? ++m : --m) {
        gem = this.grid[i][j];
        if (gem === null) {
          continue;
        }
        if ((gem.x !== i) || (gem.y !== j)) {
          gem.x = i;
          gem.y = j;
          this.moveGemHome(i, j, true);
        }
      }
    }
    spawnedGem = false;
    for (i = n = 0, ref3 = this.gridCX; 0 <= ref3 ? n < ref3 : n > ref3; i = 0 <= ref3 ? ++n : --n) {
      for (j = o = 0, ref4 = this.gridCY; 0 <= ref4 ? o < ref4 : o > ref4; j = 0 <= ref4 ? ++o : --o) {
        if (this.grid[i][j] === null) {
          spawnedGem = true;
          gemType = this.bestGemToSpawn();
          match = 0;
          power = false;
          x = this.gridX + (i * this.gemSize);
          y = this.gridY + (j * this.gemSize);
          art = this.gemArtIndex(gemType, match > 0, power);
          sprite = this.game.add.sprite(x, y - this.gridH, 'gems', art);
          sprite.width = this.gemSize;
          sprite.height = this.gemSize;
          sprite.inputEnabled = true;
          this.game.world.sendToBack(sprite);
          this.game.add.tween(sprite).to({
            y: y
          }, this.gemBounceSpeed, Phaser.Easing.Bounce.Out, true);
          this.grid[i][j] = {
            sprite: sprite,
            x: i,
            y: j,
            type: gemType,
            match: match,
            power: power,
            art: art
          };
        }
      }
    }
    if (spawnedGem) {
      console.log("input disabled");
      this.inputEnabled = false;
      this.thinkLater(this.gemBounceSpeed);
    }
    return spawnedGem;
  };

  Match.prototype.thinkLater = function(t) {
    return this.game.time.events.add(t, (function(_this) {
      return function() {
        return _this.think();
      };
    })(this));
  };

  Match.prototype.think = function() {
    console.log("think()");
    if (!this.spawnGems()) {
      this.findMatches();
      if (this.matchTotal > 0) {
        return this.breakGems();
      } else {
        console.log("input enabled");
        this.inputEnabled = true;
        return this.chain = 1;
      }
    }
  };

  return Match;

})();

module.exports = Match;


},{}],2:[function(require,module,exports){
var Match, init, onDeviceReady;

Match = require('./Match');

onDeviceReady = function() {
  console.log('deviceready');
  return window.match = new Match;
};

init = function() {
  console.log("init");
  return document.addEventListener('deviceready', onDeviceReady, false);
};

init();


},{"./Match":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dcXHNyY1xcTWF0Y2guY29mZmVlIiwid3d3XFxzcmNcXG1haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBTTtFQUNTLGVBQUE7SUFDWCxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCLE1BQU0sQ0FBQyxNQUFuQyxFQUEyQyxnQkFBM0MsRUFBNkQ7TUFDdkUsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRDhEO01BRXZFLE1BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUY4RDtLQUE3RDtJQU1aLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsTUFBRCxHQUFVO0lBRVYsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7RUFYTDs7a0JBYWIsT0FBQSxHQUFTLFNBQUE7SUFDUCxPQUFPLENBQUMsR0FBUixDQUFZLGlCQUFaO1dBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBWCxDQUF1QixNQUF2QixFQUErQixjQUEvQixFQUErQyxFQUEvQyxFQUFtRCxFQUFuRCxFQUF1RCxDQUFDLENBQXhELEVBQTJELENBQTNELEVBQThELENBQTlEO0VBRk87O2tCQUlULE1BQUEsR0FBUSxTQUFBO0lBQ04sT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBQSxHQUFtQixNQUFNLENBQUMsVUFBMUIsR0FBcUMsR0FBckMsR0FBd0MsTUFBTSxDQUFDLFdBQTNEO0lBQ0EsSUFB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LEVBREY7T0FBQSxNQUFBO1FBR0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSxlQUFaO1FBQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7ZUFDaEIsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUxYO09BRkY7O0VBRks7Ozs7OztBQVdULE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDdlpqQixJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjs7QUFFUixhQUFBLEdBQWdCLFNBQUE7RUFDZCxPQUFPLENBQUMsR0FBUixDQUFZLGFBQVo7U0FDQSxNQUFNLENBQUMsS0FBUCxHQUFlLElBQUk7QUFGTDs7QUFJaEIsSUFBQSxHQUFPLFNBQUE7RUFDTCxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVo7U0FDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsYUFBMUIsRUFBeUMsYUFBekMsRUFBd0QsS0FBeEQ7QUFGSzs7QUFJUCxJQUFBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgTWF0Y2hcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEBnYW1lID0gbmV3IFBoYXNlci5HYW1lIFwiMTAwJVwiLCBcIjEwMCVcIiwgUGhhc2VyLkNBTlZBUywgJ3BoYXNlci1leGFtcGxlJywge1xyXG4gICAgICBwcmVsb2FkOiA9PiBAcHJlbG9hZCgpXHJcbiAgICAgIGNyZWF0ZTogID0+IEBjcmVhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgICMgR3JpZCBnZW0gY291bnRzXHJcbiAgICBAZ3JpZENYID0gOFxyXG4gICAgQGdyaWRDWSA9IDdcclxuXHJcbiAgICBAZ2VtQm91bmNlU3BlZWQgPSA0MDBcclxuICAgIEBnZW1Td2FwU3BlZWQgPSAxMDBcclxuXHJcbiAgcHJlbG9hZDogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiTWF0Y2gucHJlbG9hZCgpXCJcclxuICAgIEBnYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ2dlbXMnLCAnaW1nL2dlbXMucG5nJywgODAsIDgwLCAtMSwgNCwgNClcclxuXHJcbiAgY3JlYXRlOiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJNYXRjaC5jcmVhdGUoKTogI3t3aW5kb3cuaW5uZXJXaWR0aH14I3t3aW5kb3cuaW5uZXJIZWlnaHR9XCJcclxuICAgIEBzY3JlZW5XID0gd2luZG93LmlubmVyV2lkdGhcclxuICAgIEBzY3JlZW5IID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICBpZiBAc2NyZWVuVyA+IEBzY3JlZW5IXHJcbiAgICAgIEBzY3JlZW5XID0gTWF0aC5mbG9vcihAc2NyZWVuSCAvIDE2ICogOSlcclxuICAgIGNvbnNvbGUubG9nIFwiY3JlYXRlZCBzY3JlZW4gI3tAc2NyZWVuV314I3tAc2NyZWVuSH1cIlxyXG5cclxuICAgIEBnZW1TaXplID0gQHNjcmVlblcgLyBAZ3JpZENYXHJcbiAgICBAZ3JpZFcgPSBAZ2VtU2l6ZSAqIEBncmlkQ1hcclxuICAgIEBncmlkSCA9IEBnZW1TaXplICogQGdyaWRDWVxyXG4gICAgQGdyaWRYID0gMFxyXG4gICAgQGdyaWRZID0gKChAc2NyZWVuSCAtIChAZ2VtU2l6ZSAqIEBncmlkQ1kpKSAtIEBnZW1TaXplKSA+PiAxXHJcbiAgICBAaW5wdXRFbmFibGVkID0gZmFsc2VcclxuXHJcbiAgICBAZ2FtZS5pbnB1dC5vbkRvd24uYWRkIChwKSA9PiBAb25Eb3duKHApXHJcbiAgICBAZ2FtZS5pbnB1dC5vblVwLmFkZCAocCkgPT4gQG9uVXAocClcclxuXHJcbiAgICBAbmV3R2FtZSgpXHJcblxyXG4gIG5ld0dhbWU6IC0+XHJcbiAgICBAZHJhZ1N0YXJ0WCA9IG51bGxcclxuICAgIEBkcmFnU3RhcnRZID0gbnVsbFxyXG5cclxuICAgIGlmIEBncmlkXHJcbiAgICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgICAgICBpZiBAZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgICBAZ3JpZFtpXVtqXS5zcHJpdGUuZGVzdHJveSgpXHJcblxyXG4gICAgQGdyaWQgPSBBcnJheShAZ3JpZENYKVxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICBAZ3JpZFtpXSA9IEFycmF5KEBncmlkQ1kpXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBAZ3JpZFtpXVtqXSA9IG51bGxcclxuXHJcbiAgICBAc3Bhd25HZW1zKClcclxuICAgIGxvb3BcclxuICAgICAgQGZpbmRNYXRjaGVzKClcclxuICAgICAgaWYgQG1hdGNoVG90YWwgPiAwXHJcbiAgICAgICAgQGJyZWFrR2Vtcyh0cnVlKVxyXG4gICAgICAgIEBzcGF3bkdlbXMoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAjIFRPRE86IHJlc2V0IHNjb3JlIGhlcmVcclxuICAgIEBjaGFpbiA9IDFcclxuXHJcbiAgc2NyZWVuVG9HcmlkOiAoeCwgeSwgbmVhcmVzdD1mYWxzZSkgLT5cclxuICAgIGcgPVxyXG4gICAgICB4OiBNYXRoLmZsb29yKCh4IC0gQGdyaWRYKSAvIEBnZW1TaXplKVxyXG4gICAgICB5OiBNYXRoLmZsb29yKCh5IC0gQGdyaWRZKSAvIEBnZW1TaXplKVxyXG4gICAgaWYgbmVhcmVzdFxyXG4gICAgICBnLnggPSBNYXRoLm1heChnLngsIDApXHJcbiAgICAgIGcueCA9IE1hdGgubWluKGcueCwgQGdyaWRDWCAtIDEpXHJcbiAgICAgIGcueSA9IE1hdGgubWF4KGcueSwgMClcclxuICAgICAgZy55ID0gTWF0aC5taW4oZy55LCBAZ3JpZENZIC0gMSlcclxuICAgIGVsc2UgaWYgKGcueCA8IDApIG9yIChnLnggPj0gQGdyaWRDWCkgb3IgKGcueSA8IDApIG9yIChnLnkgPj0gQGdyaWRDWSlcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIHJldHVybiBnXHJcblxyXG4gIGdyaWRUb1NjcmVlbjogKHgsIHkpIC0+XHJcbiAgICBjb25zb2xlLmxvZ1xyXG4gICAgcCA9XHJcbiAgICAgIHg6IE1hdGguZmxvb3IoeCAqIEBnZW1TaXplKSArIEBncmlkWFxyXG4gICAgICB5OiBNYXRoLmZsb29yKHkgKiBAZ2VtU2l6ZSkgKyBAZ3JpZFlcclxuICAgIHJldHVybiBwXHJcblxyXG4gIHN3YXBDaGFpbjogKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZLCBkcmFnZ2luZz1mYWxzZSkgLT5cclxuICAgIHggPSBzdGFydFhcclxuICAgIHkgPSBzdGFydFlcclxuICAgIGRlbHRhWCA9IGVuZFggLSB4XHJcbiAgICBkZWx0YVkgPSBlbmRZIC0geVxyXG4gICAgZGVsdGFYID0gTWF0aC5tYXgoZGVsdGFYLCAtMSlcclxuICAgIGRlbHRhWCA9IE1hdGgubWluKGRlbHRhWCwgMSlcclxuICAgIGRlbHRhWSA9IE1hdGgubWF4KGRlbHRhWSwgLTEpXHJcbiAgICBkZWx0YVkgPSBNYXRoLm1pbihkZWx0YVksIDEpXHJcbiAgICB3aGlsZSAoeCAhPSBlbmRYKSBvciAoeSAhPSBlbmRZKVxyXG4gICAgICBuZXdYID0geCArIGRlbHRhWFxyXG4gICAgICBuZXdZID0geSArIGRlbHRhWVxyXG4gICAgICAjIGNvbnNvbGUubG9nIFwiU1dBUCAje3h9ICN7eX0gPC0+ICN7bmV3WH0gI3tuZXdZfVwiXHJcbiAgICAgIHRlbXAgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICBAZ3JpZFt4XVt5XSA9IEBncmlkW25ld1hdW25ld1ldXHJcbiAgICAgIEBncmlkW25ld1hdW25ld1ldID0gdGVtcFxyXG4gICAgICBpZiBAZ3JpZFt4XVt5XSAhPSBudWxsXHJcbiAgICAgICAgQGdyaWRbeF1beV0ueCA9IHhcclxuICAgICAgICBAZ3JpZFt4XVt5XS55ID0geVxyXG4gICAgICBpZiBAZ3JpZFtuZXdYXVtuZXdZXSAhPSBudWxsXHJcbiAgICAgICAgQGdyaWRbbmV3WF1bbmV3WV0ueCA9IG5ld1hcclxuICAgICAgICBAZ3JpZFtuZXdYXVtuZXdZXS55ID0gbmV3WVxyXG4gICAgICBAbW92ZUdlbUhvbWUoeCwgeSlcclxuICAgICAgaWYgbm90IGRyYWdnaW5nXHJcbiAgICAgICAgQG1vdmVHZW1Ib21lKG5ld1gsIG5ld1kpXHJcbiAgICAgIHggPSBuZXdYXHJcbiAgICAgIHkgPSBuZXdZXHJcblxyXG4gIG9uRG93bjogKHApIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiZG93blwiLCBbcC54LHAueSxwLnNjcmVlblgscC5zY3JlZW5ZXVxyXG4gICAgaWYgbm90IEBpbnB1dEVuYWJsZWRcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgZyA9IEBzY3JlZW5Ub0dyaWQocC54LCBwLnkpXHJcbiAgICBpZiBnID09IG51bGxcclxuICAgICAgY29uc29sZS5sb2cgXCJiYWQgY29vcmRcIlxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBpZiBAZ3JpZFtnLnhdW2cueV0gIT0gbnVsbFxyXG4gICAgICAjIGNvbnNvbGUubG9nIFwiZW5hYmxpbmcgZHJhZyBvbiAje2cueH0gI3tnLnl9XCJcclxuICAgICAgc3ByaXRlID0gQGdyaWRbZy54XVtnLnldLnNwcml0ZVxyXG4gICAgICBzcHJpdGUuaW5wdXQuZW5hYmxlRHJhZyh0cnVlKVxyXG4gICAgICBzcHJpdGUuZXZlbnRzLm9uRHJhZ1VwZGF0ZS5hZGQgKHNwcml0ZSwgcG9pbnRlciwgZHJhZ1gsIGRyYWdZLCBzbmFwUG9pbnQpID0+XHJcbiAgICAgICAgIyBIYXZlIHRvIGFkZCBoYWxmIGEgZ2VtIGJlY2F1c2UgZHJhZ1gvWSBpcyB0aGUgdG9wbGVmdCBvZiB0aGUgZHJhZ2dlZCBnZW1cclxuICAgICAgICBAb25PdmVyKE1hdGguZmxvb3IoZHJhZ1ggKyAoQGdlbVNpemUgLyAyKSksIE1hdGguZmxvb3IoZHJhZ1kgKyAoQGdlbVNpemUgLyAyKSkpXHJcbiAgICAgIEBkcmFnU3RhcnRYID0gQGRyYWdYID0gZy54XHJcbiAgICAgIEBkcmFnU3RhcnRZID0gQGRyYWdZID0gZy55XHJcblxyXG4gIG9uT3ZlcjogKHgsIHkpIC0+XHJcbiAgICBpZiBub3QgQGlucHV0RW5hYmxlZFxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBpZiAoQGRyYWdTdGFydFggPT0gbnVsbCkgb3IgKEBkcmFnU3RhcnRZID09IG51bGwpXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGcgPSBAc2NyZWVuVG9HcmlkKHgsIHksIHRydWUpXHJcbiAgICBkZWx0YVggPSBNYXRoLmFicyhnLnggLSBAZHJhZ1N0YXJ0WClcclxuICAgIGRlbHRhWSA9IE1hdGguYWJzKGcueSAtIEBkcmFnU3RhcnRZKVxyXG4gICAgaWYgKGRlbHRhWCA9PSAwKSBhbmQgKGRlbHRhWSA9PSAwKVxyXG4gICAgICBpZiAoQGRyYWdYICE9IEBkcmFnU3RhcnRYKSBvciAoQGRyYWdZICE9IEBkcmFnU3RhcnRZKVxyXG4gICAgICAgIEByZXdpbmREcmFnKClcclxuICAgICAgICBAZmluZE1hdGNoZXMoKVxyXG4gICAgICByZXR1cm5cclxuICAgIGlmIChnLnggPT0gQGRyYWdYKSBhbmQgKGcueSA9PSBAZHJhZ1kpXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGlmIGRlbHRhWCA8IGRlbHRhWVxyXG4gICAgICBnLnggPSBAZHJhZ1N0YXJ0WFxyXG4gICAgICBpZiBAZHJhZ1ggIT0gQGRyYWdTdGFydFhcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwicmV3aW5kaW5nIGRyYWcgWCAje2RlbHRhWH0gI3tkZWx0YVl9XCJcclxuICAgICAgICBAcmV3aW5kRHJhZyh0cnVlKVxyXG4gICAgZWxzZVxyXG4gICAgICBnLnkgPSBAZHJhZ1N0YXJ0WVxyXG4gICAgICBpZiBAZHJhZ1kgIT0gQGRyYWdTdGFydFlcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwicmV3aW5kaW5nIGRyYWcgWSAje2RlbHRhWH0gI3tkZWx0YVl9XCJcclxuICAgICAgICBAcmV3aW5kRHJhZyh0cnVlKVxyXG5cclxuICAgIEBzd2FwQ2hhaW4oQGRyYWdYLCBAZHJhZ1ksIGcueCwgZy55LCB0cnVlKVxyXG4gICAgQGRyYWdYID0gZy54XHJcbiAgICBAZHJhZ1kgPSBnLnlcclxuICAgIEBmaW5kTWF0Y2hlcygpXHJcblxyXG4gIG9uVXA6IChwKSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcInVwXCIsIFtwLngscC55LHAuc2NyZWVuWCxwLnNjcmVlblldXHJcbiAgICBpZiBub3QgQGlucHV0RW5hYmxlZFxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBpZiAoQGRyYWdTdGFydFggPT0gbnVsbCkgb3IgKEBkcmFnU3RhcnRZID09IG51bGwpXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGlmIEBtYXRjaFRvdGFsID4gMFxyXG4gICAgICBAYnJlYWtHZW1zKClcclxuICAgIGVsc2VcclxuICAgICAgQHJld2luZERyYWcoKVxyXG4gICAgQGZpbmlzaERyYWcoKVxyXG4gICAgQHJlc2V0TWF0Y2hlcygpXHJcblxyXG4gIGZpbmlzaERyYWc6IC0+XHJcbiAgICBpZiAoQGRyYWdYICE9IG51bGwpIGFuZCAoQGRyYWdZICE9IG51bGwpIGFuZCAoQGdyaWRbQGRyYWdYXVtAZHJhZ1ldICE9IG51bGwpXHJcbiAgICAgIEBncmlkW0BkcmFnWF1bQGRyYWdZXS5zcHJpdGUuaW5wdXQuZW5hYmxlRHJhZyhmYWxzZSlcclxuICAgICAgQGdyaWRbQGRyYWdYXVtAZHJhZ1ldLnNwcml0ZS5ldmVudHMub25EcmFnVXBkYXRlLnJlbW92ZUFsbCgpXHJcbiAgICAgIEBtb3ZlR2VtSG9tZShAZHJhZ1gsIEBkcmFnWSlcclxuICAgIEBkcmFnU3RhcnRYID0gQGRyYWdYID0gbnVsbFxyXG4gICAgQGRyYWdTdGFydFkgPSBAZHJhZ1kgPSBudWxsXHJcblxyXG4gIHJld2luZERyYWc6IChkcmFnZ2luZz1mYWxzZSkgLT5cclxuICAgIGlmIChAZHJhZ1N0YXJ0WCAhPSBudWxsKSBhbmQgKEBkcmFnU3RhcnRZICE9IG51bGwpXHJcbiAgICAgICMgY29uc29sZS5sb2cgXCJtb3ZpbmcgKCN7QGRyYWdYfSwgI3tAZHJhZ1l9KSBob21lICgje0BkcmFnU3RhcnRYfSwgI3tAZHJhZ1N0YXJ0WX0pXCJcclxuICAgICAgQHN3YXBDaGFpbihAZHJhZ1gsIEBkcmFnWSwgQGRyYWdTdGFydFgsIEBkcmFnU3RhcnRZLCBkcmFnZ2luZylcclxuICAgICAgaWYgbm90IGRyYWdnaW5nXHJcbiAgICAgICAgQG1vdmVHZW1Ib21lKEBkcmFnU3RhcnRYLCBAZHJhZ1N0YXJ0WSlcclxuICAgICAgQGRyYWdYID0gQGRyYWdTdGFydFhcclxuICAgICAgQGRyYWdZID0gQGRyYWdTdGFydFlcclxuXHJcbiAgdXBkYXRlQXJ0OiAoZ3gsIGd5KSAtPlxyXG4gICAgaWYgQGdyaWRbZ3hdW2d5XSAhPSBudWxsXHJcbiAgICAgIGdlbSA9IEBncmlkW2d4XVtneV1cclxuICAgICAgYXJ0ID0gQGdlbUFydEluZGV4KGdlbS50eXBlLCAoZ2VtLm1hdGNoID4gMCksIGdlbS5wb3dlcilcclxuICAgICAgaWYgZ2VtLmFydCAhPSBhcnRcclxuICAgICAgICBnZW0uYXJ0ID0gYXJ0XHJcbiAgICAgICAgZ2VtLnNwcml0ZS5mcmFtZSA9IGFydFxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlc2V0TWF0Y2hlczogLT5cclxuICAgIEBtYXRjaFRvdGFsID0gMFxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0gIT0gbnVsbFxyXG4gICAgICAgICAgQGdyaWRbaV1bal0ubWF0Y2ggPSAwXHJcbiAgICAgICAgICBAdXBkYXRlQXJ0KGksIGopXHJcblxyXG4gIGFkZE1hdGNoU3RyaXA6IChzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSwgbWF0Y2hDb3VudCkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJhZGRNYXRjaFN0cmlwKCN7c3RhcnRYfSwgI3tzdGFydFl9LCAje2VuZFh9LCAje2VuZFl9KVwiXHJcbiAgICBmb3IgeCBpbiBbc3RhcnRYLi5lbmRYXVxyXG4gICAgICBmb3IgeSBpbiBbc3RhcnRZLi5lbmRZXVxyXG4gICAgICAgIEBtYXRjaFRvdGFsICs9IG1hdGNoQ291bnRcclxuICAgICAgICBAZ3JpZFt4XVt5XS5tYXRjaCArPSBtYXRjaENvdW50XHJcbiAgICAgICAgQHVwZGF0ZUFydCh4LCB5KVxyXG5cclxuICBmaW5kTWF0Y2hlczogLT5cclxuICAgIEByZXNldE1hdGNoZXMoKVxyXG5cclxuICAgICMgZXcsIGNvcHlwYXN0YVxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICBsYXN0VHlwZSA9IC0xXHJcbiAgICAgIGNvdW50ID0gMFxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgICAgaWYgbGFzdFR5cGUgPT0gQGdyaWRbaV1bal0udHlwZVxyXG4gICAgICAgICAgY291bnQgKz0gMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGxhc3RUeXBlID0gQGdyaWRbaV1bal0udHlwZVxyXG4gICAgICAgICAgaWYgY291bnQgPj0gM1xyXG4gICAgICAgICAgICBAYWRkTWF0Y2hTdHJpcChpLCBqIC0gY291bnQsIGksIGogLSAxLCBjb3VudClcclxuICAgICAgICAgIGNvdW50ID0gMVxyXG4gICAgICBpZiBjb3VudCA+PSAzXHJcbiAgICAgICAgQGFkZE1hdGNoU3RyaXAoaSwgaiAtIGNvdW50LCBpLCBqIC0gMSwgY291bnQpXHJcbiAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgIGxhc3RUeXBlID0gLTFcclxuICAgICAgY291bnQgPSAwXHJcbiAgICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgICBpZiBsYXN0VHlwZSA9PSBAZ3JpZFtpXVtqXS50eXBlXHJcbiAgICAgICAgICBjb3VudCArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbGFzdFR5cGUgPSBAZ3JpZFtpXVtqXS50eXBlXHJcbiAgICAgICAgICBpZiBjb3VudCA+PSAzXHJcbiAgICAgICAgICAgIEBhZGRNYXRjaFN0cmlwKGkgLSBjb3VudCwgaiwgaSAtIDEsIGosIGNvdW50KVxyXG4gICAgICAgICAgY291bnQgPSAxXHJcbiAgICAgIGlmIGNvdW50ID49IDNcclxuICAgICAgICBAYWRkTWF0Y2hTdHJpcChpIC0gY291bnQsIGosIGkgLSAxLCBqLCBjb3VudClcclxuXHJcbiAgICBjb25zb2xlLmxvZyBcIi0tLS0tLS0tLS0tLVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgIGxpbmUgPSBcIlwiXHJcbiAgICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgICBsaW5lICs9IFwiI3tAZ3JpZFtpXVtqXS5tYXRjaH0gXCJcclxuICAgICAgY29uc29sZS5sb2cgXCIje2p9IHwgI3tsaW5lfVwiXHJcblxyXG4gIGJyZWFrR2VtOiAoeCwgeSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJicmVha0dlbSgje3h9LCAje3l9KVwiXHJcbiAgICBpZiBAZ3JpZFt4XVt5XSAhPSBudWxsXHJcbiAgICAgIEBncmlkW3hdW3ldLnNwcml0ZS5kZXN0cm95KClcclxuICAgICAgQGdyaWRbeF1beV0gPSBudWxsXHJcblxyXG4gIGJyZWFrR2VtczogKG5ld0dhbWUpIC0+XHJcbiAgICBicm9rZU9uZSA9IGZhbHNlXHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBnZW0gPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGlmIChnZW0gIT0gbnVsbCkgYW5kIChnZW0ubWF0Y2ggPiAwKVxyXG4gICAgICAgICAgaWYgbm90IG5ld0dhbWVcclxuICAgICAgICAgICAgQGVtaXRTY29yZVBhcnRpY2xlKGksIGosIGdlbS50eXBlLCBnZW0ubWF0Y2ggKiBAY2hhaW4pXHJcbiAgICAgICAgICBAYnJlYWtHZW0oaSwgailcclxuICAgICAgICAgIGJyb2tlT25lID0gdHJ1ZVxyXG4gICAgaWYgYnJva2VPbmVcclxuICAgICAgQGNoYWluICo9IDEwXHJcbiAgICBAc3Bhd25HZW1zKClcclxuXHJcbiAgZ2VtQXJ0SW5kZXg6ICh0eXBlLCBoaWdobGlnaHQ9ZmFsc2UsIHBvd2VyPTApIC0+XHJcbiAgICBpbmRleCA9IHN3aXRjaCB0eXBlXHJcbiAgICAgIHdoZW4gMCwgMSwgMiwgMywgNFxyXG4gICAgICAgIHR5cGVcclxuICAgICAgd2hlbiA1LCA2LCA3XHJcbiAgICAgICAgNyArICgzICogKHR5cGUgLSA1KSlcclxuICAgIGlmIGhpZ2hsaWdodFxyXG4gICAgICBpbmRleCArPSAxNlxyXG4gICAgaW5kZXggKz0gcG93ZXJcclxuICAgIHJldHVybiBpbmRleFxyXG5cclxuICBlbWl0U2NvcmVQYXJ0aWNsZTogKGdyaWRYLCBncmlkWSwgdHlwZSwgc2NvcmUpIC0+XHJcbiAgICAjIGhhY2tcclxuICAgIHRleHRDb2xvciA9IFwiI2ZmZlwiXHJcbiAgICBpZiB0eXBlID09IDAgIyBicm9rZW5cclxuICAgICAgc2NvcmUgKj0gLTFcclxuICAgICAgdGV4dENvbG9yID0gXCIjZjY2XCJcclxuXHJcbiAgICBwID0gQGdyaWRUb1NjcmVlbihncmlkWCwgZ3JpZFkpXHJcbiAgICBzdHlsZSA9IHsgZm9udDogXCJib2xkIDI0cHggQXJpYWxcIiwgZmlsbDogdGV4dENvbG9yLCBib3VuZHNBbGlnbkg6IFwiY2VudGVyXCIsIGJvdW5kc0FsaWduVjogXCJtaWRkbGVcIiB9XHJcbiAgICB0ZXh0ID0gQGdhbWUuYWRkLnRleHQocC54LCBwLnksIFwiXCIrc2NvcmUsIHN0eWxlKVxyXG4gICAgdGV4dC5zZXRTaGFkb3coMywgMywgJ3JnYmEoMCwwLDAsMC41KScsIDIpXHJcbiAgICB0ZXh0LnNldFRleHRCb3VuZHMoMCwgMCwgQGdlbVNpemUsIEBnZW1TaXplKTtcclxuICAgIEBnYW1lLmFkZC50d2Vlbih0ZXh0KS50byh7IHk6IHAueSAtIChAZ2VtU2l6ZSAvIDQpLCBhbHBoYTogMCB9LCAxMDAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuSW4sIHRydWUpXHJcbiAgICBAZ2FtZS5hZGQudHdlZW4odGV4dC5zY2FsZSkudG8oeyB4OiAyLCB5OiAyIH0sIDEwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUpXHJcbiAgICBAZ2FtZS50aW1lLmV2ZW50cy5hZGQgMTAwMCwgLT5cclxuICAgICAgdGV4dC5kZXN0cm95KClcclxuXHJcbiAgYmVzdEdlbVRvU3Bhd246IC0+XHJcbiAgICAjIFRPRE86IERlY2lkZSBiYXNlZCBvbiBjdXJyZW50IGdlbSBkaXN0cmlidXRpb25cclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA4KVxyXG5cclxuICBtb3ZlR2VtSG9tZTogKGd4LCBneSwgYm91bmNlPWZhbHNlKSAtPlxyXG4gICAgZ2VtID0gQGdyaWRbZ3hdW2d5XVxyXG4gICAgaWYgZ2VtID09IG51bGxcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgIyBjb25zb2xlLmxvZyBcIm1vdmVHZW1Ib21lKCN7Z3h9LCAje2d5fSlcIlxyXG5cclxuICAgIHggPSBAZ3JpZFggKyAoZ3ggKiBAZ2VtU2l6ZSlcclxuICAgIHkgPSBAZ3JpZFkgKyAoZ3kgKiBAZ2VtU2l6ZSlcclxuICAgIGVhc2luZyA9IFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmVcclxuICAgIHNwZWVkID0gQGdlbVN3YXBTcGVlZFxyXG4gICAgaWYgYm91bmNlXHJcbiAgICAgIGVhc2luZyA9IFBoYXNlci5FYXNpbmcuQm91bmNlLk91dFxyXG4gICAgICBzcGVlZCA9IEBnZW1Cb3VuY2VTcGVlZFxyXG4gICAgQGdhbWUuYWRkLnR3ZWVuKGdlbS5zcHJpdGUpLnRvKHsgeDogeCwgeTogeSB9LCBzcGVlZCwgZWFzaW5nLCB0cnVlKVxyXG5cclxuICBzcGF3bkdlbXM6IC0+XHJcbiAgICAjIGRyb3AgZ2VtcyBmcm9tIGhpZ2hlciB1cCBzbG90cyBkb3duXHJcbiAgICBuZXdHcmlkID0gQXJyYXkoQGdyaWRDWClcclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgbmV3R3JpZFtpXSA9IEFycmF5KEBncmlkQ1kpXHJcbiAgICAgIG9sZEluZGV4ID0gbmV3SW5kZXggPSBAZ3JpZENZIC0gMVxyXG4gICAgICB3aGlsZSBvbGRJbmRleCA+PSAwXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bb2xkSW5kZXhdICE9IG51bGxcclxuICAgICAgICAgIG5ld0dyaWRbaV1bbmV3SW5kZXhdID0gQGdyaWRbaV1bb2xkSW5kZXhdXHJcbiAgICAgICAgICBuZXdJbmRleCAtPSAxXHJcbiAgICAgICAgb2xkSW5kZXggLT0gMVxyXG4gICAgICB3aGlsZSBuZXdJbmRleCA+PSAwXHJcbiAgICAgICAgbmV3R3JpZFtpXVtuZXdJbmRleF0gPSBudWxsXHJcbiAgICAgICAgbmV3SW5kZXggLT0gMVxyXG4gICAgQGdyaWQgPSBuZXdHcmlkXHJcblxyXG4gICAgIyB1cGRhdGUgc3ByaXRlcyBhbmQgeC95XHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBnZW0gPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGlmIGdlbSA9PSBudWxsXHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIGlmIChnZW0ueCAhPSBpKSBvciAoZ2VtLnkgIT0gailcclxuICAgICAgICAgIGdlbS54ID0gaVxyXG4gICAgICAgICAgZ2VtLnkgPSBqXHJcbiAgICAgICAgICBAbW92ZUdlbUhvbWUoaSwgaiwgdHJ1ZSlcclxuXHJcbiAgICAjIGRyb3AgZnJvbSB0aGUgdG9wXHJcbiAgICBzcGF3bmVkR2VtID0gZmFsc2VcclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgZm9yIGogaW4gWzAuLi5AZ3JpZENZXVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdID09IG51bGxcclxuICAgICAgICAgIHNwYXduZWRHZW0gPSB0cnVlXHJcbiAgICAgICAgICBnZW1UeXBlID0gQGJlc3RHZW1Ub1NwYXduKClcclxuICAgICAgICAgIG1hdGNoID0gMFxyXG4gICAgICAgICAgcG93ZXIgPSBmYWxzZVxyXG4gICAgICAgICAgeCA9IEBncmlkWCArIChpICogQGdlbVNpemUpXHJcbiAgICAgICAgICB5ID0gQGdyaWRZICsgKGogKiBAZ2VtU2l6ZSlcclxuICAgICAgICAgIGFydCA9IEBnZW1BcnRJbmRleChnZW1UeXBlLCAobWF0Y2ggPiAwKSwgcG93ZXIpXHJcbiAgICAgICAgICBzcHJpdGUgPSBAZ2FtZS5hZGQuc3ByaXRlKHgsIHkgLSBAZ3JpZEgsICdnZW1zJywgYXJ0KVxyXG4gICAgICAgICAgc3ByaXRlLndpZHRoID0gQGdlbVNpemVcclxuICAgICAgICAgIHNwcml0ZS5oZWlnaHQgPSBAZ2VtU2l6ZVxyXG4gICAgICAgICAgc3ByaXRlLmlucHV0RW5hYmxlZCA9IHRydWVcclxuICAgICAgICAgIEBnYW1lLndvcmxkLnNlbmRUb0JhY2soc3ByaXRlKVxyXG4gICAgICAgICAgQGdhbWUuYWRkLnR3ZWVuKHNwcml0ZSkudG8oeyB5OiB5IH0sIEBnZW1Cb3VuY2VTcGVlZCwgUGhhc2VyLkVhc2luZy5Cb3VuY2UuT3V0LCB0cnVlKVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPVxyXG4gICAgICAgICAgICBzcHJpdGU6IHNwcml0ZVxyXG4gICAgICAgICAgICB4OiBpXHJcbiAgICAgICAgICAgIHk6IGpcclxuICAgICAgICAgICAgdHlwZTogZ2VtVHlwZVxyXG4gICAgICAgICAgICBtYXRjaDogbWF0Y2hcclxuICAgICAgICAgICAgcG93ZXI6IHBvd2VyXHJcbiAgICAgICAgICAgIGFydDogYXJ0XHJcblxyXG4gICAgaWYgc3Bhd25lZEdlbVxyXG4gICAgICBjb25zb2xlLmxvZyBcImlucHV0IGRpc2FibGVkXCJcclxuICAgICAgQGlucHV0RW5hYmxlZCA9IGZhbHNlXHJcbiAgICAgIEB0aGlua0xhdGVyKEBnZW1Cb3VuY2VTcGVlZClcclxuXHJcbiAgICByZXR1cm4gc3Bhd25lZEdlbVxyXG5cclxuICB0aGlua0xhdGVyOiAodCkgLT5cclxuICAgIEBnYW1lLnRpbWUuZXZlbnRzLmFkZCB0LCA9PlxyXG4gICAgICBAdGhpbmsoKVxyXG5cclxuICB0aGluazogLT5cclxuICAgIGNvbnNvbGUubG9nIFwidGhpbmsoKVwiXHJcbiAgICBpZiBub3QgQHNwYXduR2VtcygpXHJcbiAgICAgIEBmaW5kTWF0Y2hlcygpXHJcbiAgICAgIGlmIEBtYXRjaFRvdGFsID4gMFxyXG4gICAgICAgIEBicmVha0dlbXMoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJpbnB1dCBlbmFibGVkXCJcclxuICAgICAgICBAaW5wdXRFbmFibGVkID0gdHJ1ZVxyXG4gICAgICAgIEBjaGFpbiA9IDFcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hcclxuIiwiTWF0Y2ggPSByZXF1aXJlICcuL01hdGNoJ1xyXG5cclxub25EZXZpY2VSZWFkeSA9IC0+XHJcbiAgY29uc29sZS5sb2coJ2RldmljZXJlYWR5JylcclxuICB3aW5kb3cubWF0Y2ggPSBuZXcgTWF0Y2hcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlcmVhZHknLCBvbkRldmljZVJlYWR5LCBmYWxzZSlcclxuXHJcbmluaXQoKVxyXG4iXX0=
