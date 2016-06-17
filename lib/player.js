var Player = function (options = {}) {
  this.name = options.name;
  this.xPos = 500;
  this.yPos = 300;
  this.xVel = 0;
  this.yVel = 0;
  this.speed = 2;
  this.radius = 10;
  this.friction = 0.98;
  this.addKeyListener();
};

Player.prototype.draw = function (ctx) {
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(
    this.xPos, this.yPos, this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
};

Player.prototype.addKeyListener = function () {
  this.fn = this.move.bind(this);
  window.addEventListener("keydown", this.fn, false);
};

Player.prototype.move = function (e) {
  e.preventDefault();
  if (e.keyCode === 37){
    this.xPos -= 5;
  } else if (e.keyCode === 38) {
    this.yPos -= 5;
  } else if (e.keyCode === 39) {
    this.xPos += 5;
  } else if (e.keyCode === 40) {
    this.yPos +=5;
  }

};

module.exports = Player;
