var Game = require("./game.js");

var Flag = function (options = {} ) {
  this.colors = options.colors;
  this.color = this.randomColor();
  this.game = options.game;
};

Flag.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.moveTo(900, 75);
  ctx.lineTo(975, 75);
  ctx.lineTo(975, 150);
  ctx.lineTo(900, 150);
  ctx.closePath();

  ctx.fill();
};


Flag.prototype.randomColor = function (){
  return this.colors[Math.floor(Math.random() * this.colors.length)];
};

Flag.prototype.changeColor = function () {
  this.color = this.randomColor();
};

module.exports = Flag;
