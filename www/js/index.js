(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var init, onDeviceReady;

onDeviceReady = function() {
  var listeningElement, parentElement, receivedElement;
  parentElement = document.getElementById('deviceready');
  listeningElement = parentElement.querySelector('.listening');
  receivedElement = parentElement.querySelector('.received');
  listeningElement.setAttribute('style', 'display:none;');
  receivedElement.setAttribute('style', 'display:block;');
  return console.log('pretty cool setup');
};

init = function() {
  console.log("init");
  return document.addEventListener('deviceready', onDeviceReady, false);
};

init();


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dcXHNyY1xcbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGFBQUEsR0FBZ0IsU0FBQTtBQUNkLE1BQUE7RUFBQSxhQUFBLEdBQWdCLFFBQVEsQ0FBQyxjQUFULENBQXdCLGFBQXhCO0VBQ2hCLGdCQUFBLEdBQW1CLGFBQWEsQ0FBQyxhQUFkLENBQTRCLFlBQTVCO0VBQ25CLGVBQUEsR0FBa0IsYUFBYSxDQUFDLGFBQWQsQ0FBNEIsV0FBNUI7RUFDbEIsZ0JBQWdCLENBQUMsWUFBakIsQ0FBOEIsT0FBOUIsRUFBdUMsZUFBdkM7RUFDQSxlQUFlLENBQUMsWUFBaEIsQ0FBNkIsT0FBN0IsRUFBc0MsZ0JBQXRDO1NBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxtQkFBWjtBQU5jOztBQVFoQixJQUFBLEdBQU8sU0FBQTtFQUNMLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjtTQUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixhQUExQixFQUF5QyxhQUF6QyxFQUF3RCxLQUF4RDtBQUZLOztBQUlQLElBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJvbkRldmljZVJlYWR5ID0gLT5cclxuICBwYXJlbnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RldmljZXJlYWR5JylcclxuICBsaXN0ZW5pbmdFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubGlzdGVuaW5nJylcclxuICByZWNlaXZlZEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWNlaXZlZCcpXHJcbiAgbGlzdGVuaW5nRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6bm9uZTsnKVxyXG4gIHJlY2VpdmVkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6YmxvY2s7JylcclxuICBjb25zb2xlLmxvZygncHJldHR5IGNvb2wgc2V0dXAnKVxyXG5cclxuaW5pdCA9IC0+XHJcbiAgY29uc29sZS5sb2cgXCJpbml0XCJcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIG9uRGV2aWNlUmVhZHksIGZhbHNlKVxyXG5cclxuaW5pdCgpXHJcblxyXG4iXX0=
