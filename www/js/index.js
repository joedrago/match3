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
    return this.think();
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

  Match.prototype.breakGems = function() {
    var gem, i, j, k, l, ref, ref1;
    for (i = k = 0, ref = this.gridCX; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      for (j = l = 0, ref1 = this.gridCY; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
        gem = this.grid[i][j];
        if ((gem !== null) && (gem.match > 0)) {
          this.emitScoreParticle(i, j, gem.type, gem.match);
          this.breakGem(i, j);
        }
      }
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
        return this.inputEnabled = true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dcXHNyY1xcTWF0Y2guY29mZmVlIiwid3d3XFxzcmNcXG1haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBTTtFQUNTLGVBQUE7SUFDWCxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCLE1BQU0sQ0FBQyxNQUFuQyxFQUEyQyxnQkFBM0MsRUFBNkQ7TUFDdkUsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRDhEO01BRXZFLE1BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUY4RDtLQUE3RDtJQU1aLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsTUFBRCxHQUFVO0lBRVYsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7RUFYTDs7a0JBYWIsT0FBQSxHQUFTLFNBQUE7SUFDUCxPQUFPLENBQUMsR0FBUixDQUFZLGlCQUFaO1dBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBWCxDQUF1QixNQUF2QixFQUErQixjQUEvQixFQUErQyxFQUEvQyxFQUFtRCxFQUFuRCxFQUF1RCxDQUFDLENBQXhELEVBQTJELENBQTNELEVBQThELENBQTlEO0VBRk87O2tCQUlULE1BQUEsR0FBUSxTQUFBO0lBQ04sT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBQSxHQUFtQixNQUFNLENBQUMsVUFBMUIsR0FBcUMsR0FBckMsR0FBd0MsTUFBTSxDQUFDLFdBQTNEO0lBQ0EsSUFB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LENBQUMsZ0JBQVQsQ0FBMEIsYUFBMUIsRUFBeUMsYUFBekMsRUFBd0QsS0FBeEQ7QUFGSzs7QUFJUCxJQUFBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgTWF0Y2hcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEBnYW1lID0gbmV3IFBoYXNlci5HYW1lIFwiMTAwJVwiLCBcIjEwMCVcIiwgUGhhc2VyLkNBTlZBUywgJ3BoYXNlci1leGFtcGxlJywge1xyXG4gICAgICBwcmVsb2FkOiA9PiBAcHJlbG9hZCgpXHJcbiAgICAgIGNyZWF0ZTogID0+IEBjcmVhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgICMgR3JpZCBnZW0gY291bnRzXHJcbiAgICBAZ3JpZENYID0gOFxyXG4gICAgQGdyaWRDWSA9IDdcclxuXHJcbiAgICBAZ2VtQm91bmNlU3BlZWQgPSA0MDBcclxuICAgIEBnZW1Td2FwU3BlZWQgPSAxMDBcclxuXHJcbiAgcHJlbG9hZDogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiTWF0Y2gucHJlbG9hZCgpXCJcclxuICAgIEBnYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ2dlbXMnLCAnaW1nL2dlbXMucG5nJywgODAsIDgwLCAtMSwgNCwgNClcclxuXHJcbiAgY3JlYXRlOiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJNYXRjaC5jcmVhdGUoKTogI3t3aW5kb3cuaW5uZXJXaWR0aH14I3t3aW5kb3cuaW5uZXJIZWlnaHR9XCJcclxuICAgIEBzY3JlZW5XID0gd2luZG93LmlubmVyV2lkdGhcclxuICAgIEBzY3JlZW5IID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICBpZiBAc2NyZWVuVyA+IEBzY3JlZW5IXHJcbiAgICAgIEBzY3JlZW5XID0gTWF0aC5mbG9vcihAc2NyZWVuSCAvIDE2ICogOSlcclxuICAgIGNvbnNvbGUubG9nIFwiY3JlYXRlZCBzY3JlZW4gI3tAc2NyZWVuV314I3tAc2NyZWVuSH1cIlxyXG5cclxuICAgIEBnZW1TaXplID0gQHNjcmVlblcgLyBAZ3JpZENYXHJcbiAgICBAZ3JpZFcgPSBAZ2VtU2l6ZSAqIEBncmlkQ1hcclxuICAgIEBncmlkSCA9IEBnZW1TaXplICogQGdyaWRDWVxyXG4gICAgQGdyaWRYID0gMFxyXG4gICAgQGdyaWRZID0gKChAc2NyZWVuSCAtIChAZ2VtU2l6ZSAqIEBncmlkQ1kpKSAtIEBnZW1TaXplKSA+PiAxXHJcbiAgICBAaW5wdXRFbmFibGVkID0gZmFsc2VcclxuXHJcbiAgICBAZ2FtZS5pbnB1dC5vbkRvd24uYWRkIChwKSA9PiBAb25Eb3duKHApXHJcbiAgICBAZ2FtZS5pbnB1dC5vblVwLmFkZCAocCkgPT4gQG9uVXAocClcclxuXHJcbiAgICBAbmV3R2FtZSgpXHJcblxyXG4gIG5ld0dhbWU6IC0+XHJcbiAgICBAZHJhZ1N0YXJ0WCA9IG51bGxcclxuICAgIEBkcmFnU3RhcnRZID0gbnVsbFxyXG5cclxuICAgIGlmIEBncmlkXHJcbiAgICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgICAgICBpZiBAZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgICBAZ3JpZFtpXVtqXS5zcHJpdGUuZGVzdHJveSgpXHJcblxyXG4gICAgQGdyaWQgPSBBcnJheShAZ3JpZENYKVxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICBAZ3JpZFtpXSA9IEFycmF5KEBncmlkQ1kpXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBAZ3JpZFtpXVtqXSA9IG51bGxcclxuXHJcbiAgICBAdGhpbmsoKVxyXG5cclxuICBzY3JlZW5Ub0dyaWQ6ICh4LCB5LCBuZWFyZXN0PWZhbHNlKSAtPlxyXG4gICAgZyA9XHJcbiAgICAgIHg6IE1hdGguZmxvb3IoKHggLSBAZ3JpZFgpIC8gQGdlbVNpemUpXHJcbiAgICAgIHk6IE1hdGguZmxvb3IoKHkgLSBAZ3JpZFkpIC8gQGdlbVNpemUpXHJcbiAgICBpZiBuZWFyZXN0XHJcbiAgICAgIGcueCA9IE1hdGgubWF4KGcueCwgMClcclxuICAgICAgZy54ID0gTWF0aC5taW4oZy54LCBAZ3JpZENYIC0gMSlcclxuICAgICAgZy55ID0gTWF0aC5tYXgoZy55LCAwKVxyXG4gICAgICBnLnkgPSBNYXRoLm1pbihnLnksIEBncmlkQ1kgLSAxKVxyXG4gICAgZWxzZSBpZiAoZy54IDwgMCkgb3IgKGcueCA+PSBAZ3JpZENYKSBvciAoZy55IDwgMCkgb3IgKGcueSA+PSBAZ3JpZENZKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgcmV0dXJuIGdcclxuXHJcbiAgZ3JpZFRvU2NyZWVuOiAoeCwgeSkgLT5cclxuICAgIGNvbnNvbGUubG9nXHJcbiAgICBwID1cclxuICAgICAgeDogTWF0aC5mbG9vcih4ICogQGdlbVNpemUpICsgQGdyaWRYXHJcbiAgICAgIHk6IE1hdGguZmxvb3IoeSAqIEBnZW1TaXplKSArIEBncmlkWVxyXG4gICAgcmV0dXJuIHBcclxuXHJcbiAgc3dhcENoYWluOiAoc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFksIGRyYWdnaW5nPWZhbHNlKSAtPlxyXG4gICAgeCA9IHN0YXJ0WFxyXG4gICAgeSA9IHN0YXJ0WVxyXG4gICAgZGVsdGFYID0gZW5kWCAtIHhcclxuICAgIGRlbHRhWSA9IGVuZFkgLSB5XHJcbiAgICBkZWx0YVggPSBNYXRoLm1heChkZWx0YVgsIC0xKVxyXG4gICAgZGVsdGFYID0gTWF0aC5taW4oZGVsdGFYLCAxKVxyXG4gICAgZGVsdGFZID0gTWF0aC5tYXgoZGVsdGFZLCAtMSlcclxuICAgIGRlbHRhWSA9IE1hdGgubWluKGRlbHRhWSwgMSlcclxuICAgIHdoaWxlICh4ICE9IGVuZFgpIG9yICh5ICE9IGVuZFkpXHJcbiAgICAgIG5ld1ggPSB4ICsgZGVsdGFYXHJcbiAgICAgIG5ld1kgPSB5ICsgZGVsdGFZXHJcbiAgICAgICMgY29uc29sZS5sb2cgXCJTV0FQICN7eH0gI3t5fSA8LT4gI3tuZXdYfSAje25ld1l9XCJcclxuICAgICAgdGVtcCA9IEBncmlkW3hdW3ldXHJcbiAgICAgIEBncmlkW3hdW3ldID0gQGdyaWRbbmV3WF1bbmV3WV1cclxuICAgICAgQGdyaWRbbmV3WF1bbmV3WV0gPSB0ZW1wXHJcbiAgICAgIGlmIEBncmlkW3hdW3ldICE9IG51bGxcclxuICAgICAgICBAZ3JpZFt4XVt5XS54ID0geFxyXG4gICAgICAgIEBncmlkW3hdW3ldLnkgPSB5XHJcbiAgICAgIGlmIEBncmlkW25ld1hdW25ld1ldICE9IG51bGxcclxuICAgICAgICBAZ3JpZFtuZXdYXVtuZXdZXS54ID0gbmV3WFxyXG4gICAgICAgIEBncmlkW25ld1hdW25ld1ldLnkgPSBuZXdZXHJcbiAgICAgIEBtb3ZlR2VtSG9tZSh4LCB5KVxyXG4gICAgICBpZiBub3QgZHJhZ2dpbmdcclxuICAgICAgICBAbW92ZUdlbUhvbWUobmV3WCwgbmV3WSlcclxuICAgICAgeCA9IG5ld1hcclxuICAgICAgeSA9IG5ld1lcclxuXHJcbiAgb25Eb3duOiAocCkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJkb3duXCIsIFtwLngscC55LHAuc2NyZWVuWCxwLnNjcmVlblldXHJcbiAgICBpZiBub3QgQGlucHV0RW5hYmxlZFxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBnID0gQHNjcmVlblRvR3JpZChwLngsIHAueSlcclxuICAgIGlmIGcgPT0gbnVsbFxyXG4gICAgICBjb25zb2xlLmxvZyBcImJhZCBjb29yZFwiXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGlmIEBncmlkW2cueF1bZy55XSAhPSBudWxsXHJcbiAgICAgICMgY29uc29sZS5sb2cgXCJlbmFibGluZyBkcmFnIG9uICN7Zy54fSAje2cueX1cIlxyXG4gICAgICBzcHJpdGUgPSBAZ3JpZFtnLnhdW2cueV0uc3ByaXRlXHJcbiAgICAgIHNwcml0ZS5pbnB1dC5lbmFibGVEcmFnKHRydWUpXHJcbiAgICAgIHNwcml0ZS5ldmVudHMub25EcmFnVXBkYXRlLmFkZCAoc3ByaXRlLCBwb2ludGVyLCBkcmFnWCwgZHJhZ1ksIHNuYXBQb2ludCkgPT5cclxuICAgICAgICAjIEhhdmUgdG8gYWRkIGhhbGYgYSBnZW0gYmVjYXVzZSBkcmFnWC9ZIGlzIHRoZSB0b3BsZWZ0IG9mIHRoZSBkcmFnZ2VkIGdlbVxyXG4gICAgICAgIEBvbk92ZXIoTWF0aC5mbG9vcihkcmFnWCArIChAZ2VtU2l6ZSAvIDIpKSwgTWF0aC5mbG9vcihkcmFnWSArIChAZ2VtU2l6ZSAvIDIpKSlcclxuICAgICAgQGRyYWdTdGFydFggPSBAZHJhZ1ggPSBnLnhcclxuICAgICAgQGRyYWdTdGFydFkgPSBAZHJhZ1kgPSBnLnlcclxuXHJcbiAgICAjIEBlbWl0U2NvcmVQYXJ0aWNsZShnLngsIGcueSwgMCwgQGdlbVN3YXBTcGVlZClcclxuICAgICMgQGJyZWFrR2VtKGcueCwgZy55KVxyXG4gICAgIyBAc3Bhd25HZW1zKClcclxuXHJcbiAgb25PdmVyOiAoeCwgeSkgLT5cclxuICAgIGlmIG5vdCBAaW5wdXRFbmFibGVkXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGlmIChAZHJhZ1N0YXJ0WCA9PSBudWxsKSBvciAoQGRyYWdTdGFydFkgPT0gbnVsbClcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgZyA9IEBzY3JlZW5Ub0dyaWQoeCwgeSwgdHJ1ZSlcclxuICAgIGRlbHRhWCA9IE1hdGguYWJzKGcueCAtIEBkcmFnU3RhcnRYKVxyXG4gICAgZGVsdGFZID0gTWF0aC5hYnMoZy55IC0gQGRyYWdTdGFydFkpXHJcbiAgICBpZiAoZGVsdGFYID09IDApIGFuZCAoZGVsdGFZID09IDApXHJcbiAgICAgIGlmIChAZHJhZ1ggIT0gQGRyYWdTdGFydFgpIG9yIChAZHJhZ1kgIT0gQGRyYWdTdGFydFkpXHJcbiAgICAgICAgQHJld2luZERyYWcoKVxyXG4gICAgICAgIEBmaW5kTWF0Y2hlcygpXHJcbiAgICAgIHJldHVyblxyXG4gICAgaWYgKGcueCA9PSBAZHJhZ1gpIGFuZCAoZy55ID09IEBkcmFnWSlcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgaWYgZGVsdGFYIDwgZGVsdGFZXHJcbiAgICAgIGcueCA9IEBkcmFnU3RhcnRYXHJcbiAgICAgIGlmIEBkcmFnWCAhPSBAZHJhZ1N0YXJ0WFxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJyZXdpbmRpbmcgZHJhZyBYICN7ZGVsdGFYfSAje2RlbHRhWX1cIlxyXG4gICAgICAgIEByZXdpbmREcmFnKHRydWUpXHJcbiAgICBlbHNlXHJcbiAgICAgIGcueSA9IEBkcmFnU3RhcnRZXHJcbiAgICAgIGlmIEBkcmFnWSAhPSBAZHJhZ1N0YXJ0WVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJyZXdpbmRpbmcgZHJhZyBZICN7ZGVsdGFYfSAje2RlbHRhWX1cIlxyXG4gICAgICAgIEByZXdpbmREcmFnKHRydWUpXHJcblxyXG4gICAgQHN3YXBDaGFpbihAZHJhZ1gsIEBkcmFnWSwgZy54LCBnLnksIHRydWUpXHJcbiAgICBAZHJhZ1ggPSBnLnhcclxuICAgIEBkcmFnWSA9IGcueVxyXG4gICAgQGZpbmRNYXRjaGVzKClcclxuXHJcbiAgb25VcDogKHApIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwidXBcIiwgW3AueCxwLnkscC5zY3JlZW5YLHAuc2NyZWVuWV1cclxuICAgIGlmIG5vdCBAaW5wdXRFbmFibGVkXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGlmIChAZHJhZ1N0YXJ0WCA9PSBudWxsKSBvciAoQGRyYWdTdGFydFkgPT0gbnVsbClcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgaWYgQG1hdGNoVG90YWwgPiAwXHJcbiAgICAgIEBicmVha0dlbXMoKVxyXG4gICAgZWxzZVxyXG4gICAgICBAcmV3aW5kRHJhZygpXHJcbiAgICBAZmluaXNoRHJhZygpXHJcbiAgICBAcmVzZXRNYXRjaGVzKClcclxuXHJcbiAgZmluaXNoRHJhZzogLT5cclxuICAgIGlmIChAZHJhZ1ggIT0gbnVsbCkgYW5kIChAZHJhZ1kgIT0gbnVsbCkgYW5kIChAZ3JpZFtAZHJhZ1hdW0BkcmFnWV0gIT0gbnVsbClcclxuICAgICAgQGdyaWRbQGRyYWdYXVtAZHJhZ1ldLnNwcml0ZS5pbnB1dC5lbmFibGVEcmFnKGZhbHNlKVxyXG4gICAgICBAZ3JpZFtAZHJhZ1hdW0BkcmFnWV0uc3ByaXRlLmV2ZW50cy5vbkRyYWdVcGRhdGUucmVtb3ZlQWxsKClcclxuICAgICAgQG1vdmVHZW1Ib21lKEBkcmFnWCwgQGRyYWdZKVxyXG4gICAgQGRyYWdTdGFydFggPSBAZHJhZ1ggPSBudWxsXHJcbiAgICBAZHJhZ1N0YXJ0WSA9IEBkcmFnWSA9IG51bGxcclxuXHJcbiAgcmV3aW5kRHJhZzogKGRyYWdnaW5nPWZhbHNlKSAtPlxyXG4gICAgaWYgKEBkcmFnU3RhcnRYICE9IG51bGwpIGFuZCAoQGRyYWdTdGFydFkgIT0gbnVsbClcclxuICAgICAgIyBjb25zb2xlLmxvZyBcIm1vdmluZyAoI3tAZHJhZ1h9LCAje0BkcmFnWX0pIGhvbWUgKCN7QGRyYWdTdGFydFh9LCAje0BkcmFnU3RhcnRZfSlcIlxyXG4gICAgICBAc3dhcENoYWluKEBkcmFnWCwgQGRyYWdZLCBAZHJhZ1N0YXJ0WCwgQGRyYWdTdGFydFksIGRyYWdnaW5nKVxyXG4gICAgICBpZiBub3QgZHJhZ2dpbmdcclxuICAgICAgICBAbW92ZUdlbUhvbWUoQGRyYWdTdGFydFgsIEBkcmFnU3RhcnRZKVxyXG4gICAgICBAZHJhZ1ggPSBAZHJhZ1N0YXJ0WFxyXG4gICAgICBAZHJhZ1kgPSBAZHJhZ1N0YXJ0WVxyXG5cclxuICB1cGRhdGVBcnQ6IChneCwgZ3kpIC0+XHJcbiAgICBpZiBAZ3JpZFtneF1bZ3ldICE9IG51bGxcclxuICAgICAgZ2VtID0gQGdyaWRbZ3hdW2d5XVxyXG4gICAgICBhcnQgPSBAZ2VtQXJ0SW5kZXgoZ2VtLnR5cGUsIChnZW0ubWF0Y2ggPiAwKSwgZ2VtLnBvd2VyKVxyXG4gICAgICBpZiBnZW0uYXJ0ICE9IGFydFxyXG4gICAgICAgIGdlbS5hcnQgPSBhcnRcclxuICAgICAgICBnZW0uc3ByaXRlLmZyYW1lID0gYXJ0XHJcbiAgICByZXR1cm5cclxuXHJcbiAgcmVzZXRNYXRjaGVzOiAtPlxyXG4gICAgQG1hdGNoVG90YWwgPSAwXHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSAhPSBudWxsXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5tYXRjaCA9IDBcclxuICAgICAgICAgIEB1cGRhdGVBcnQoaSwgailcclxuXHJcbiAgYWRkTWF0Y2hTdHJpcDogKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZLCBtYXRjaENvdW50KSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcImFkZE1hdGNoU3RyaXAoI3tzdGFydFh9LCAje3N0YXJ0WX0sICN7ZW5kWH0sICN7ZW5kWX0pXCJcclxuICAgIGZvciB4IGluIFtzdGFydFguLmVuZFhdXHJcbiAgICAgIGZvciB5IGluIFtzdGFydFkuLmVuZFldXHJcbiAgICAgICAgQG1hdGNoVG90YWwgKz0gbWF0Y2hDb3VudFxyXG4gICAgICAgIEBncmlkW3hdW3ldLm1hdGNoICs9IG1hdGNoQ291bnRcclxuICAgICAgICBAdXBkYXRlQXJ0KHgsIHkpXHJcblxyXG4gIGZpbmRNYXRjaGVzOiAtPlxyXG4gICAgQHJlc2V0TWF0Y2hlcygpXHJcblxyXG4gICAgIyBldywgY29weXBhc3RhXHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIGxhc3RUeXBlID0gLTFcclxuICAgICAgY291bnQgPSAwXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBpZiBsYXN0VHlwZSA9PSBAZ3JpZFtpXVtqXS50eXBlXHJcbiAgICAgICAgICBjb3VudCArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbGFzdFR5cGUgPSBAZ3JpZFtpXVtqXS50eXBlXHJcbiAgICAgICAgICBpZiBjb3VudCA+PSAzXHJcbiAgICAgICAgICAgIEBhZGRNYXRjaFN0cmlwKGksIGogLSBjb3VudCwgaSwgaiAtIDEsIGNvdW50KVxyXG4gICAgICAgICAgY291bnQgPSAxXHJcbiAgICAgIGlmIGNvdW50ID49IDNcclxuICAgICAgICBAYWRkTWF0Y2hTdHJpcChpLCBqIC0gY291bnQsIGksIGogLSAxLCBjb3VudClcclxuICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgbGFzdFR5cGUgPSAtMVxyXG4gICAgICBjb3VudCA9IDBcclxuICAgICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICAgIGlmIGxhc3RUeXBlID09IEBncmlkW2ldW2pdLnR5cGVcclxuICAgICAgICAgIGNvdW50ICs9IDFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBsYXN0VHlwZSA9IEBncmlkW2ldW2pdLnR5cGVcclxuICAgICAgICAgIGlmIGNvdW50ID49IDNcclxuICAgICAgICAgICAgQGFkZE1hdGNoU3RyaXAoaSAtIGNvdW50LCBqLCBpIC0gMSwgaiwgY291bnQpXHJcbiAgICAgICAgICBjb3VudCA9IDFcclxuICAgICAgaWYgY291bnQgPj0gM1xyXG4gICAgICAgIEBhZGRNYXRjaFN0cmlwKGkgLSBjb3VudCwgaiwgaSAtIDEsIGosIGNvdW50KVxyXG5cclxuICAgIGNvbnNvbGUubG9nIFwiLS0tLS0tLS0tLS0tXCJcclxuICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgbGluZSA9IFwiXCJcclxuICAgICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICAgIGxpbmUgKz0gXCIje0BncmlkW2ldW2pdLm1hdGNofSBcIlxyXG4gICAgICBjb25zb2xlLmxvZyBcIiN7an0gfCAje2xpbmV9XCJcclxuXHJcbiAgYnJlYWtHZW06ICh4LCB5KSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcImJyZWFrR2VtKCN7eH0sICN7eX0pXCJcclxuICAgIGlmIEBncmlkW3hdW3ldICE9IG51bGxcclxuICAgICAgQGdyaWRbeF1beV0uc3ByaXRlLmRlc3Ryb3koKVxyXG4gICAgICBAZ3JpZFt4XVt5XSA9IG51bGxcclxuXHJcbiAgYnJlYWtHZW1zOiAtPlxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgICAgZ2VtID0gQGdyaWRbaV1bal1cclxuICAgICAgICBpZiAoZ2VtICE9IG51bGwpIGFuZCAoZ2VtLm1hdGNoID4gMClcclxuICAgICAgICAgIEBlbWl0U2NvcmVQYXJ0aWNsZShpLCBqLCBnZW0udHlwZSwgZ2VtLm1hdGNoKVxyXG4gICAgICAgICAgQGJyZWFrR2VtKGksIGopXHJcbiAgICBAc3Bhd25HZW1zKClcclxuXHJcbiAgZ2VtQXJ0SW5kZXg6ICh0eXBlLCBoaWdobGlnaHQ9ZmFsc2UsIHBvd2VyPTApIC0+XHJcbiAgICBpbmRleCA9IHN3aXRjaCB0eXBlXHJcbiAgICAgIHdoZW4gMCwgMSwgMiwgMywgNFxyXG4gICAgICAgIHR5cGVcclxuICAgICAgd2hlbiA1LCA2LCA3XHJcbiAgICAgICAgNyArICgzICogKHR5cGUgLSA1KSlcclxuICAgIGlmIGhpZ2hsaWdodFxyXG4gICAgICBpbmRleCArPSAxNlxyXG4gICAgaW5kZXggKz0gcG93ZXJcclxuICAgIHJldHVybiBpbmRleFxyXG5cclxuICBlbWl0U2NvcmVQYXJ0aWNsZTogKGdyaWRYLCBncmlkWSwgdHlwZSwgc2NvcmUpIC0+XHJcbiAgICAjIGhhY2tcclxuICAgIHRleHRDb2xvciA9IFwiI2ZmZlwiXHJcbiAgICBpZiB0eXBlID09IDAgIyBicm9rZW5cclxuICAgICAgc2NvcmUgKj0gLTFcclxuICAgICAgdGV4dENvbG9yID0gXCIjZjY2XCJcclxuXHJcbiAgICBwID0gQGdyaWRUb1NjcmVlbihncmlkWCwgZ3JpZFkpXHJcbiAgICBzdHlsZSA9IHsgZm9udDogXCJib2xkIDI0cHggQXJpYWxcIiwgZmlsbDogdGV4dENvbG9yLCBib3VuZHNBbGlnbkg6IFwiY2VudGVyXCIsIGJvdW5kc0FsaWduVjogXCJtaWRkbGVcIiB9XHJcbiAgICB0ZXh0ID0gQGdhbWUuYWRkLnRleHQocC54LCBwLnksIFwiXCIrc2NvcmUsIHN0eWxlKVxyXG4gICAgdGV4dC5zZXRTaGFkb3coMywgMywgJ3JnYmEoMCwwLDAsMC41KScsIDIpXHJcbiAgICB0ZXh0LnNldFRleHRCb3VuZHMoMCwgMCwgQGdlbVNpemUsIEBnZW1TaXplKTtcclxuICAgIEBnYW1lLmFkZC50d2Vlbih0ZXh0KS50byh7IHk6IHAueSAtIChAZ2VtU2l6ZSAvIDQpLCBhbHBoYTogMCB9LCAxMDAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuSW4sIHRydWUpXHJcbiAgICBAZ2FtZS5hZGQudHdlZW4odGV4dC5zY2FsZSkudG8oeyB4OiAyLCB5OiAyIH0sIDEwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUpXHJcbiAgICBAZ2FtZS50aW1lLmV2ZW50cy5hZGQgMTAwMCwgLT5cclxuICAgICAgdGV4dC5kZXN0cm95KClcclxuXHJcbiAgYmVzdEdlbVRvU3Bhd246IC0+XHJcbiAgICAjIFRPRE86IERlY2lkZSBiYXNlZCBvbiBjdXJyZW50IGdlbSBkaXN0cmlidXRpb25cclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA4KVxyXG5cclxuICBtb3ZlR2VtSG9tZTogKGd4LCBneSwgYm91bmNlPWZhbHNlKSAtPlxyXG4gICAgZ2VtID0gQGdyaWRbZ3hdW2d5XVxyXG4gICAgaWYgZ2VtID09IG51bGxcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgIyBjb25zb2xlLmxvZyBcIm1vdmVHZW1Ib21lKCN7Z3h9LCAje2d5fSlcIlxyXG5cclxuICAgIHggPSBAZ3JpZFggKyAoZ3ggKiBAZ2VtU2l6ZSlcclxuICAgIHkgPSBAZ3JpZFkgKyAoZ3kgKiBAZ2VtU2l6ZSlcclxuICAgIGVhc2luZyA9IFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmVcclxuICAgIHNwZWVkID0gQGdlbVN3YXBTcGVlZFxyXG4gICAgaWYgYm91bmNlXHJcbiAgICAgIGVhc2luZyA9IFBoYXNlci5FYXNpbmcuQm91bmNlLk91dFxyXG4gICAgICBzcGVlZCA9IEBnZW1Cb3VuY2VTcGVlZFxyXG4gICAgQGdhbWUuYWRkLnR3ZWVuKGdlbS5zcHJpdGUpLnRvKHsgeDogeCwgeTogeSB9LCBzcGVlZCwgZWFzaW5nLCB0cnVlKVxyXG5cclxuICBzcGF3bkdlbXM6IC0+XHJcbiAgICAjIGRyb3AgZ2VtcyBmcm9tIGhpZ2hlciB1cCBzbG90cyBkb3duXHJcbiAgICBuZXdHcmlkID0gQXJyYXkoQGdyaWRDWClcclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgbmV3R3JpZFtpXSA9IEFycmF5KEBncmlkQ1kpXHJcbiAgICAgIG9sZEluZGV4ID0gbmV3SW5kZXggPSBAZ3JpZENZIC0gMVxyXG4gICAgICB3aGlsZSBvbGRJbmRleCA+PSAwXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bb2xkSW5kZXhdICE9IG51bGxcclxuICAgICAgICAgIG5ld0dyaWRbaV1bbmV3SW5kZXhdID0gQGdyaWRbaV1bb2xkSW5kZXhdXHJcbiAgICAgICAgICBuZXdJbmRleCAtPSAxXHJcbiAgICAgICAgb2xkSW5kZXggLT0gMVxyXG4gICAgICB3aGlsZSBuZXdJbmRleCA+PSAwXHJcbiAgICAgICAgbmV3R3JpZFtpXVtuZXdJbmRleF0gPSBudWxsXHJcbiAgICAgICAgbmV3SW5kZXggLT0gMVxyXG4gICAgQGdyaWQgPSBuZXdHcmlkXHJcblxyXG4gICAgIyB1cGRhdGUgc3ByaXRlcyBhbmQgeC95XHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBnZW0gPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGlmIGdlbSA9PSBudWxsXHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIGlmIChnZW0ueCAhPSBpKSBvciAoZ2VtLnkgIT0gailcclxuICAgICAgICAgIGdlbS54ID0gaVxyXG4gICAgICAgICAgZ2VtLnkgPSBqXHJcbiAgICAgICAgICBAbW92ZUdlbUhvbWUoaSwgaiwgdHJ1ZSlcclxuXHJcbiAgICAjIGRyb3AgZnJvbSB0aGUgdG9wXHJcbiAgICBzcGF3bmVkR2VtID0gZmFsc2VcclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgZm9yIGogaW4gWzAuLi5AZ3JpZENZXVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdID09IG51bGxcclxuICAgICAgICAgIHNwYXduZWRHZW0gPSB0cnVlXHJcbiAgICAgICAgICBnZW1UeXBlID0gQGJlc3RHZW1Ub1NwYXduKClcclxuICAgICAgICAgIG1hdGNoID0gMFxyXG4gICAgICAgICAgcG93ZXIgPSBmYWxzZVxyXG4gICAgICAgICAgeCA9IEBncmlkWCArIChpICogQGdlbVNpemUpXHJcbiAgICAgICAgICB5ID0gQGdyaWRZICsgKGogKiBAZ2VtU2l6ZSlcclxuICAgICAgICAgIGFydCA9IEBnZW1BcnRJbmRleChnZW1UeXBlLCAobWF0Y2ggPiAwKSwgcG93ZXIpXHJcbiAgICAgICAgICBzcHJpdGUgPSBAZ2FtZS5hZGQuc3ByaXRlKHgsIHkgLSBAZ3JpZEgsICdnZW1zJywgYXJ0KVxyXG4gICAgICAgICAgc3ByaXRlLndpZHRoID0gQGdlbVNpemVcclxuICAgICAgICAgIHNwcml0ZS5oZWlnaHQgPSBAZ2VtU2l6ZVxyXG4gICAgICAgICAgc3ByaXRlLmlucHV0RW5hYmxlZCA9IHRydWVcclxuICAgICAgICAgIEBnYW1lLndvcmxkLnNlbmRUb0JhY2soc3ByaXRlKVxyXG4gICAgICAgICAgQGdhbWUuYWRkLnR3ZWVuKHNwcml0ZSkudG8oeyB5OiB5IH0sIEBnZW1Cb3VuY2VTcGVlZCwgUGhhc2VyLkVhc2luZy5Cb3VuY2UuT3V0LCB0cnVlKVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPVxyXG4gICAgICAgICAgICBzcHJpdGU6IHNwcml0ZVxyXG4gICAgICAgICAgICB4OiBpXHJcbiAgICAgICAgICAgIHk6IGpcclxuICAgICAgICAgICAgdHlwZTogZ2VtVHlwZVxyXG4gICAgICAgICAgICBtYXRjaDogbWF0Y2hcclxuICAgICAgICAgICAgcG93ZXI6IHBvd2VyXHJcbiAgICAgICAgICAgIGFydDogYXJ0XHJcblxyXG4gICAgaWYgc3Bhd25lZEdlbVxyXG4gICAgICBjb25zb2xlLmxvZyBcImlucHV0IGRpc2FibGVkXCJcclxuICAgICAgQGlucHV0RW5hYmxlZCA9IGZhbHNlXHJcbiAgICAgIEB0aGlua0xhdGVyKEBnZW1Cb3VuY2VTcGVlZClcclxuXHJcbiAgICByZXR1cm4gc3Bhd25lZEdlbVxyXG5cclxuICB0aGlua0xhdGVyOiAodCkgLT5cclxuICAgIEBnYW1lLnRpbWUuZXZlbnRzLmFkZCB0LCA9PlxyXG4gICAgICBAdGhpbmsoKVxyXG5cclxuICB0aGluazogLT5cclxuICAgIGNvbnNvbGUubG9nIFwidGhpbmsoKVwiXHJcbiAgICBpZiBub3QgQHNwYXduR2VtcygpXHJcbiAgICAgIEBmaW5kTWF0Y2hlcygpXHJcbiAgICAgIGlmIEBtYXRjaFRvdGFsID4gMFxyXG4gICAgICAgIEBicmVha0dlbXMoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJpbnB1dCBlbmFibGVkXCJcclxuICAgICAgICBAaW5wdXRFbmFibGVkID0gdHJ1ZVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaFxyXG4iLCJNYXRjaCA9IHJlcXVpcmUgJy4vTWF0Y2gnXHJcblxyXG5vbkRldmljZVJlYWR5ID0gLT5cclxuICBjb25zb2xlLmxvZygnZGV2aWNlcmVhZHknKVxyXG4gIHdpbmRvdy5tYXRjaCA9IG5ldyBNYXRjaFxyXG5cclxuaW5pdCA9IC0+XHJcbiAgY29uc29sZS5sb2cgXCJpbml0XCJcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIG9uRGV2aWNlUmVhZHksIGZhbHNlKVxyXG5cclxuaW5pdCgpXHJcbiJdfQ==
