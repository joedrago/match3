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
      })(this),
      update: (function(_this) {
        return function() {
          return _this.update();
        };
      })(this)
    });
    this.gridCX = 8;
    this.gridCY = 7;
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
    this.findMatches();
    return this.breakGems();
  };

  Match.prototype.update = function() {};

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
    speed = 100;
    if (bounce) {
      easing = Phaser.Easing.Bounce.Out;
      speed = 400;
    }
    return this.game.add.tween(gem.sprite).to({
      x: x,
      y: y
    }, speed, easing, true);
  };

  Match.prototype.spawnGems = function() {
    var art, gem, gemType, i, j, k, l, m, match, n, newGrid, newIndex, oldIndex, power, ref, ref1, ref2, ref3, results, sprite, x, y;
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
    results = [];
    for (i = n = 0, ref3 = this.gridCX; 0 <= ref3 ? n < ref3 : n > ref3; i = 0 <= ref3 ? ++n : --n) {
      results.push((function() {
        var o, ref4, results1;
        results1 = [];
        for (j = o = 0, ref4 = this.gridCY; 0 <= ref4 ? o < ref4 : o > ref4; j = 0 <= ref4 ? ++o : --o) {
          if (this.grid[i][j] === null) {
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
            }, 400, Phaser.Easing.Bounce.Out, true);
            results1.push(this.grid[i][j] = {
              sprite: sprite,
              x: i,
              y: j,
              type: gemType,
              match: match,
              power: power,
              art: art
            });
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dcXHNyY1xcTWF0Y2guY29mZmVlIiwid3d3XFxzcmNcXG1haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBTTtFQUNTLGVBQUE7SUFDWCxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCLE1BQU0sQ0FBQyxNQUFuQyxFQUEyQyxnQkFBM0MsRUFBNkQ7TUFDdkUsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRDhEO01BRXZFLE1BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUY4RDtNQUd2RSxNQUFBLEVBQVMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIOEQ7S0FBN0Q7SUFPWixJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVTtFQVRDOztrQkFXYixPQUFBLEdBQVMsU0FBQTtJQUNQLE9BQU8sQ0FBQyxHQUFSLENBQVksaUJBQVo7V0FDQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFYLENBQXVCLE1BQXZCLEVBQStCLGNBQS9CLEVBQStDLEVBQS9DLEVBQW1ELEVBQW5ELEVBQXVELENBQUMsQ0FBeEQsRUFBMkQsQ0FBM0QsRUFBOEQsQ0FBOUQ7RUFGTzs7a0JBSVQsTUFBQSxHQUFRLFNBQUE7SUFDTixPQUFPLENBQUMsR0FBUixDQUFZLGtCQUFBLEdBQW1CLE1BQU0sQ0FB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O0FDMVdqQixJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjs7QUFFUixhQUFBLEdBQWdCLFNBQUE7RUFDZCxPQUFPLENBQUMsR0FBUixDQUFZLGFBQVo7U0FDQSxNQUFNLENBQUMsS0FBUCxHQUFlLElBQUk7QUFGTDs7QUFJaEIsSUFBQSxHQUFPLFNBQUE7RUFDTCxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVo7U0FDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsYUFBMUIsRUFBeUMsYUFBekMsRUFBd0QsS0FBeEQ7QUFGSzs7QUFJUCxJQUFBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgTWF0Y2hcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEBnYW1lID0gbmV3IFBoYXNlci5HYW1lIFwiMTAwJVwiLCBcIjEwMCVcIiwgUGhhc2VyLkNBTlZBUywgJ3BoYXNlci1leGFtcGxlJywge1xyXG4gICAgICBwcmVsb2FkOiA9PiBAcHJlbG9hZCgpXHJcbiAgICAgIGNyZWF0ZTogID0+IEBjcmVhdGUoKVxyXG4gICAgICB1cGRhdGU6ICA9PiBAdXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAjIEdyaWQgZ2VtIGNvdW50c1xyXG4gICAgQGdyaWRDWCA9IDhcclxuICAgIEBncmlkQ1kgPSA3XHJcblxyXG4gIHByZWxvYWQ6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcIk1hdGNoLnByZWxvYWQoKVwiXHJcbiAgICBAZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KCdnZW1zJywgJ2ltZy9nZW1zLnBuZycsIDgwLCA4MCwgLTEsIDQsIDQpXHJcblxyXG4gIGNyZWF0ZTogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiTWF0Y2guY3JlYXRlKCk6ICN7d2luZG93LmlubmVyV2lkdGh9eCN7d2luZG93LmlubmVySGVpZ2h0fVwiXHJcbiAgICBAc2NyZWVuVyA9IHdpbmRvdy5pbm5lcldpZHRoXHJcbiAgICBAc2NyZWVuSCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgaWYgQHNjcmVlblcgPiBAc2NyZWVuSFxyXG4gICAgICBAc2NyZWVuVyA9IE1hdGguZmxvb3IoQHNjcmVlbkggLyAxNiAqIDkpXHJcbiAgICBjb25zb2xlLmxvZyBcImNyZWF0ZWQgc2NyZWVuICN7QHNjcmVlbld9eCN7QHNjcmVlbkh9XCJcclxuXHJcbiAgICBAZ2VtU2l6ZSA9IEBzY3JlZW5XIC8gQGdyaWRDWFxyXG4gICAgQGdyaWRXID0gQGdlbVNpemUgKiBAZ3JpZENYXHJcbiAgICBAZ3JpZEggPSBAZ2VtU2l6ZSAqIEBncmlkQ1lcclxuICAgIEBncmlkWCA9IDBcclxuICAgIEBncmlkWSA9ICgoQHNjcmVlbkggLSAoQGdlbVNpemUgKiBAZ3JpZENZKSkgLSBAZ2VtU2l6ZSkgPj4gMVxyXG5cclxuICAgIEBnYW1lLmlucHV0Lm9uRG93bi5hZGQgKHApID0+IEBvbkRvd24ocClcclxuICAgIEBnYW1lLmlucHV0Lm9uVXAuYWRkIChwKSA9PiBAb25VcChwKVxyXG5cclxuICAgIEBuZXdHYW1lKClcclxuXHJcbiAgbmV3R2FtZTogLT5cclxuICAgIEBkcmFnU3RhcnRYID0gbnVsbFxyXG4gICAgQGRyYWdTdGFydFkgPSBudWxsXHJcblxyXG4gICAgaWYgQGdyaWRcclxuICAgICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICAgIGlmIEBncmlkW2ldW2pdXHJcbiAgICAgICAgICAgIEBncmlkW2ldW2pdLnNwcml0ZS5kZXN0cm95KClcclxuXHJcbiAgICBAZ3JpZCA9IEFycmF5KEBncmlkQ1gpXHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIEBncmlkW2ldID0gQXJyYXkoQGdyaWRDWSlcclxuICAgICAgZm9yIGogaW4gWzAuLi5AZ3JpZENZXVxyXG4gICAgICAgIEBncmlkW2ldW2pdID0gbnVsbFxyXG4gICAgQHNwYXduR2VtcygpXHJcbiAgICBAZmluZE1hdGNoZXMoKVxyXG4gICAgQGJyZWFrR2VtcygpXHJcblxyXG4gIHVwZGF0ZTogLT5cclxuXHJcbiAgc2NyZWVuVG9HcmlkOiAoeCwgeSwgbmVhcmVzdD1mYWxzZSkgLT5cclxuICAgIGcgPVxyXG4gICAgICB4OiBNYXRoLmZsb29yKCh4IC0gQGdyaWRYKSAvIEBnZW1TaXplKVxyXG4gICAgICB5OiBNYXRoLmZsb29yKCh5IC0gQGdyaWRZKSAvIEBnZW1TaXplKVxyXG4gICAgaWYgbmVhcmVzdFxyXG4gICAgICBnLnggPSBNYXRoLm1heChnLngsIDApXHJcbiAgICAgIGcueCA9IE1hdGgubWluKGcueCwgQGdyaWRDWCAtIDEpXHJcbiAgICAgIGcueSA9IE1hdGgubWF4KGcueSwgMClcclxuICAgICAgZy55ID0gTWF0aC5taW4oZy55LCBAZ3JpZENZIC0gMSlcclxuICAgIGVsc2UgaWYgKGcueCA8IDApIG9yIChnLnggPj0gQGdyaWRDWCkgb3IgKGcueSA8IDApIG9yIChnLnkgPj0gQGdyaWRDWSlcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIHJldHVybiBnXHJcblxyXG4gIGdyaWRUb1NjcmVlbjogKHgsIHkpIC0+XHJcbiAgICBjb25zb2xlLmxvZ1xyXG4gICAgcCA9XHJcbiAgICAgIHg6IE1hdGguZmxvb3IoeCAqIEBnZW1TaXplKSArIEBncmlkWFxyXG4gICAgICB5OiBNYXRoLmZsb29yKHkgKiBAZ2VtU2l6ZSkgKyBAZ3JpZFlcclxuICAgIHJldHVybiBwXHJcblxyXG4gIHN3YXBDaGFpbjogKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZLCBkcmFnZ2luZz1mYWxzZSkgLT5cclxuICAgIHggPSBzdGFydFhcclxuICAgIHkgPSBzdGFydFlcclxuICAgIGRlbHRhWCA9IGVuZFggLSB4XHJcbiAgICBkZWx0YVkgPSBlbmRZIC0geVxyXG4gICAgZGVsdGFYID0gTWF0aC5tYXgoZGVsdGFYLCAtMSlcclxuICAgIGRlbHRhWCA9IE1hdGgubWluKGRlbHRhWCwgMSlcclxuICAgIGRlbHRhWSA9IE1hdGgubWF4KGRlbHRhWSwgLTEpXHJcbiAgICBkZWx0YVkgPSBNYXRoLm1pbihkZWx0YVksIDEpXHJcbiAgICB3aGlsZSAoeCAhPSBlbmRYKSBvciAoeSAhPSBlbmRZKVxyXG4gICAgICBuZXdYID0geCArIGRlbHRhWFxyXG4gICAgICBuZXdZID0geSArIGRlbHRhWVxyXG4gICAgICAjIGNvbnNvbGUubG9nIFwiU1dBUCAje3h9ICN7eX0gPC0+ICN7bmV3WH0gI3tuZXdZfVwiXHJcbiAgICAgIHRlbXAgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICBAZ3JpZFt4XVt5XSA9IEBncmlkW25ld1hdW25ld1ldXHJcbiAgICAgIEBncmlkW25ld1hdW25ld1ldID0gdGVtcFxyXG4gICAgICBpZiBAZ3JpZFt4XVt5XSAhPSBudWxsXHJcbiAgICAgICAgQGdyaWRbeF1beV0ueCA9IHhcclxuICAgICAgICBAZ3JpZFt4XVt5XS55ID0geVxyXG4gICAgICBpZiBAZ3JpZFtuZXdYXVtuZXdZXSAhPSBudWxsXHJcbiAgICAgICAgQGdyaWRbbmV3WF1bbmV3WV0ueCA9IG5ld1hcclxuICAgICAgICBAZ3JpZFtuZXdYXVtuZXdZXS55ID0gbmV3WVxyXG4gICAgICBAbW92ZUdlbUhvbWUoeCwgeSlcclxuICAgICAgaWYgbm90IGRyYWdnaW5nXHJcbiAgICAgICAgQG1vdmVHZW1Ib21lKG5ld1gsIG5ld1kpXHJcbiAgICAgIHggPSBuZXdYXHJcbiAgICAgIHkgPSBuZXdZXHJcblxyXG4gIG9uRG93bjogKHApIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiZG93blwiLCBbcC54LHAueSxwLnNjcmVlblgscC5zY3JlZW5ZXVxyXG4gICAgZyA9IEBzY3JlZW5Ub0dyaWQocC54LCBwLnkpXHJcbiAgICBpZiBnID09IG51bGxcclxuICAgICAgY29uc29sZS5sb2cgXCJiYWQgY29vcmRcIlxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBpZiBAZ3JpZFtnLnhdW2cueV0gIT0gbnVsbFxyXG4gICAgICAjIGNvbnNvbGUubG9nIFwiZW5hYmxpbmcgZHJhZyBvbiAje2cueH0gI3tnLnl9XCJcclxuICAgICAgc3ByaXRlID0gQGdyaWRbZy54XVtnLnldLnNwcml0ZVxyXG4gICAgICBzcHJpdGUuaW5wdXQuZW5hYmxlRHJhZyh0cnVlKVxyXG4gICAgICBzcHJpdGUuZXZlbnRzLm9uRHJhZ1VwZGF0ZS5hZGQgKHNwcml0ZSwgcG9pbnRlciwgZHJhZ1gsIGRyYWdZLCBzbmFwUG9pbnQpID0+XHJcbiAgICAgICAgIyBIYXZlIHRvIGFkZCBoYWxmIGEgZ2VtIGJlY2F1c2UgZHJhZ1gvWSBpcyB0aGUgdG9wbGVmdCBvZiB0aGUgZHJhZ2dlZCBnZW1cclxuICAgICAgICBAb25PdmVyKE1hdGguZmxvb3IoZHJhZ1ggKyAoQGdlbVNpemUgLyAyKSksIE1hdGguZmxvb3IoZHJhZ1kgKyAoQGdlbVNpemUgLyAyKSkpXHJcbiAgICAgIEBkcmFnU3RhcnRYID0gQGRyYWdYID0gZy54XHJcbiAgICAgIEBkcmFnU3RhcnRZID0gQGRyYWdZID0gZy55XHJcblxyXG4gICAgIyBAZW1pdFNjb3JlUGFydGljbGUoZy54LCBnLnksIDAsIDEwMClcclxuICAgICMgQGJyZWFrR2VtKGcueCwgZy55KVxyXG4gICAgIyBAc3Bhd25HZW1zKClcclxuXHJcbiAgb25PdmVyOiAoeCwgeSkgLT5cclxuICAgIGlmIChAZHJhZ1N0YXJ0WCA9PSBudWxsKSBvciAoQGRyYWdTdGFydFkgPT0gbnVsbClcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgZyA9IEBzY3JlZW5Ub0dyaWQoeCwgeSwgdHJ1ZSlcclxuICAgIGRlbHRhWCA9IE1hdGguYWJzKGcueCAtIEBkcmFnU3RhcnRYKVxyXG4gICAgZGVsdGFZID0gTWF0aC5hYnMoZy55IC0gQGRyYWdTdGFydFkpXHJcbiAgICBpZiAoZGVsdGFYID09IDApIGFuZCAoZGVsdGFZID09IDApXHJcbiAgICAgIGlmIChAZHJhZ1ggIT0gQGRyYWdTdGFydFgpIG9yIChAZHJhZ1kgIT0gQGRyYWdTdGFydFkpXHJcbiAgICAgICAgQHJld2luZERyYWcoKVxyXG4gICAgICAgIEBmaW5kTWF0Y2hlcygpXHJcbiAgICAgIHJldHVyblxyXG4gICAgaWYgKGcueCA9PSBAZHJhZ1gpIGFuZCAoZy55ID09IEBkcmFnWSlcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgaWYgZGVsdGFYIDwgZGVsdGFZXHJcbiAgICAgIGcueCA9IEBkcmFnU3RhcnRYXHJcbiAgICAgIGlmIEBkcmFnWCAhPSBAZHJhZ1N0YXJ0WFxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJyZXdpbmRpbmcgZHJhZyBYICN7ZGVsdGFYfSAje2RlbHRhWX1cIlxyXG4gICAgICAgIEByZXdpbmREcmFnKHRydWUpXHJcbiAgICBlbHNlXHJcbiAgICAgIGcueSA9IEBkcmFnU3RhcnRZXHJcbiAgICAgIGlmIEBkcmFnWSAhPSBAZHJhZ1N0YXJ0WVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJyZXdpbmRpbmcgZHJhZyBZICN7ZGVsdGFYfSAje2RlbHRhWX1cIlxyXG4gICAgICAgIEByZXdpbmREcmFnKHRydWUpXHJcblxyXG4gICAgQHN3YXBDaGFpbihAZHJhZ1gsIEBkcmFnWSwgZy54LCBnLnksIHRydWUpXHJcbiAgICBAZHJhZ1ggPSBnLnhcclxuICAgIEBkcmFnWSA9IGcueVxyXG4gICAgQGZpbmRNYXRjaGVzKClcclxuXHJcbiAgb25VcDogKHApIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwidXBcIiwgW3AueCxwLnkscC5zY3JlZW5YLHAuc2NyZWVuWV1cclxuICAgIGlmIChAZHJhZ1N0YXJ0WCA9PSBudWxsKSBvciAoQGRyYWdTdGFydFkgPT0gbnVsbClcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgaWYgQG1hdGNoVG90YWwgPiAwXHJcbiAgICAgIEBicmVha0dlbXMoKVxyXG4gICAgZWxzZVxyXG4gICAgICBAcmV3aW5kRHJhZygpXHJcbiAgICBAZmluaXNoRHJhZygpXHJcbiAgICBAcmVzZXRNYXRjaGVzKClcclxuXHJcbiAgZmluaXNoRHJhZzogLT5cclxuICAgIGlmIChAZHJhZ1ggIT0gbnVsbCkgYW5kIChAZHJhZ1kgIT0gbnVsbCkgYW5kIChAZ3JpZFtAZHJhZ1hdW0BkcmFnWV0gIT0gbnVsbClcclxuICAgICAgQGdyaWRbQGRyYWdYXVtAZHJhZ1ldLnNwcml0ZS5pbnB1dC5lbmFibGVEcmFnKGZhbHNlKVxyXG4gICAgICBAZ3JpZFtAZHJhZ1hdW0BkcmFnWV0uc3ByaXRlLmV2ZW50cy5vbkRyYWdVcGRhdGUucmVtb3ZlQWxsKClcclxuICAgIEBkcmFnU3RhcnRYID0gQGRyYWdYID0gbnVsbFxyXG4gICAgQGRyYWdTdGFydFkgPSBAZHJhZ1kgPSBudWxsXHJcblxyXG4gIHJld2luZERyYWc6IChkcmFnZ2luZz1mYWxzZSkgLT5cclxuICAgIGlmIChAZHJhZ1N0YXJ0WCAhPSBudWxsKSBhbmQgKEBkcmFnU3RhcnRZICE9IG51bGwpXHJcbiAgICAgICMgY29uc29sZS5sb2cgXCJtb3ZpbmcgKCN7QGRyYWdYfSwgI3tAZHJhZ1l9KSBob21lICgje0BkcmFnU3RhcnRYfSwgI3tAZHJhZ1N0YXJ0WX0pXCJcclxuICAgICAgQHN3YXBDaGFpbihAZHJhZ1gsIEBkcmFnWSwgQGRyYWdTdGFydFgsIEBkcmFnU3RhcnRZLCBkcmFnZ2luZylcclxuICAgICAgaWYgbm90IGRyYWdnaW5nXHJcbiAgICAgICAgQG1vdmVHZW1Ib21lKEBkcmFnU3RhcnRYLCBAZHJhZ1N0YXJ0WSlcclxuICAgICAgQGRyYWdYID0gQGRyYWdTdGFydFhcclxuICAgICAgQGRyYWdZID0gQGRyYWdTdGFydFlcclxuXHJcbiAgdXBkYXRlQXJ0OiAoZ3gsIGd5KSAtPlxyXG4gICAgaWYgQGdyaWRbZ3hdW2d5XSAhPSBudWxsXHJcbiAgICAgIGdlbSA9IEBncmlkW2d4XVtneV1cclxuICAgICAgYXJ0ID0gQGdlbUFydEluZGV4KGdlbS50eXBlLCAoZ2VtLm1hdGNoID4gMCksIGdlbS5wb3dlcilcclxuICAgICAgaWYgZ2VtLmFydCAhPSBhcnRcclxuICAgICAgICBnZW0uYXJ0ID0gYXJ0XHJcbiAgICAgICAgZ2VtLnNwcml0ZS5mcmFtZSA9IGFydFxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlc2V0TWF0Y2hlczogLT5cclxuICAgIEBtYXRjaFRvdGFsID0gMFxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0gIT0gbnVsbFxyXG4gICAgICAgICAgQGdyaWRbaV1bal0ubWF0Y2ggPSAwXHJcbiAgICAgICAgICBAdXBkYXRlQXJ0KGksIGopXHJcblxyXG4gIGFkZE1hdGNoU3RyaXA6IChzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSwgbWF0Y2hDb3VudCkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJhZGRNYXRjaFN0cmlwKCN7c3RhcnRYfSwgI3tzdGFydFl9LCAje2VuZFh9LCAje2VuZFl9KVwiXHJcbiAgICBmb3IgeCBpbiBbc3RhcnRYLi5lbmRYXVxyXG4gICAgICBmb3IgeSBpbiBbc3RhcnRZLi5lbmRZXVxyXG4gICAgICAgIEBtYXRjaFRvdGFsICs9IG1hdGNoQ291bnRcclxuICAgICAgICBAZ3JpZFt4XVt5XS5tYXRjaCArPSBtYXRjaENvdW50XHJcbiAgICAgICAgQHVwZGF0ZUFydCh4LCB5KVxyXG5cclxuICBmaW5kTWF0Y2hlczogLT5cclxuICAgIEByZXNldE1hdGNoZXMoKVxyXG5cclxuICAgICMgZXcsIGNvcHlwYXN0YVxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICBsYXN0VHlwZSA9IC0xXHJcbiAgICAgIGNvdW50ID0gMFxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgICAgaWYgbGFzdFR5cGUgPT0gQGdyaWRbaV1bal0udHlwZVxyXG4gICAgICAgICAgY291bnQgKz0gMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGxhc3RUeXBlID0gQGdyaWRbaV1bal0udHlwZVxyXG4gICAgICAgICAgaWYgY291bnQgPj0gM1xyXG4gICAgICAgICAgICBAYWRkTWF0Y2hTdHJpcChpLCBqIC0gY291bnQsIGksIGogLSAxLCBjb3VudClcclxuICAgICAgICAgIGNvdW50ID0gMVxyXG4gICAgICBpZiBjb3VudCA+PSAzXHJcbiAgICAgICAgQGFkZE1hdGNoU3RyaXAoaSwgaiAtIGNvdW50LCBpLCBqIC0gMSwgY291bnQpXHJcbiAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgIGxhc3RUeXBlID0gLTFcclxuICAgICAgY291bnQgPSAwXHJcbiAgICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgICBpZiBsYXN0VHlwZSA9PSBAZ3JpZFtpXVtqXS50eXBlXHJcbiAgICAgICAgICBjb3VudCArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbGFzdFR5cGUgPSBAZ3JpZFtpXVtqXS50eXBlXHJcbiAgICAgICAgICBpZiBjb3VudCA+PSAzXHJcbiAgICAgICAgICAgIEBhZGRNYXRjaFN0cmlwKGkgLSBjb3VudCwgaiwgaSAtIDEsIGosIGNvdW50KVxyXG4gICAgICAgICAgY291bnQgPSAxXHJcbiAgICAgIGlmIGNvdW50ID49IDNcclxuICAgICAgICBAYWRkTWF0Y2hTdHJpcChpIC0gY291bnQsIGosIGkgLSAxLCBqLCBjb3VudClcclxuXHJcbiAgICBjb25zb2xlLmxvZyBcIi0tLS0tLS0tLS0tLVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgIGxpbmUgPSBcIlwiXHJcbiAgICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgICBsaW5lICs9IFwiI3tAZ3JpZFtpXVtqXS5tYXRjaH0gXCJcclxuICAgICAgY29uc29sZS5sb2cgXCIje2p9IHwgI3tsaW5lfVwiXHJcblxyXG4gIGJyZWFrR2VtOiAoeCwgeSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJicmVha0dlbSgje3h9LCAje3l9KVwiXHJcbiAgICBpZiBAZ3JpZFt4XVt5XSAhPSBudWxsXHJcbiAgICAgIEBncmlkW3hdW3ldLnNwcml0ZS5kZXN0cm95KClcclxuICAgICAgQGdyaWRbeF1beV0gPSBudWxsXHJcblxyXG4gIGJyZWFrR2VtczogLT5cclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgZm9yIGogaW4gWzAuLi5AZ3JpZENZXVxyXG4gICAgICAgIGdlbSA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgaWYgKGdlbSAhPSBudWxsKSBhbmQgKGdlbS5tYXRjaCA+IDApXHJcbiAgICAgICAgICBAZW1pdFNjb3JlUGFydGljbGUoaSwgaiwgZ2VtLnR5cGUsIGdlbS5tYXRjaClcclxuICAgICAgICAgIEBicmVha0dlbShpLCBqKVxyXG4gICAgQHNwYXduR2VtcygpXHJcblxyXG4gIGdlbUFydEluZGV4OiAodHlwZSwgaGlnaGxpZ2h0PWZhbHNlLCBwb3dlcj0wKSAtPlxyXG4gICAgaW5kZXggPSBzd2l0Y2ggdHlwZVxyXG4gICAgICB3aGVuIDAsIDEsIDIsIDMsIDRcclxuICAgICAgICB0eXBlXHJcbiAgICAgIHdoZW4gNSwgNiwgN1xyXG4gICAgICAgIDcgKyAoMyAqICh0eXBlIC0gNSkpXHJcbiAgICBpZiBoaWdobGlnaHRcclxuICAgICAgaW5kZXggKz0gMTZcclxuICAgIGluZGV4ICs9IHBvd2VyXHJcbiAgICByZXR1cm4gaW5kZXhcclxuXHJcbiAgZW1pdFNjb3JlUGFydGljbGU6IChncmlkWCwgZ3JpZFksIHR5cGUsIHNjb3JlKSAtPlxyXG4gICAgIyBoYWNrXHJcbiAgICB0ZXh0Q29sb3IgPSBcIiNmZmZcIlxyXG4gICAgaWYgdHlwZSA9PSAwICMgYnJva2VuXHJcbiAgICAgIHNjb3JlICo9IC0xXHJcbiAgICAgIHRleHRDb2xvciA9IFwiI2Y2NlwiXHJcblxyXG4gICAgcCA9IEBncmlkVG9TY3JlZW4oZ3JpZFgsIGdyaWRZKVxyXG4gICAgc3R5bGUgPSB7IGZvbnQ6IFwiYm9sZCAyNHB4IEFyaWFsXCIsIGZpbGw6IHRleHRDb2xvciwgYm91bmRzQWxpZ25IOiBcImNlbnRlclwiLCBib3VuZHNBbGlnblY6IFwibWlkZGxlXCIgfVxyXG4gICAgdGV4dCA9IEBnYW1lLmFkZC50ZXh0KHAueCwgcC55LCBcIlwiK3Njb3JlLCBzdHlsZSlcclxuICAgIHRleHQuc2V0U2hhZG93KDMsIDMsICdyZ2JhKDAsMCwwLDAuNSknLCAyKVxyXG4gICAgdGV4dC5zZXRUZXh0Qm91bmRzKDAsIDAsIEBnZW1TaXplLCBAZ2VtU2l6ZSk7XHJcbiAgICBAZ2FtZS5hZGQudHdlZW4odGV4dCkudG8oeyB5OiBwLnkgLSAoQGdlbVNpemUgLyA0KSwgYWxwaGE6IDAgfSwgMTAwMCwgUGhhc2VyLkVhc2luZy5RdWFydGljLkluLCB0cnVlKVxyXG4gICAgQGdhbWUuYWRkLnR3ZWVuKHRleHQuc2NhbGUpLnRvKHsgeDogMiwgeTogMiB9LCAxMDAwLCBQaGFzZXIuRWFzaW5nLkxpbmVhci5Ob25lLCB0cnVlKVxyXG4gICAgQGdhbWUudGltZS5ldmVudHMuYWRkIDEwMDAsIC0+XHJcbiAgICAgIHRleHQuZGVzdHJveSgpXHJcblxyXG4gIGJlc3RHZW1Ub1NwYXduOiAtPlxyXG4gICAgIyBUT0RPOiBEZWNpZGUgYmFzZWQgb24gY3VycmVudCBnZW0gZGlzdHJpYnV0aW9uXHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOClcclxuXHJcbiAgbW92ZUdlbUhvbWU6IChneCwgZ3ksIGJvdW5jZT1mYWxzZSkgLT5cclxuICAgIGdlbSA9IEBncmlkW2d4XVtneV1cclxuICAgIGlmIGdlbSA9PSBudWxsXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgICMgY29uc29sZS5sb2cgXCJtb3ZlR2VtSG9tZSgje2d4fSwgI3tneX0pXCJcclxuXHJcbiAgICB4ID0gQGdyaWRYICsgKGd4ICogQGdlbVNpemUpXHJcbiAgICB5ID0gQGdyaWRZICsgKGd5ICogQGdlbVNpemUpXHJcbiAgICBlYXNpbmcgPSBQaGFzZXIuRWFzaW5nLkxpbmVhci5Ob25lXHJcbiAgICBzcGVlZCA9IDEwMFxyXG4gICAgaWYgYm91bmNlXHJcbiAgICAgIGVhc2luZyA9IFBoYXNlci5FYXNpbmcuQm91bmNlLk91dFxyXG4gICAgICBzcGVlZCA9IDQwMFxyXG4gICAgQGdhbWUuYWRkLnR3ZWVuKGdlbS5zcHJpdGUpLnRvKHsgeDogeCwgeTogeSB9LCBzcGVlZCwgZWFzaW5nLCB0cnVlKVxyXG5cclxuICBzcGF3bkdlbXM6IC0+XHJcbiAgICAjIGRyb3AgZ2VtcyBmcm9tIGhpZ2hlciB1cCBzbG90cyBkb3duXHJcbiAgICBuZXdHcmlkID0gQXJyYXkoQGdyaWRDWClcclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgbmV3R3JpZFtpXSA9IEFycmF5KEBncmlkQ1kpXHJcbiAgICAgIG9sZEluZGV4ID0gbmV3SW5kZXggPSBAZ3JpZENZIC0gMVxyXG4gICAgICB3aGlsZSBvbGRJbmRleCA+PSAwXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bb2xkSW5kZXhdICE9IG51bGxcclxuICAgICAgICAgIG5ld0dyaWRbaV1bbmV3SW5kZXhdID0gQGdyaWRbaV1bb2xkSW5kZXhdXHJcbiAgICAgICAgICBuZXdJbmRleCAtPSAxXHJcbiAgICAgICAgb2xkSW5kZXggLT0gMVxyXG4gICAgICB3aGlsZSBuZXdJbmRleCA+PSAwXHJcbiAgICAgICAgbmV3R3JpZFtpXVtuZXdJbmRleF0gPSBudWxsXHJcbiAgICAgICAgbmV3SW5kZXggLT0gMVxyXG4gICAgQGdyaWQgPSBuZXdHcmlkXHJcblxyXG4gICAgIyB1cGRhdGUgc3ByaXRlcyBhbmQgeC95XHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBnZW0gPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGlmIGdlbSA9PSBudWxsXHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIGlmIChnZW0ueCAhPSBpKSBvciAoZ2VtLnkgIT0gailcclxuICAgICAgICAgIGdlbS54ID0gaVxyXG4gICAgICAgICAgZ2VtLnkgPSBqXHJcbiAgICAgICAgICBAbW92ZUdlbUhvbWUoaSwgaiwgdHJ1ZSlcclxuXHJcbiAgICAjIGRyb3AgZnJvbSB0aGUgdG9wXHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSA9PSBudWxsXHJcbiAgICAgICAgICBnZW1UeXBlID0gQGJlc3RHZW1Ub1NwYXduKClcclxuICAgICAgICAgIG1hdGNoID0gMFxyXG4gICAgICAgICAgcG93ZXIgPSBmYWxzZVxyXG4gICAgICAgICAgeCA9IEBncmlkWCArIChpICogQGdlbVNpemUpXHJcbiAgICAgICAgICB5ID0gQGdyaWRZICsgKGogKiBAZ2VtU2l6ZSlcclxuICAgICAgICAgIGFydCA9IEBnZW1BcnRJbmRleChnZW1UeXBlLCAobWF0Y2ggPiAwKSwgcG93ZXIpXHJcbiAgICAgICAgICBzcHJpdGUgPSBAZ2FtZS5hZGQuc3ByaXRlKHgsIHkgLSBAZ3JpZEgsICdnZW1zJywgYXJ0KVxyXG4gICAgICAgICAgc3ByaXRlLndpZHRoID0gQGdlbVNpemVcclxuICAgICAgICAgIHNwcml0ZS5oZWlnaHQgPSBAZ2VtU2l6ZVxyXG4gICAgICAgICAgc3ByaXRlLmlucHV0RW5hYmxlZCA9IHRydWVcclxuICAgICAgICAgIEBnYW1lLndvcmxkLnNlbmRUb0JhY2soc3ByaXRlKVxyXG4gICAgICAgICAgQGdhbWUuYWRkLnR3ZWVuKHNwcml0ZSkudG8oeyB5OiB5IH0sIDQwMCwgUGhhc2VyLkVhc2luZy5Cb3VuY2UuT3V0LCB0cnVlKVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPVxyXG4gICAgICAgICAgICBzcHJpdGU6IHNwcml0ZVxyXG4gICAgICAgICAgICB4OiBpXHJcbiAgICAgICAgICAgIHk6IGpcclxuICAgICAgICAgICAgdHlwZTogZ2VtVHlwZVxyXG4gICAgICAgICAgICBtYXRjaDogbWF0Y2hcclxuICAgICAgICAgICAgcG93ZXI6IHBvd2VyXHJcbiAgICAgICAgICAgIGFydDogYXJ0XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoXHJcbiIsIk1hdGNoID0gcmVxdWlyZSAnLi9NYXRjaCdcclxuXHJcbm9uRGV2aWNlUmVhZHkgPSAtPlxyXG4gIGNvbnNvbGUubG9nKCdkZXZpY2VyZWFkeScpXHJcbiAgd2luZG93Lm1hdGNoID0gbmV3IE1hdGNoXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcImluaXRcIlxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5Jywgb25EZXZpY2VSZWFkeSwgZmFsc2UpXHJcblxyXG5pbml0KClcclxuIl19
