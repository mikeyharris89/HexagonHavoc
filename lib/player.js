var Player = function (options = {}) {
  this.game = options.game;
  this.name = options.name;
  this.keyCodes = options.keyCodes;
  this.color = options.color;
  this.xPos = options.pos[0];
  this.yPos = options.pos[1];
  this.velX = 0;
  this.velY = 0;
  this.speed = 5;
  this.radius = 10;
  this.friction = 0.75;
  this.addKeyListener();
};

var keys = [];

Player.prototype.draw = function (ctx) {
  this.move();
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.xPos, this.yPos, this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
};

Player.prototype.offPlatforms = function () {
  var player = this,
      platforms = player.game.platforms,
      pos = [player.xPos, player.yPos];

  for (var i = 0; i < platforms.length; i++) {
    if (player.game.pointInHexagon(pos, platforms[i].vertices)){
      return false;
    }
  }
  return true;
};

Player.prototype.addKeyListener = function () {
  window.addEventListener("keydown", function (e) { e.preventDefault(); keys[e.keyCode] = true;});
  window.addEventListener("keyup", function (e) { e.preventDefault(); keys[e.keyCode] = false;});
};


Player.prototype.move = function () {
  if (keys[this.keyCodes[0]]){
    if (this.velX > -this.speed){
        this.velX -= 5;
    }
  }  if (keys[this.keyCodes[1]]) {
    if (this.velY > -this.speed){
        this.velY -= 5;
    }
  }  if (keys[this.keyCodes[2]]) {
    if (this.velX < this.speed){
        this.velX += 5;
    }
  }  if (keys[this.keyCodes[3]]) {
    if (this.velY < this.speed){
        this.velY += 5;
    }
  }

  this.velY *= this.friction;
  this.yPos += this.velY;
  this.velX *= this.friction;
  this.xPos += this.velX;
};

module.exports = Player;
