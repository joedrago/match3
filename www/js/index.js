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
    return this.spawnGems();
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
    this.rewindDrag();
    this.finishDrag();
    return this.resetHighlights();
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

  Match.prototype.resetHighlights = function() {
    var i, j, k, ref, results;
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
    this.resetHighlights();
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
    console.log("breakGem(" + x + ", " + y + ")");
    if (this.grid[x][y] !== null) {
      this.grid[x][y].sprite.destroy();
      this.grid[x][y] = null;
    }
    if ((x > 0) && (this.grid[x - 1][y] !== null)) {
      this.grid[x - 1][y].sprite.destroy();
      this.grid[x - 1][y] = null;
    }
    if ((x < this.gridCX - 1) && (this.grid[x + 1][y] !== null)) {
      this.grid[x + 1][y].sprite.destroy();
      return this.grid[x + 1][y] = null;
    }
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
    var p, style, text;
    p = this.gridToScreen(gridX, gridY);
    style = {
      font: "bold 16px Arial",
      fill: "#fff",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dcXHNyY1xcTWF0Y2guY29mZmVlIiwid3d3XFxzcmNcXG1haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBTTtFQUNTLGVBQUE7SUFDWCxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCLE1BQU0sQ0FBQyxNQUFuQyxFQUEyQyxnQkFBM0MsRUFBNkQ7TUFDdkUsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRDhEO01BRXZFLE1BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUY4RDtNQUd2RSxNQUFBLEVBQVMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIOEQ7S0FBN0Q7SUFPWixJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVTtFQVRDOztrQkFXYixPQUFBLEdBQVMsU0FBQTtJQUNQLE9BQU8sQ0FBQyxHQUFSLENBQVksaUJBQVo7V0FDQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFYLENBQXVCLE1BQXZCLEVBQStCLGNBQS9CLEVBQStDLEVBQS9DLEVBQW1ELEVBQW5ELEVBQXVELENBQUMsQ0FBeEQsRUFBMkQsQ0FBM0QsRUFBOEQsQ0FBOUQ7RUFGTzs7a0JBSVQsTUFBQSxHQUFRLFNBQUE7SUFDTixPQUFPLENBQUMsR0FBUixDQUFZLGtCQUFBLEdBQW1CLE1BQU0sQ0FB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LE9BQVAsR0FBaUI7Ozs7QUMxVmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztBQUVSLGFBQUEsR0FBZ0IsU0FBQTtFQUNkLE9BQU8sQ0FBQyxHQUFSLENBQVksYUFBWjtTQUNBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBSTtBQUZMOztBQUloQixJQUFBLEdBQU8sU0FBQTtFQUNMLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjtTQUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixhQUExQixFQUF5QyxhQUF6QyxFQUF3RCxLQUF4RDtBQUZLOztBQUlQLElBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBNYXRjaFxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUgXCIxMDAlXCIsIFwiMTAwJVwiLCBQaGFzZXIuQ0FOVkFTLCAncGhhc2VyLWV4YW1wbGUnLCB7XHJcbiAgICAgIHByZWxvYWQ6ID0+IEBwcmVsb2FkKClcclxuICAgICAgY3JlYXRlOiAgPT4gQGNyZWF0ZSgpXHJcbiAgICAgIHVwZGF0ZTogID0+IEB1cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgICMgR3JpZCBnZW0gY291bnRzXHJcbiAgICBAZ3JpZENYID0gOFxyXG4gICAgQGdyaWRDWSA9IDdcclxuXHJcbiAgcHJlbG9hZDogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiTWF0Y2gucHJlbG9hZCgpXCJcclxuICAgIEBnYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ2dlbXMnLCAnaW1nL2dlbXMucG5nJywgODAsIDgwLCAtMSwgNCwgNClcclxuXHJcbiAgY3JlYXRlOiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJNYXRjaC5jcmVhdGUoKTogI3t3aW5kb3cuaW5uZXJXaWR0aH14I3t3aW5kb3cuaW5uZXJIZWlnaHR9XCJcclxuICAgIEBzY3JlZW5XID0gd2luZG93LmlubmVyV2lkdGhcclxuICAgIEBzY3JlZW5IID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICBpZiBAc2NyZWVuVyA+IEBzY3JlZW5IXHJcbiAgICAgIEBzY3JlZW5XID0gTWF0aC5mbG9vcihAc2NyZWVuSCAvIDE2ICogOSlcclxuICAgIGNvbnNvbGUubG9nIFwiY3JlYXRlZCBzY3JlZW4gI3tAc2NyZWVuV314I3tAc2NyZWVuSH1cIlxyXG5cclxuICAgIEBnZW1TaXplID0gQHNjcmVlblcgLyBAZ3JpZENYXHJcbiAgICBAZ3JpZFcgPSBAZ2VtU2l6ZSAqIEBncmlkQ1hcclxuICAgIEBncmlkSCA9IEBnZW1TaXplICogQGdyaWRDWVxyXG4gICAgQGdyaWRYID0gMFxyXG4gICAgQGdyaWRZID0gKChAc2NyZWVuSCAtIChAZ2VtU2l6ZSAqIEBncmlkQ1kpKSAtIEBnZW1TaXplKSA+PiAxXHJcblxyXG4gICAgQGdhbWUuaW5wdXQub25Eb3duLmFkZCAocCkgPT4gQG9uRG93bihwKVxyXG4gICAgQGdhbWUuaW5wdXQub25VcC5hZGQgKHApID0+IEBvblVwKHApXHJcblxyXG4gICAgQG5ld0dhbWUoKVxyXG5cclxuICBuZXdHYW1lOiAtPlxyXG4gICAgQGRyYWdTdGFydFggPSBudWxsXHJcbiAgICBAZHJhZ1N0YXJ0WSA9IG51bGxcclxuXHJcbiAgICBpZiBAZ3JpZFxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgICAgZm9yIGogaW4gWzAuLi5AZ3JpZENZXVxyXG4gICAgICAgICAgaWYgQGdyaWRbaV1bal1cclxuICAgICAgICAgICAgQGdyaWRbaV1bal0uc3ByaXRlLmRlc3Ryb3koKVxyXG5cclxuICAgIEBncmlkID0gQXJyYXkoQGdyaWRDWClcclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgQGdyaWRbaV0gPSBBcnJheShAZ3JpZENZKVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgICAgQGdyaWRbaV1bal0gPSBudWxsXHJcbiAgICBAc3Bhd25HZW1zKClcclxuXHJcbiAgdXBkYXRlOiAtPlxyXG5cclxuICBzY3JlZW5Ub0dyaWQ6ICh4LCB5LCBuZWFyZXN0PWZhbHNlKSAtPlxyXG4gICAgZyA9XHJcbiAgICAgIHg6IE1hdGguZmxvb3IoKHggLSBAZ3JpZFgpIC8gQGdlbVNpemUpXHJcbiAgICAgIHk6IE1hdGguZmxvb3IoKHkgLSBAZ3JpZFkpIC8gQGdlbVNpemUpXHJcbiAgICBpZiBuZWFyZXN0XHJcbiAgICAgIGcueCA9IE1hdGgubWF4KGcueCwgMClcclxuICAgICAgZy54ID0gTWF0aC5taW4oZy54LCBAZ3JpZENYIC0gMSlcclxuICAgICAgZy55ID0gTWF0aC5tYXgoZy55LCAwKVxyXG4gICAgICBnLnkgPSBNYXRoLm1pbihnLnksIEBncmlkQ1kgLSAxKVxyXG4gICAgZWxzZSBpZiAoZy54IDwgMCkgb3IgKGcueCA+PSBAZ3JpZENYKSBvciAoZy55IDwgMCkgb3IgKGcueSA+PSBAZ3JpZENZKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgcmV0dXJuIGdcclxuXHJcbiAgZ3JpZFRvU2NyZWVuOiAoeCwgeSkgLT5cclxuICAgIGNvbnNvbGUubG9nXHJcbiAgICBwID1cclxuICAgICAgeDogTWF0aC5mbG9vcih4ICogQGdlbVNpemUpICsgQGdyaWRYXHJcbiAgICAgIHk6IE1hdGguZmxvb3IoeSAqIEBnZW1TaXplKSArIEBncmlkWVxyXG4gICAgcmV0dXJuIHBcclxuXHJcbiAgc3dhcENoYWluOiAoc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFksIGRyYWdnaW5nPWZhbHNlKSAtPlxyXG4gICAgeCA9IHN0YXJ0WFxyXG4gICAgeSA9IHN0YXJ0WVxyXG4gICAgZGVsdGFYID0gZW5kWCAtIHhcclxuICAgIGRlbHRhWSA9IGVuZFkgLSB5XHJcbiAgICBkZWx0YVggPSBNYXRoLm1heChkZWx0YVgsIC0xKVxyXG4gICAgZGVsdGFYID0gTWF0aC5taW4oZGVsdGFYLCAxKVxyXG4gICAgZGVsdGFZID0gTWF0aC5tYXgoZGVsdGFZLCAtMSlcclxuICAgIGRlbHRhWSA9IE1hdGgubWluKGRlbHRhWSwgMSlcclxuICAgIHdoaWxlICh4ICE9IGVuZFgpIG9yICh5ICE9IGVuZFkpXHJcbiAgICAgIG5ld1ggPSB4ICsgZGVsdGFYXHJcbiAgICAgIG5ld1kgPSB5ICsgZGVsdGFZXHJcbiAgICAgICMgY29uc29sZS5sb2cgXCJTV0FQICN7eH0gI3t5fSA8LT4gI3tuZXdYfSAje25ld1l9XCJcclxuICAgICAgdGVtcCA9IEBncmlkW3hdW3ldXHJcbiAgICAgIEBncmlkW3hdW3ldID0gQGdyaWRbbmV3WF1bbmV3WV1cclxuICAgICAgQGdyaWRbbmV3WF1bbmV3WV0gPSB0ZW1wXHJcbiAgICAgIGlmIEBncmlkW3hdW3ldICE9IG51bGxcclxuICAgICAgICBAZ3JpZFt4XVt5XS54ID0geFxyXG4gICAgICAgIEBncmlkW3hdW3ldLnkgPSB5XHJcbiAgICAgIGlmIEBncmlkW25ld1hdW25ld1ldICE9IG51bGxcclxuICAgICAgICBAZ3JpZFtuZXdYXVtuZXdZXS54ID0gbmV3WFxyXG4gICAgICAgIEBncmlkW25ld1hdW25ld1ldLnkgPSBuZXdZXHJcbiAgICAgIEBtb3ZlR2VtSG9tZSh4LCB5KVxyXG4gICAgICBpZiBub3QgZHJhZ2dpbmdcclxuICAgICAgICBAbW92ZUdlbUhvbWUobmV3WCwgbmV3WSlcclxuICAgICAgeCA9IG5ld1hcclxuICAgICAgeSA9IG5ld1lcclxuXHJcbiAgb25Eb3duOiAocCkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJkb3duXCIsIFtwLngscC55LHAuc2NyZWVuWCxwLnNjcmVlblldXHJcbiAgICBnID0gQHNjcmVlblRvR3JpZChwLngsIHAueSlcclxuICAgIGlmIGcgPT0gbnVsbFxyXG4gICAgICBjb25zb2xlLmxvZyBcImJhZCBjb29yZFwiXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGlmIEBncmlkW2cueF1bZy55XSAhPSBudWxsXHJcbiAgICAgICMgY29uc29sZS5sb2cgXCJlbmFibGluZyBkcmFnIG9uICN7Zy54fSAje2cueX1cIlxyXG4gICAgICBzcHJpdGUgPSBAZ3JpZFtnLnhdW2cueV0uc3ByaXRlXHJcbiAgICAgIHNwcml0ZS5pbnB1dC5lbmFibGVEcmFnKHRydWUpXHJcbiAgICAgIHNwcml0ZS5ldmVudHMub25EcmFnVXBkYXRlLmFkZCAoc3ByaXRlLCBwb2ludGVyLCBkcmFnWCwgZHJhZ1ksIHNuYXBQb2ludCkgPT5cclxuICAgICAgICAjIEhhdmUgdG8gYWRkIGhhbGYgYSBnZW0gYmVjYXVzZSBkcmFnWC9ZIGlzIHRoZSB0b3BsZWZ0IG9mIHRoZSBkcmFnZ2VkIGdlbVxyXG4gICAgICAgIEBvbk92ZXIoTWF0aC5mbG9vcihkcmFnWCArIChAZ2VtU2l6ZSAvIDIpKSwgTWF0aC5mbG9vcihkcmFnWSArIChAZ2VtU2l6ZSAvIDIpKSlcclxuICAgICAgQGRyYWdTdGFydFggPSBAZHJhZ1ggPSBnLnhcclxuICAgICAgQGRyYWdTdGFydFkgPSBAZHJhZ1kgPSBnLnlcclxuXHJcbiAgICAjIEBlbWl0U2NvcmVQYXJ0aWNsZShnLngsIGcueSwgMCwgMTAwKVxyXG4gICAgIyBAYnJlYWtHZW0oZy54LCBnLnkpXHJcbiAgICAjIEBzcGF3bkdlbXMoKVxyXG5cclxuICBvbk92ZXI6ICh4LCB5KSAtPlxyXG4gICAgaWYgKEBkcmFnU3RhcnRYID09IG51bGwpIG9yIChAZHJhZ1N0YXJ0WSA9PSBudWxsKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBnID0gQHNjcmVlblRvR3JpZCh4LCB5LCB0cnVlKVxyXG4gICAgZGVsdGFYID0gTWF0aC5hYnMoZy54IC0gQGRyYWdTdGFydFgpXHJcbiAgICBkZWx0YVkgPSBNYXRoLmFicyhnLnkgLSBAZHJhZ1N0YXJ0WSlcclxuICAgIGlmIChkZWx0YVggPT0gMCkgYW5kIChkZWx0YVkgPT0gMClcclxuICAgICAgaWYgKEBkcmFnWCAhPSBAZHJhZ1N0YXJ0WCkgb3IgKEBkcmFnWSAhPSBAZHJhZ1N0YXJ0WSlcclxuICAgICAgICBAcmV3aW5kRHJhZygpXHJcbiAgICAgICAgQGZpbmRNYXRjaGVzKClcclxuICAgICAgcmV0dXJuXHJcbiAgICBpZiAoZy54ID09IEBkcmFnWCkgYW5kIChnLnkgPT0gQGRyYWdZKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBpZiBkZWx0YVggPCBkZWx0YVlcclxuICAgICAgZy54ID0gQGRyYWdTdGFydFhcclxuICAgICAgaWYgQGRyYWdYICE9IEBkcmFnU3RhcnRYXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInJld2luZGluZyBkcmFnIFggI3tkZWx0YVh9ICN7ZGVsdGFZfVwiXHJcbiAgICAgICAgQHJld2luZERyYWcodHJ1ZSlcclxuICAgIGVsc2VcclxuICAgICAgZy55ID0gQGRyYWdTdGFydFlcclxuICAgICAgaWYgQGRyYWdZICE9IEBkcmFnU3RhcnRZXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInJld2luZGluZyBkcmFnIFkgI3tkZWx0YVh9ICN7ZGVsdGFZfVwiXHJcbiAgICAgICAgQHJld2luZERyYWcodHJ1ZSlcclxuXHJcbiAgICBAc3dhcENoYWluKEBkcmFnWCwgQGRyYWdZLCBnLngsIGcueSwgdHJ1ZSlcclxuICAgIEBkcmFnWCA9IGcueFxyXG4gICAgQGRyYWdZID0gZy55XHJcbiAgICBAZmluZE1hdGNoZXMoKVxyXG5cclxuICBvblVwOiAocCkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJ1cFwiLCBbcC54LHAueSxwLnNjcmVlblgscC5zY3JlZW5ZXVxyXG4gICAgaWYgKEBkcmFnU3RhcnRYID09IG51bGwpIG9yIChAZHJhZ1N0YXJ0WSA9PSBudWxsKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBAcmV3aW5kRHJhZygpXHJcbiAgICBAZmluaXNoRHJhZygpXHJcbiAgICBAcmVzZXRIaWdobGlnaHRzKClcclxuXHJcbiAgZmluaXNoRHJhZzogLT5cclxuICAgIGlmIChAZHJhZ1ggIT0gbnVsbCkgYW5kIChAZHJhZ1kgIT0gbnVsbCkgYW5kIChAZ3JpZFtAZHJhZ1hdW0BkcmFnWV0gIT0gbnVsbClcclxuICAgICAgQGdyaWRbQGRyYWdYXVtAZHJhZ1ldLnNwcml0ZS5pbnB1dC5lbmFibGVEcmFnKGZhbHNlKVxyXG4gICAgICBAZ3JpZFtAZHJhZ1hdW0BkcmFnWV0uc3ByaXRlLmV2ZW50cy5vbkRyYWdVcGRhdGUucmVtb3ZlQWxsKClcclxuICAgIEBkcmFnU3RhcnRYID0gQGRyYWdYID0gbnVsbFxyXG4gICAgQGRyYWdTdGFydFkgPSBAZHJhZ1kgPSBudWxsXHJcblxyXG4gIHJld2luZERyYWc6IChkcmFnZ2luZz1mYWxzZSkgLT5cclxuICAgIGlmIChAZHJhZ1N0YXJ0WCAhPSBudWxsKSBhbmQgKEBkcmFnU3RhcnRZICE9IG51bGwpXHJcbiAgICAgICMgY29uc29sZS5sb2cgXCJtb3ZpbmcgKCN7QGRyYWdYfSwgI3tAZHJhZ1l9KSBob21lICgje0BkcmFnU3RhcnRYfSwgI3tAZHJhZ1N0YXJ0WX0pXCJcclxuICAgICAgQHN3YXBDaGFpbihAZHJhZ1gsIEBkcmFnWSwgQGRyYWdTdGFydFgsIEBkcmFnU3RhcnRZLCBkcmFnZ2luZylcclxuICAgICAgaWYgbm90IGRyYWdnaW5nXHJcbiAgICAgICAgQG1vdmVHZW1Ib21lKEBkcmFnU3RhcnRYLCBAZHJhZ1N0YXJ0WSlcclxuICAgICAgQGRyYWdYID0gQGRyYWdTdGFydFhcclxuICAgICAgQGRyYWdZID0gQGRyYWdTdGFydFlcclxuXHJcbiAgdXBkYXRlQXJ0OiAoZ3gsIGd5KSAtPlxyXG4gICAgaWYgQGdyaWRbZ3hdW2d5XSAhPSBudWxsXHJcbiAgICAgIGdlbSA9IEBncmlkW2d4XVtneV1cclxuICAgICAgYXJ0ID0gQGdlbUFydEluZGV4KGdlbS50eXBlLCAoZ2VtLm1hdGNoID4gMCksIGdlbS5wb3dlcilcclxuICAgICAgaWYgZ2VtLmFydCAhPSBhcnRcclxuICAgICAgICBnZW0uYXJ0ID0gYXJ0XHJcbiAgICAgICAgZ2VtLnNwcml0ZS5mcmFtZSA9IGFydFxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlc2V0SGlnaGxpZ2h0czogLT5cclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgZm9yIGogaW4gWzAuLi5AZ3JpZENZXVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdICE9IG51bGxcclxuICAgICAgICAgIEBncmlkW2ldW2pdLm1hdGNoID0gMFxyXG4gICAgICAgICAgQHVwZGF0ZUFydChpLCBqKVxyXG5cclxuICBhZGRNYXRjaFN0cmlwOiAoc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFksIG1hdGNoQ291bnQpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiYWRkTWF0Y2hTdHJpcCgje3N0YXJ0WH0sICN7c3RhcnRZfSwgI3tlbmRYfSwgI3tlbmRZfSlcIlxyXG4gICAgZm9yIHggaW4gW3N0YXJ0WC4uZW5kWF1cclxuICAgICAgZm9yIHkgaW4gW3N0YXJ0WS4uZW5kWV1cclxuICAgICAgICBAZ3JpZFt4XVt5XS5tYXRjaCArPSBtYXRjaENvdW50XHJcbiAgICAgICAgQHVwZGF0ZUFydCh4LCB5KVxyXG5cclxuICBmaW5kTWF0Y2hlczogLT5cclxuICAgIEByZXNldEhpZ2hsaWdodHMoKVxyXG5cclxuICAgICMgZXcsIGNvcHlwYXN0YVxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENYXVxyXG4gICAgICBsYXN0VHlwZSA9IC0xXHJcbiAgICAgIGNvdW50ID0gMFxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgICAgaWYgbGFzdFR5cGUgPT0gQGdyaWRbaV1bal0udHlwZVxyXG4gICAgICAgICAgY291bnQgKz0gMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGxhc3RUeXBlID0gQGdyaWRbaV1bal0udHlwZVxyXG4gICAgICAgICAgaWYgY291bnQgPj0gM1xyXG4gICAgICAgICAgICBAYWRkTWF0Y2hTdHJpcChpLCBqIC0gY291bnQsIGksIGogLSAxLCBjb3VudClcclxuICAgICAgICAgIGNvdW50ID0gMVxyXG4gICAgICBpZiBjb3VudCA+PSAzXHJcbiAgICAgICAgQGFkZE1hdGNoU3RyaXAoaSwgaiAtIGNvdW50LCBpLCBqIC0gMSwgY291bnQpXHJcbiAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgIGxhc3RUeXBlID0gLTFcclxuICAgICAgY291bnQgPSAwXHJcbiAgICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgICBpZiBsYXN0VHlwZSA9PSBAZ3JpZFtpXVtqXS50eXBlXHJcbiAgICAgICAgICBjb3VudCArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbGFzdFR5cGUgPSBAZ3JpZFtpXVtqXS50eXBlXHJcbiAgICAgICAgICBpZiBjb3VudCA+PSAzXHJcbiAgICAgICAgICAgIEBhZGRNYXRjaFN0cmlwKGkgLSBjb3VudCwgaiwgaSAtIDEsIGosIGNvdW50KVxyXG4gICAgICAgICAgY291bnQgPSAxXHJcbiAgICAgIGlmIGNvdW50ID49IDNcclxuICAgICAgICBAYWRkTWF0Y2hTdHJpcChpIC0gY291bnQsIGosIGkgLSAxLCBqLCBjb3VudClcclxuXHJcbiAgICBjb25zb2xlLmxvZyBcIi0tLS0tLS0tLS0tLVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLkBncmlkQ1ldXHJcbiAgICAgIGxpbmUgPSBcIlwiXHJcbiAgICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgICBsaW5lICs9IFwiI3tAZ3JpZFtpXVtqXS5tYXRjaH0gXCJcclxuICAgICAgY29uc29sZS5sb2cgXCIje2p9IHwgI3tsaW5lfVwiXHJcblxyXG4gIGJyZWFrR2VtOiAoeCwgeSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiYnJlYWtHZW0oI3t4fSwgI3t5fSlcIlxyXG4gICAgaWYgQGdyaWRbeF1beV0gIT0gbnVsbFxyXG4gICAgICBAZ3JpZFt4XVt5XS5zcHJpdGUuZGVzdHJveSgpXHJcbiAgICAgIEBncmlkW3hdW3ldID0gbnVsbFxyXG4gICAgaWYgKHggPiAwKSBhbmQgKEBncmlkW3gtMV1beV0gIT0gbnVsbClcclxuICAgICAgQGdyaWRbeC0xXVt5XS5zcHJpdGUuZGVzdHJveSgpXHJcbiAgICAgIEBncmlkW3gtMV1beV0gPSBudWxsXHJcbiAgICBpZiAoeCA8IEBncmlkQ1gtMSkgYW5kIChAZ3JpZFt4KzFdW3ldICE9IG51bGwpXHJcbiAgICAgIEBncmlkW3grMV1beV0uc3ByaXRlLmRlc3Ryb3koKVxyXG4gICAgICBAZ3JpZFt4KzFdW3ldID0gbnVsbFxyXG5cclxuICBnZW1BcnRJbmRleDogKHR5cGUsIGhpZ2hsaWdodD1mYWxzZSwgcG93ZXI9MCkgLT5cclxuICAgIGluZGV4ID0gc3dpdGNoIHR5cGVcclxuICAgICAgd2hlbiAwLCAxLCAyLCAzLCA0XHJcbiAgICAgICAgdHlwZVxyXG4gICAgICB3aGVuIDUsIDYsIDdcclxuICAgICAgICA3ICsgKDMgKiAodHlwZSAtIDUpKVxyXG4gICAgaWYgaGlnaGxpZ2h0XHJcbiAgICAgIGluZGV4ICs9IDE2XHJcbiAgICBpbmRleCArPSBwb3dlclxyXG4gICAgcmV0dXJuIGluZGV4XHJcblxyXG4gIGVtaXRTY29yZVBhcnRpY2xlOiAoZ3JpZFgsIGdyaWRZLCB0eXBlLCBzY29yZSkgLT5cclxuICAgIHAgPSBAZ3JpZFRvU2NyZWVuKGdyaWRYLCBncmlkWSlcclxuICAgIHN0eWxlID0geyBmb250OiBcImJvbGQgMTZweCBBcmlhbFwiLCBmaWxsOiBcIiNmZmZcIiwgYm91bmRzQWxpZ25IOiBcImNlbnRlclwiLCBib3VuZHNBbGlnblY6IFwibWlkZGxlXCIgfVxyXG4gICAgdGV4dCA9IEBnYW1lLmFkZC50ZXh0KHAueCwgcC55LCBcIlwiK3Njb3JlLCBzdHlsZSlcclxuICAgIHRleHQuc2V0U2hhZG93KDMsIDMsICdyZ2JhKDAsMCwwLDAuNSknLCAyKVxyXG4gICAgdGV4dC5zZXRUZXh0Qm91bmRzKDAsIDAsIEBnZW1TaXplLCBAZ2VtU2l6ZSk7XHJcbiAgICBAZ2FtZS5hZGQudHdlZW4odGV4dCkudG8oeyB5OiBwLnkgLSAoQGdlbVNpemUgLyA0KSwgYWxwaGE6IDAgfSwgMTAwMCwgUGhhc2VyLkVhc2luZy5RdWFydGljLkluLCB0cnVlKVxyXG4gICAgQGdhbWUuYWRkLnR3ZWVuKHRleHQuc2NhbGUpLnRvKHsgeDogMiwgeTogMiB9LCAxMDAwLCBQaGFzZXIuRWFzaW5nLkxpbmVhci5Ob25lLCB0cnVlKVxyXG4gICAgQGdhbWUudGltZS5ldmVudHMuYWRkIDEwMDAsIC0+XHJcbiAgICAgIHRleHQuZGVzdHJveSgpXHJcblxyXG4gIGJlc3RHZW1Ub1NwYXduOiAtPlxyXG4gICAgIyBUT0RPOiBEZWNpZGUgYmFzZWQgb24gY3VycmVudCBnZW0gZGlzdHJpYnV0aW9uXHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOClcclxuXHJcbiAgbW92ZUdlbUhvbWU6IChneCwgZ3ksIGJvdW5jZT1mYWxzZSkgLT5cclxuICAgIGdlbSA9IEBncmlkW2d4XVtneV1cclxuICAgIGlmIGdlbSA9PSBudWxsXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgICMgY29uc29sZS5sb2cgXCJtb3ZlR2VtSG9tZSgje2d4fSwgI3tneX0pXCJcclxuXHJcbiAgICB4ID0gQGdyaWRYICsgKGd4ICogQGdlbVNpemUpXHJcbiAgICB5ID0gQGdyaWRZICsgKGd5ICogQGdlbVNpemUpXHJcbiAgICBlYXNpbmcgPSBQaGFzZXIuRWFzaW5nLkxpbmVhci5Ob25lXHJcbiAgICBzcGVlZCA9IDEwMFxyXG4gICAgaWYgYm91bmNlXHJcbiAgICAgIGVhc2luZyA9IFBoYXNlci5FYXNpbmcuQm91bmNlLk91dFxyXG4gICAgICBzcGVlZCA9IDQwMFxyXG4gICAgQGdhbWUuYWRkLnR3ZWVuKGdlbS5zcHJpdGUpLnRvKHsgeDogeCwgeTogeSB9LCBzcGVlZCwgZWFzaW5nLCB0cnVlKVxyXG5cclxuICBzcGF3bkdlbXM6IC0+XHJcbiAgICAjIGRyb3AgZ2VtcyBmcm9tIGhpZ2hlciB1cCBzbG90cyBkb3duXHJcbiAgICBuZXdHcmlkID0gQXJyYXkoQGdyaWRDWClcclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDWF1cclxuICAgICAgbmV3R3JpZFtpXSA9IEFycmF5KEBncmlkQ1kpXHJcbiAgICAgIG9sZEluZGV4ID0gbmV3SW5kZXggPSBAZ3JpZENZIC0gMVxyXG4gICAgICB3aGlsZSBvbGRJbmRleCA+PSAwXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bb2xkSW5kZXhdICE9IG51bGxcclxuICAgICAgICAgIG5ld0dyaWRbaV1bbmV3SW5kZXhdID0gQGdyaWRbaV1bb2xkSW5kZXhdXHJcbiAgICAgICAgICBuZXdJbmRleCAtPSAxXHJcbiAgICAgICAgb2xkSW5kZXggLT0gMVxyXG4gICAgICB3aGlsZSBuZXdJbmRleCA+PSAwXHJcbiAgICAgICAgbmV3R3JpZFtpXVtuZXdJbmRleF0gPSBudWxsXHJcbiAgICAgICAgbmV3SW5kZXggLT0gMVxyXG4gICAgQGdyaWQgPSBuZXdHcmlkXHJcblxyXG4gICAgIyB1cGRhdGUgc3ByaXRlcyBhbmQgeC95XHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBnZW0gPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGlmIGdlbSA9PSBudWxsXHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIGlmIChnZW0ueCAhPSBpKSBvciAoZ2VtLnkgIT0gailcclxuICAgICAgICAgIGdlbS54ID0gaVxyXG4gICAgICAgICAgZ2VtLnkgPSBqXHJcbiAgICAgICAgICBAbW92ZUdlbUhvbWUoaSwgaiwgdHJ1ZSlcclxuXHJcbiAgICAjIGRyb3AgZnJvbSB0aGUgdG9wXHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ1hdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRDWV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSA9PSBudWxsXHJcbiAgICAgICAgICBnZW1UeXBlID0gQGJlc3RHZW1Ub1NwYXduKClcclxuICAgICAgICAgIG1hdGNoID0gMFxyXG4gICAgICAgICAgcG93ZXIgPSBmYWxzZVxyXG4gICAgICAgICAgeCA9IEBncmlkWCArIChpICogQGdlbVNpemUpXHJcbiAgICAgICAgICB5ID0gQGdyaWRZICsgKGogKiBAZ2VtU2l6ZSlcclxuICAgICAgICAgIGFydCA9IEBnZW1BcnRJbmRleChnZW1UeXBlLCAobWF0Y2ggPiAwKSwgcG93ZXIpXHJcbiAgICAgICAgICBzcHJpdGUgPSBAZ2FtZS5hZGQuc3ByaXRlKHgsIHkgLSBAZ3JpZEgsICdnZW1zJywgYXJ0KVxyXG4gICAgICAgICAgc3ByaXRlLndpZHRoID0gQGdlbVNpemVcclxuICAgICAgICAgIHNwcml0ZS5oZWlnaHQgPSBAZ2VtU2l6ZVxyXG4gICAgICAgICAgc3ByaXRlLmlucHV0RW5hYmxlZCA9IHRydWVcclxuICAgICAgICAgIEBnYW1lLndvcmxkLnNlbmRUb0JhY2soc3ByaXRlKVxyXG4gICAgICAgICAgQGdhbWUuYWRkLnR3ZWVuKHNwcml0ZSkudG8oeyB5OiB5IH0sIDQwMCwgUGhhc2VyLkVhc2luZy5Cb3VuY2UuT3V0LCB0cnVlKVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPVxyXG4gICAgICAgICAgICBzcHJpdGU6IHNwcml0ZVxyXG4gICAgICAgICAgICB4OiBpXHJcbiAgICAgICAgICAgIHk6IGpcclxuICAgICAgICAgICAgdHlwZTogZ2VtVHlwZVxyXG4gICAgICAgICAgICBtYXRjaDogbWF0Y2hcclxuICAgICAgICAgICAgcG93ZXI6IHBvd2VyXHJcbiAgICAgICAgICAgIGFydDogYXJ0XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoXHJcbiIsIk1hdGNoID0gcmVxdWlyZSAnLi9NYXRjaCdcclxuXHJcbm9uRGV2aWNlUmVhZHkgPSAtPlxyXG4gIGNvbnNvbGUubG9nKCdkZXZpY2VyZWFkeScpXHJcbiAgd2luZG93Lm1hdGNoID0gbmV3IE1hdGNoXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcImluaXRcIlxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5Jywgb25EZXZpY2VSZWFkeSwgZmFsc2UpXHJcblxyXG5pbml0KClcclxuIl19
