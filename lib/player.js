var Player = function (options = {}) {
  this.name = options.name;
  this.xPos = 500;
  this.yPos = 300;
  this.velX = 0;
  this.velY = 0;
  this.speed = 10;
  this.radius = 10;
  this.friction = 0.75;
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
  window.addEventListener("keydown", this.fn, true);
  window.addEventListener("keyup", this.fn, false);
};

Player.prototype.move = function (e) {

  e.preventDefault();
  if (e.keyCode === 37){
    if (this.velX > -this.speed){
        this.velX -= 10;
    }
  } else if (e.keyCode === 38) {
    if (this.velY > -this.speed){
        this.velY -= 10;
    }
  } else if (e.keyCode === 39) {
    if (this.velX < this.speed){
        this.velX += 10;
    }
  } else if (e.keyCode === 40) {
    if (this.velY < this.speed){
        this.velY += 10;
    }
  }

  this.velY *= this.friction;
  this.yPos += this.velY;
  this.velX *= this.friction;
  this.xPos += this.velX;
};

module.exports = Player;
