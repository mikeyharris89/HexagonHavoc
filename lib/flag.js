var Game = require("./game.js");

var Flag = function (options = {} ) {
  this.colors = options.colors;
  this.issues = this.setIssues();
  this.color = this.colors[3];
  this.game = options.game;
};

Flag.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.moveTo(775, 75);
  ctx.lineTo(975, 75);
  ctx.lineTo(975, 150);
  ctx.lineTo(775, 150);
  ctx.closePath();

  ctx.fill();

  ctx.fillStyle = "black";
  ctx.font = '13px "New Super Mario Font (Mario Party 9)"';
  ctx.fillText(this.issues[this.color], 780, 120);
};

Flag.prototype.setIssues = function () {
  var topics = ["Healthcare", "Climate Change", "Education", "Guns", "Taxes", "Brexit", "Immigration"],
      issues = {};
  for (var i = 0; i < this.colors.length; i++) {
    issues[this.colors[i]] = topics[i];
  }
  return issues;
};

Flag.prototype.randomColor = function (){
  return this.colors[Math.floor(Math.random() * this.colors.length)];
};

Flag.prototype.changeColor = function () {
  this.color = this.randomColor();
};

module.exports = Flag;
