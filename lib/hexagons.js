var Game = require("./game"),
    GameView = require("./gameView");
    Platform = require("./platform");
    var COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#FFFF00", "#00CC00", "#7F00FF", "#00FFFF"];


document.addEventListener("DOMContentLoaded", function() {
  var canvasEl = document.getElementsByTagName("canvas")[0];
  var ctx = canvasEl.getContext("2d");
  game = new Game();
  new GameView(game, ctx).start();
});
