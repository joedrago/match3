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
  }

  Match.prototype.preload = function() {
    console.log("Match.preload()");
    return this.game.load.spritesheet('gems', 'img/gems.png', 80, 80, -1, 4, 4);
  };

  Match.prototype.create = function() {
    var i, j, k, ref, results, sprite;
    console.log("Match.create()");
    this.screenW = window.innerWidth;
    this.screenH = window.innerHeight;
    this.gemSize = this.screenW / this.gridCX;
    this.gridX = 0;
    this.gridY = ((this.screenH - (this.gemSize * this.gridCY)) - this.gemSize) >> 1;
    results = [];
    for (i = k = 0, ref = this.gridCX; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      results.push((function() {
        var l, ref1, results1;
        results1 = [];
        for (j = l = 0, ref1 = this.gridCY; 0 <= ref1 ? l <= ref1 : l >= ref1; j = 0 <= ref1 ? ++l : --l) {
          sprite = this.game.add.sprite(this.gridX + (i * this.gemSize), this.gridY + (j * this.gemSize), 'gems', (i + (j * 8)) % 16);
          sprite.width = this.gemSize;
          results1.push(sprite.height = this.gemSize);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dcXHNyY1xcTWF0Y2guY29mZmVlIiwid3d3XFxzcmNcXG1haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBTTtFQUNTLGVBQUE7SUFDWCxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCLE1BQU0sQ0FBQyxNQUFuQyxFQUEyQyxnQkFBM0MsRUFBNkQ7TUFDdkUsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRDhEO01BRXZFLE1BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUY4RDtLQUE3RDtJQU1aLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsTUFBRCxHQUFVO0VBUkM7O2tCQVViLE9BQUEsR0FBUyxTQUFBO0lBQ1AsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQkFBWjtXQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVgsQ0FBdUIsTUFBdkIsRUFBK0IsY0FBL0IsRUFBK0MsRUFBL0MsRUFBbUQsRUFBbkQsRUFBdUQsQ0FBQyxDQUF4RCxFQUEyRCxDQUEzRCxFQUE4RCxDQUE5RDtFQUZPOztrQkFJVCxNQUFBLEdBQVEsU0FBQTtBQUNOLFFBQUE7SUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLGdCQUFaO0lBRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQUFNLENBQUM7SUFDbEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQUFNLENBQUM7SUFDbEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQTtJQUN2QixJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFDLENBQUMsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFDLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLE1BQWIsQ0FBWixDQUFBLEdBQW9DLElBQUMsQ0FBQSxPQUF0QyxDQUFBLElBQWtEO0FBRTNEO1NBQVMsc0ZBQVQ7OztBQUNFO2FBQVMsMkZBQVQ7VUFDRSxNQUFBLEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBVixDQUFpQixJQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsQ0FBQSxHQUFJLElBQUMsQ0FBQSxPQUFOLENBQTFCLEVBQTBDLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxDQUFBLEdBQUksSUFBQyxDQUFBLE9BQU4sQ0FBbkQsRUFBbUUsTUFBbkUsRUFBMkUsQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFMLENBQUEsR0FBZ0IsRUFBM0Y7VUFDVCxNQUFNLENBQUMsS0FBUCxHQUFlLElBQUMsQ0FBQTt3QkFDaEIsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsSUFBQyxDQUFBO0FBSG5COzs7QUFERjs7RUFUTTs7Ozs7O0FBZVYsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUM5QmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztBQUVSLGFBQUEsR0FBZ0IsU0FBQTtFQUNkLE9BQU8sQ0FBQyxHQUFSLENBQVksYUFBWjtTQUNBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBSTtBQUZMOztBQUloQixJQUFBLEdBQU8sU0FBQTtFQUNMLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjtTQUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixhQUExQixFQUF5QyxhQUF6QyxFQUF3RCxLQUF4RDtBQUZLOztBQUlQLElBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBNYXRjaFxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUgXCIxMDAlXCIsIFwiMTAwJVwiLCBQaGFzZXIuQ0FOVkFTLCAncGhhc2VyLWV4YW1wbGUnLCB7XHJcbiAgICAgIHByZWxvYWQ6ID0+IEBwcmVsb2FkKClcclxuICAgICAgY3JlYXRlOiAgPT4gQGNyZWF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgIyBHcmlkIGdlbSBjb3VudHNcclxuICAgIEBncmlkQ1ggPSA4XHJcbiAgICBAZ3JpZENZID0gN1xyXG5cclxuICBwcmVsb2FkOiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJNYXRjaC5wcmVsb2FkKClcIlxyXG4gICAgQGdhbWUubG9hZC5zcHJpdGVzaGVldCgnZ2VtcycsICdpbWcvZ2Vtcy5wbmcnLCA4MCwgODAsIC0xLCA0LCA0KVxyXG5cclxuICBjcmVhdGU6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcIk1hdGNoLmNyZWF0ZSgpXCJcclxuXHJcbiAgICBAc2NyZWVuVyA9IHdpbmRvdy5pbm5lcldpZHRoXHJcbiAgICBAc2NyZWVuSCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgQGdlbVNpemUgPSBAc2NyZWVuVyAvIEBncmlkQ1hcclxuICAgIEBncmlkWCA9IDBcclxuICAgIEBncmlkWSA9ICgoQHNjcmVlbkggLSAoQGdlbVNpemUgKiBAZ3JpZENZKSkgLSBAZ2VtU2l6ZSkgPj4gMVxyXG5cclxuICAgIGZvciBpIGluIFswLi5AZ3JpZENYXVxyXG4gICAgICBmb3IgaiBpbiBbMC4uQGdyaWRDWV1cclxuICAgICAgICBzcHJpdGUgPSBAZ2FtZS5hZGQuc3ByaXRlKEBncmlkWCArIChpICogQGdlbVNpemUpLCBAZ3JpZFkgKyAoaiAqIEBnZW1TaXplKSwgJ2dlbXMnLCAoaSArIChqICogOCkpICUgMTYpXHJcbiAgICAgICAgc3ByaXRlLndpZHRoID0gQGdlbVNpemVcclxuICAgICAgICBzcHJpdGUuaGVpZ2h0ID0gQGdlbVNpemVcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hcclxuIiwiTWF0Y2ggPSByZXF1aXJlICcuL01hdGNoJ1xyXG5cclxub25EZXZpY2VSZWFkeSA9IC0+XHJcbiAgY29uc29sZS5sb2coJ2RldmljZXJlYWR5JylcclxuICB3aW5kb3cubWF0Y2ggPSBuZXcgTWF0Y2hcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlcmVhZHknLCBvbkRldmljZVJlYWR5LCBmYWxzZSlcclxuXHJcbmluaXQoKVxyXG4iXX0=
