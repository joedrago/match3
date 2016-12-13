(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Match;

Match = (function() {
  function Match() {
    this.game = new Phaser.Game(720, 1280, Phaser.CANVAS, 'phaser-example', {
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
  }

  Match.prototype.preload = function() {
    console.log("Match.preload()");
    return this.game.load.spritesheet('gems', 'img/gems.png', 80, 80, -1, 2, 4);
  };

  Match.prototype.create = function() {
    var i, j, k, results;
    console.log("Match.create()");
    this.game.scale.forceOrientation(false, true);
    this.game.scale.refresh();
    console.log(window.innerWidth + "x" + window.innerHeight);
    results = [];
    for (i = k = 0; k <= 8; i = ++k) {
      results.push((function() {
        var l, results1;
        results1 = [];
        for (j = l = 0; l <= 8; j = ++l) {
          results1.push(this.game.add.sprite(i * 80, j * 80, 'gems', i + (j * 8)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dcXHNyY1xcTWF0Y2guY29mZmVlIiwid3d3XFxzcmNcXG1haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBTTtFQUNTLGVBQUE7SUFDWCxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLEVBQWlCLElBQWpCLEVBQXVCLE1BQU0sQ0FBQyxNQUE5QixFQUFzQyxnQkFBdEMsRUFBd0Q7TUFDbEUsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHlEO01BRWxFLE1BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZ5RDtLQUF4RDtFQUREOztrQkFNYixPQUFBLEdBQVMsU0FBQTtJQUNQLE9BQU8sQ0FBQyxHQUFSLENBQVksaUJBQVo7V0FFQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFYLENBQXVCLE1BQXZCLEVBQStCLGNBQS9CLEVBQStDLEVBQS9DLEVBQW1ELEVBQW5ELEVBQXVELENBQUMsQ0FBeEQsRUFBMkQsQ0FBM0QsRUFBOEQsQ0FBOUQ7RUFITzs7a0JBS1QsTUFBQSxHQUFRLFNBQUE7QUFDTixRQUFBO0lBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxnQkFBWjtJQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFaLENBQTZCLEtBQTdCLEVBQW9DLElBQXBDO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWixDQUFBO0lBRUEsT0FBTyxDQUFDLEdBQVIsQ0FBZSxNQUFNLENBQUMsVUFBUixHQUFtQixHQUFuQixHQUFzQixNQUFNLENBQUMsV0FBM0M7QUFFQTtTQUFTLDBCQUFUOzs7QUFDRTthQUFTLDBCQUFUO3dCQUNFLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQVYsQ0FBaUIsQ0FBQSxHQUFJLEVBQXJCLEVBQXlCLENBQUEsR0FBSSxFQUE3QixFQUFpQyxNQUFqQyxFQUF5QyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUE3QztBQURGOzs7QUFERjs7RUFSTTs7Ozs7O0FBWVYsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUN4QmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztBQUVSLGFBQUEsR0FBZ0IsU0FBQTtFQUNkLE9BQU8sQ0FBQyxHQUFSLENBQVksYUFBWjtTQUNBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBSTtBQUZMOztBQUloQixJQUFBLEdBQU8sU0FBQTtFQUNMLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjtTQUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixhQUExQixFQUF5QyxhQUF6QyxFQUF3RCxLQUF4RDtBQUZLOztBQUlQLElBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBNYXRjaFxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUgNzIwLCAxMjgwLCBQaGFzZXIuQ0FOVkFTLCAncGhhc2VyLWV4YW1wbGUnLCB7XHJcbiAgICAgIHByZWxvYWQ6ID0+IEBwcmVsb2FkKClcclxuICAgICAgY3JlYXRlOiAgPT4gQGNyZWF0ZSgpXHJcbiAgICB9XHJcblxyXG4gIHByZWxvYWQ6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcIk1hdGNoLnByZWxvYWQoKVwiXHJcbiAgICAjIEBnYW1lLmxvYWQuaW1hZ2UoJ2dlbXMnLCAnaW1nL2dlbXMucG5nJyk7XHJcbiAgICBAZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KCdnZW1zJywgJ2ltZy9nZW1zLnBuZycsIDgwLCA4MCwgLTEsIDIsIDQpXHJcblxyXG4gIGNyZWF0ZTogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiTWF0Y2guY3JlYXRlKClcIlxyXG4gICAgIyBAZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBAZ2FtZS5zY2FsZS5SRVNJWkVcclxuICAgIEBnYW1lLnNjYWxlLmZvcmNlT3JpZW50YXRpb24oZmFsc2UsIHRydWUpXHJcbiAgICBAZ2FtZS5zY2FsZS5yZWZyZXNoKClcclxuXHJcbiAgICBjb25zb2xlLmxvZyBcIiN7d2luZG93LmlubmVyV2lkdGh9eCN7d2luZG93LmlubmVySGVpZ2h0fVwiXHJcblxyXG4gICAgZm9yIGkgaW4gWzAuLjhdXHJcbiAgICAgIGZvciBqIGluIFswLi44XVxyXG4gICAgICAgIEBnYW1lLmFkZC5zcHJpdGUoaSAqIDgwLCBqICogODAsICdnZW1zJywgaSArIChqICogOCkpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoXHJcbiIsIk1hdGNoID0gcmVxdWlyZSAnLi9NYXRjaCdcclxuXHJcbm9uRGV2aWNlUmVhZHkgPSAtPlxyXG4gIGNvbnNvbGUubG9nKCdkZXZpY2VyZWFkeScpXHJcbiAgd2luZG93Lm1hdGNoID0gbmV3IE1hdGNoXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcImluaXRcIlxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5Jywgb25EZXZpY2VSZWFkeSwgZmFsc2UpXHJcblxyXG5pbml0KClcclxuIl19
